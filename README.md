# freshworks-crm

## Ajuste aplicado

Conforme solicitado, o dashboard criado anteriormente foi removido.

Agora o GitHub Pages exibe apenas o **site principal** em `public/index.html`.

## O que foi removido

- `public/dashboard.html`
- `public/dashboard.js`
- `public/dashboard-summary.json`

## Publicação no GitHub Pages

O workflow publica a pasta `public/` e valida os arquivos principais:

- `public/index.html`
- `public/main.js`
- `public/styles.css`
- `public/sql-server-setup.sql`

Também existe `index.html` na raiz com redirecionamento para `public/index.html` (compatibilidade com deploy por branch/root).

## Checklist rápido

1. **Settings → Pages**
2. Source:
   - `GitHub Actions` (recomendado), ou
   - `Deploy from branch → main/root`
3. Push na branch e validar workflow em **Actions**.

## Execução local

```bash
node src/server.js
```
