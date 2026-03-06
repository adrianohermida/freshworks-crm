# freshworks-crm

Base inicial de uma **página operacional para escritório de advocacia**.

## Correção para PR travado em conflitos (mesmo após limpar marcadores)

Quando o GitHub não deixa avançar, mesmo depois de você remover os marcadores no editor web, normalmente é porque:

- algum arquivo ainda não foi marcado como resolvido na UI;
- existe conflito residual em outro arquivo;
- a branch do PR está desatualizada com `main` e precisa de merge local.

### Solução aplicada no projeto

- checker robusto de marcadores com arquivo + linha: `scripts/check-conflict-markers.js`;
- script guiado de resolução local: `scripts/resolve-pr-conflicts.sh`;
- comando pronto: `npm run resolve:conflicts`.

## Fluxo recomendado (resolve de verdade)

No seu terminal local:

```bash
git checkout sua-branch-do-pr
git fetch origin
npm run resolve:conflicts
```

Se o script indicar conflito, ele lista os arquivos. Depois:

```bash
git add -A
npm run check:conflicts
git commit -m "Resolve merge conflicts"
git push
```

Depois disso, o PR destrava e permite seguir.

## GitHub Pages (configuração correta)

1. Vá em **Settings → Pages**.
2. Em **Build and deployment**, selecione **Source: GitHub Actions**.
3. Faça push na branch `main` (ou `master`).
4. Verifique em **Actions** a execução do workflow `Deploy static site to GitHub Pages`.

## Estrutura atual

- `public/` → frontend estático publicado no GitHub Pages
- `src/` → servidor local Node + SQLite para modo API local

## Funcionamento da página

- Tenta buscar `./api/dashboard/summary` (modo servidor local).
- Se não houver API (GitHub Pages), usa `./dashboard-summary.json`.

## SQL Server no Windows 11

Execute o script:

- `public/sql-server-setup.sql`

Validação no SSMS:

```sql
USE AdvocaciaOperacional;
GO
SELECT COUNT(*) AS total_integracoes FROM dbo.integrations_status;
GO
SELECT TOP 4 integration_key, integration_name, status
FROM dbo.integrations_status
ORDER BY integration_name;
```

Esperado: `total_integracoes = 4`.

## Execução local

```bash
node src/server.js
```
