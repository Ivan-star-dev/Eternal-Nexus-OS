# DEPLOY MODEL — Eternal Nexus OS

> Como o código vai de branch canónico para produção.
> Pipeline completo: branch → PR → gates → merge → Vercel → owner.

_DEPLOY_MODEL.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_

---

## 1. PRINCÍPIO DE DEPLOY

O sistema não tem deploy manual. O pipeline é determinístico:

```
Branch canónico → PR → CI gates → squash merge → main → Vercel auto-deploy
```

Nenhum código vai para produção sem passar pelos gates de CI.
Nenhum pioneer escreve directamente em `main`.
Nenhum deploy ocorre sem o branch guard passar.

---

## 2. PIPELINE COMPLETO

```
PIPELINE DE DEPLOY
═══════════════════════════════════════════════════════════

1. BRANCH CANÓNICO
   → Pioneer commita e faz push para branch canónico activo
   → Ex: claude/rebuild-bastion-core-rihGX
   → Vercel gera preview deploy imediatamente

2. PULL REQUEST
   → PR aberto de branch canónico → main
   → Pode ser aberto automaticamente por auto-pr.yml
   → Título: segue convenção de feat/fix/chore + task ID

3. CI GATES (obrigatórios — falha bloqueia merge)
   ├── app-quality.yml
   │     ├── tsc --noEmit → zero TypeScript errors
   │     └── vite build → build de produção sem erros
   ├── performance-gates.yml
   │     ├── LCP < 2.5s
   │     ├── TTI < 4s
   │     └── bundle size inicial < 500KB gzip
   ├── protocol-gates.yml
   │     └── branch guard → rejeita writes directos a main
   └── ci.yml
         └── Playwright E2E suite → 100% pass

4. MERGE
   → Squash merge (todos os commits do branch → 1 commit em main)
   → Mensagem do commit: título do PR + task ID
   → Branch canónico arquivado (nunca deletado)

5. VERCEL AUTO-DEPLOY
   → Push para main → Vercel detecta → build + deploy automático
   → URL de produção atualizada em segundos
   → Sem downtime (Vercel atomic deploys)

6. VERIFICAÇÃO PÓS-DEPLOY
   → Owner verifica superfície em produção
   → Se OK → handoff registado em HANDOFF_LEDGER.md
   → Se NOK → rollback (ver Secção 6)
═══════════════════════════════════════════════════════════
```

---

## 3. PREVIEW DEPLOYS

Cada push para qualquer branch gera um preview deploy no Vercel:

```
Push para claude/rebuild-bastion-core-rihGX
  └── Vercel detecta → build → preview URL única
        Ex: https://eternal-nexus-os-<hash>.vercel.app
```

**Uso dos previews:**
- Verificação visual antes de abrir PR
- Owner pode rever superfícies sem afectar produção
- Testes de regressão visual por pioneer

---

## 4. VARIÁVEIS DE AMBIENTE EM PRODUÇÃO

As seguintes variáveis devem estar configuradas no painel Vercel:

| Variável | Ambiente | Obrigatória |
|---|---|---|
| `VITE_SUPABASE_URL` | Production + Preview | Sim |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Production + Preview | Sim |

**Rotação de keys:** qualquer rotação de key Supabase requer actualização imediata nas variáveis Vercel. Ausência → build deploya mas aplicação falha a inicializar.

---

## 5. BRANCH GUARD — PROTECÇÃO DE MAIN

O `protocol-gates.yml` implementa branch guard que:
- Rejeita qualquer commit directo em `main` por pioneiro
- Rejeita merges sem squash (histórico limpo obrigatório)
- Verifica que o PR vem do branch canónico activo registado em `ops/LIVE_STATE.md`

**O que acontece se um pioneer tentar escrever em main:**
```
STOP-1 activado → pipeline rejeita → pioneer notificado → sem deploy
```

---

## 6. ROLLBACK — PROCEDIMENTO DE REVERTER

O sistema não tem rollback automático. Procedimento manual:

```
ROLLBACK PROCEDURE
═══════════════════════════════════════════════════════════

1. Identificar o commit problemático em main
   git log --oneline main

2. Criar branch de rollback
   git checkout -b fix/rollback-<task-id> main

3. Reverter o commit problemático
   git revert <commit-hash> --no-edit

4. Push e abrir PR
   git push origin fix/rollback-<task-id>
   → PR: "revert: [descrição do problema]"

5. CI gates → merge → Vercel re-deploy com revert
   → Produção restaurada ao estado anterior

6. Registar em HANDOFF_LEDGER.md
   → Entrada com motivo, commit revertido, e próximas acções
═══════════════════════════════════════════════════════════
```

**Regra:** nunca usar `git reset --hard` em `main`. Sempre revert + novo PR. O histórico de main é imutável.

---

## 7. AMBIENTE DE DESENVOLVIMENTO LOCAL

```bash
# Instalar dependências
npm install

# Variáveis de ambiente locais (criar ficheiro .env.local)
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>

# Arrancar servidor de desenvolvimento
npm run dev
# → localhost:8080

# Verificar TypeScript (zero errors obrigatório antes de commit)
npm run typecheck

# Build de produção local
npm run build

# Correr E2E tests
npm run test:e2e
```

**Regra de commit:** pioneer não commita com TypeScript errors. `npm run typecheck` antes de cada commit.

---

## 8. CICLO COMPLETO POR SPRINT

```
SPRINT CYCLE
═══════════════════════════════════════════════════════════

1. Owner abre gate de versão → BASTION actualizado
2. Branch canónico criado (ou reutilizado se sprint contínuo)
3. Pioneers executam tasks → commits no branch canónico
4. Cada task concluída → handoff + commit + push
5. Vercel gera preview por push
6. Owner revê previews durante sprint
7. Sprint fecha → PR aberto de branch canónico → main
8. CI gates passam → squash merge → deploy produção
9. HANDOFF_LEDGER actualizado
10. Branch arquivado → próximo sprint inicia
═══════════════════════════════════════════════════════════
```

---

_DEPLOY_MODEL.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_
