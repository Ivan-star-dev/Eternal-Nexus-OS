# AGENT PROTOCOL

## Ordem obrigatória
1. `./.ops/doctor.sh`
2. `./.ops/bootstrap.sh`
3. `./.ops/check.sh`

## Antes de operação arriscada
- `./.ops/snapshot.sh "reason"`

## Antes de merge/rebase grande
- `./.ops/merge-safe.sh origin/main`

## Depois de qualquer change set coerente
1. `./.ops/check.sh`
2. `./.ops/review.sh`

## Se houver problema de dependências/caches
1. `./.ops/repair-install.sh`
2. `./.ops/repair-cache.sh`
3. `./.ops/check.sh`

## Se houver conflito
1. `./.ops/find-conflicts.sh`
2. resolver só os ficheiros em conflito
3. `git add <ficheiros>`
4. `./.ops/check.sh`
5. `git commit -m "resolve conflicts"`

## Se tudo correr mal
- `./.ops/rollback.sh HEAD~1`

## Regras
- Não editar lockfiles manualmente.
- Não fazer refactors especulativos durante resolução de bug.
- Não tocar em ficheiros fora do escopo do problema.
- Não terminar com conflict markers, build quebrado, typecheck quebrado ou testes a falhar.
