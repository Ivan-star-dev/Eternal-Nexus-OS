-- ARTIFACT-MEMORY-001 + SESSION-CONTINUITY-001
-- Migration: artifact memory layer + session snapshot persistence
-- Date: 2026-03-28

-- ─── ARTIFACTS ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS artifacts (
  artifact_id       TEXT PRIMARY KEY,                    -- ART-{date}-{uuid}
  user_id           UUID REFERENCES auth.users(id),
  session_id        TEXT NOT NULL,
  kind              TEXT NOT NULL CHECK (kind IN (
    'research', 'note', 'plan', 'simulation',
    'draft', 'code', 'synthesis', 'decision'
  )),
  title             TEXT NOT NULL,
  summary           TEXT NOT NULL DEFAULT '',
  content           TEXT NOT NULL DEFAULT '',
  tags              TEXT[] NOT NULL DEFAULT '{}',
  source            TEXT NOT NULL DEFAULT 'manual' CHECK (source IN (
    'nexus', 'lab', 'atlas', 'manual', 'import'
  )),
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'archived', 'draft', 'sealed'
  )),
  version           INTEGER NOT NULL DEFAULT 1,
  ts_created        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ts_updated        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ts_last_accessed  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update ts_updated on row change
CREATE OR REPLACE FUNCTION update_artifact_ts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ts_updated = now();
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artifact_update_ts
  BEFORE UPDATE ON artifacts
  FOR EACH ROW EXECUTE FUNCTION update_artifact_ts();

-- Indexes for common access patterns
CREATE INDEX IF NOT EXISTS idx_artifacts_user_id        ON artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_session_id     ON artifacts(session_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_kind           ON artifacts(kind);
CREATE INDEX IF NOT EXISTS idx_artifacts_status         ON artifacts(status);
CREATE INDEX IF NOT EXISTS idx_artifacts_ts_updated     ON artifacts(ts_updated DESC);
CREATE INDEX IF NOT EXISTS idx_artifacts_ts_accessed    ON artifacts(ts_last_accessed DESC);

-- Full-text search index on title + summary + content
CREATE INDEX IF NOT EXISTS idx_artifacts_fts ON artifacts
  USING gin(to_tsvector('english', title || ' ' || summary || ' ' || content));

-- RLS
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_artifacts"
  ON artifacts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE artifacts;


-- ─── SESSION SNAPSHOTS ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS session_snapshots (
  snapshot_id       TEXT PRIMARY KEY,                    -- SNAP-{date}-{uuid}
  user_id           UUID REFERENCES auth.users(id),
  session_id        TEXT NOT NULL,
  active_face       TEXT NOT NULL DEFAULT 'nexus_cria' CHECK (active_face IN (
    'heaven_lab', 'bridge_nova', 'nexus_cria'
  )),
  re_entry_point    TEXT NOT NULL DEFAULT '',
  latest_fruit      TEXT NOT NULL DEFAULT '',
  next_expected_step TEXT NOT NULL DEFAULT '',
  subject           TEXT NOT NULL DEFAULT '',
  scroll_path       TEXT,
  scroll_y          INTEGER DEFAULT 0,
  open_panels       TEXT[] NOT NULL DEFAULT '{}',
  ts_created        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ts_last_active    TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_expired        BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_snapshots_user_id     ON session_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_session_id  ON session_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_active      ON session_snapshots(user_id, ts_last_active DESC) WHERE NOT is_expired;

-- RLS
ALTER TABLE session_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_snapshots"
  ON session_snapshots FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
