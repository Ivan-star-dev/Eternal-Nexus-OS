#!/usr/bin/env bash
# scripts/test-db.sh
# ═══════════════════════════════════════════════════════════════
# Local pgTAP test runner
#
# Usage:
#   ./scripts/test-db.sh              # All tests
#   ./scripts/test-db.sh rls          # RLS tests only
#   ./scripts/test-db.sh schema       # Schema/aggregation tests
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

SUITE="${1:-all}"
CONTAINER_NAME="npi-pgtap-test"
DB_PORT=54321
DB_PASSWORD="testpass"
DB_NAME="test_npi"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

cleanup() {
  echo -e "${YELLOW}▸ Cleaning up...${NC}"
  docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
}
trap cleanup EXIT

# Start Postgres in RAM
echo -e "${YELLOW}▸ Starting PostgreSQL in RAM...${NC}"
docker run -d \
  --name "$CONTAINER_NAME" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="$DB_NAME" \
  -p "$DB_PORT:5432" \
  --tmpfs /var/lib/postgresql/data:rw,size=512m \
  --shm-size=256m \
  postgres:16-alpine \
  postgres -c fsync=off -c full_page_writes=off -c synchronous_commit=off -c max_connections=20

# Wait for ready
echo -e "${YELLOW}▸ Waiting for database...${NC}"
for i in $(seq 1 30); do
  if pg_isready -h localhost -p "$DB_PORT" -U postgres &>/dev/null; then
    break
  fi
  sleep 1
done

PSQL="psql postgresql://postgres:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"

# Setup extensions
echo -e "${YELLOW}▸ Installing extensions...${NC}"
$PSQL -q -c "CREATE EXTENSION IF NOT EXISTS pgtap;"

# Create Supabase-compatible roles
$PSQL -q <<'SQL'
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
END $$;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
SQL

# Run migrations
echo -e "${YELLOW}▸ Applying migrations...${NC}"
for f in supabase/migrations/*.sql; do
  echo "  ▸ $(basename "$f")"
  $PSQL -v ON_ERROR_STOP=1 -f "$f" -q 2>/dev/null || true
done

# Grants
$PSQL -q -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;"

# Select test files and fixtures
case "$SUITE" in
  rls)
    if [ -f "supabase/tests/fixtures/rls_fixtures.sql" ]; then
      echo -e "${YELLOW}▸ Loading RLS fixtures...${NC}"
      $PSQL -v ON_ERROR_STOP=1 -f "supabase/tests/fixtures/rls_fixtures.sql" -q
    fi
    TEST_FILES="supabase/tests/rls_*.test.sql supabase/tests/rls_policy_definitions.test.sql"
    ;;
  schema)
    TEST_FILES="supabase/tests/aggregation.test.sql"
    ;;
  timeseries)
    if [ -f "supabase/tests/fixtures/timeseries_fixtures.sql" ]; then
      echo -e "${YELLOW}▸ Loading timeseries fixtures...${NC}"
      $PSQL -v ON_ERROR_STOP=1 -f "supabase/tests/fixtures/timeseries_fixtures.sql" -q
    fi
    TEST_FILES="supabase/tests/aggregation.test.sql"
    ;;
  all)
    if [ -f "supabase/tests/fixtures/rls_fixtures.sql" ]; then
      $PSQL -v ON_ERROR_STOP=1 -f "supabase/tests/fixtures/rls_fixtures.sql" -q
    fi
    TEST_FILES=$(ls supabase/tests/*.test.sql supabase/tests/*.sql 2>/dev/null | grep -v fixtures || true)
    ;;
  *)
    echo -e "${RED}Unknown suite: $SUITE${NC}" >&2
    echo "Usage: $0 [rls|schema|timeseries|all]"
    exit 1
    ;;
esac

echo -e "${YELLOW}▸ Running tests ($SUITE)...${NC}"
START_TIME=$(date +%s)

pg_prove \
  --host localhost \
  --port "$DB_PORT" \
  --username postgres \
  --dbname "$DB_NAME" \
  --verbose --failures --timer \
  $TEST_FILES

EXIT_CODE=$?
ELAPSED=$(( $(date +%s) - START_TIME ))

if [ $EXIT_CODE -eq 0 ]; then
  echo -e "\n${GREEN}✅ All tests passed in ${ELAPSED}s${NC}"
else
  echo -e "\n${RED}❌ Failures detected (${ELAPSED}s)${NC}"
fi

exit $EXIT_CODE
