# freshworks-crm

Base inicial de uma **página operacional para escritório de advocacia**.

## Revisão dos conflitos do sprint (causa e correção)

A principal causa de conflito era a duplicação dos mesmos arquivos estáticos em dois lugares:

- raiz do repositório (`index.html`, `main.js`, etc.)
- pasta `public/`

Isso aumentava conflitos de merge e deixava o deploy mais frágil.

### O que foi corrigido

- **Fonte única de frontend em `public/`**.
- Workflow do GitHub Pages atualizado para publicar **diretamente `public/`**.
- `.nojekyll` é criado no passo de deploy para evitar interferência de Jekyll.

Com isso, cada alteração de frontend acontece em apenas um local, reduzindo conflitos no sprint.

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
