# freshworks-crm

Base inicial de uma **página operacional para escritório de advocacia**.

## Auditoria de GitHub Pages (Jekyll) e correções

Para eliminar problemas de publicação no Pages, o projeto agora publica por **GitHub Actions** (sem depender do build automático do Jekyll):

- Workflow: `.github/workflows/deploy-pages.yml`
- Artefatos publicados: `index.html`, `main.js`, `styles.css`, `dashboard-summary.json`, `sql-server-setup.sql`, `.nojekyll`
- Resultado: deploy previsível mesmo com Jekyll instalado localmente.

Também foi adicionado `_config.yml` com `include` explícito para `.json` e `.sql`.

## O que você precisa configurar no GitHub (1x)

1. Vá em **Settings → Pages**.
2. Em **Build and deployment**, escolha **Source: GitHub Actions**.
3. Faça push na branch (`main` ou `master`) para disparar o workflow.
4. Acompanhe em **Actions → Deploy static site to GitHub Pages**.

## Funcionamento da página

- Tenta buscar `./api/dashboard/summary` (modo servidor local).
- Se não houver API (GitHub Pages), cai automaticamente em `./dashboard-summary.json`.

## SQL Server no Windows 11

Você comentou que ainda não executou o script. Rode:

- `sql-server-setup.sql` (raiz)

Depois valide no SSMS:

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
