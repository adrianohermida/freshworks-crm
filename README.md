# freshworks-crm

## Site restaurado (sem dashboard)

Conforme solicitado, o dashboard foi removido e o site principal do repositório foi restabelecido.

### O que foi ajustado

- `public/index.html` agora exibe apenas a home principal.
- `public/main.js` não possui mais lógica de dashboard.
- Backend simplificado em `src/server.js` para servir site estático e `GET /health`.
- Removidos arquivos e serviços de dashboard:
  - `src/services/dashboardService.js`
  - `src/services/database.js`
  - `src/config/integrations.js`

## GitHub Pages

O deploy continua publicado a partir da pasta `public/` via workflow:

- `.github/workflows/deploy-pages.yml`

## Execução local

```bash
node src/server.js
```
