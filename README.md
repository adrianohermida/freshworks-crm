# freshworks-crm

## Site definido dentro de `src/`

Conforme solicitado, o site foi reestruturado para usar **`src/` como origem principal**.

### Estrutura principal

- `src/index.html`
- `src/main.jsx`
- `src/App.jsx`
- `src/Layout.jsx`
- `src/pages/`
- `src/pages.config.js`
- `src/index.css`
- `src/globals.css`
- `src/api/`
- `src/hooks/`
- `src/lib/`
- `src/utils/`

## O que foi ajustado

- Servidor local (`src/server.js`) agora serve arquivos estáticos de `src/`.
- Workflow do GitHub Pages agora publica a pasta `src/`.
- `index.html` da raiz redireciona para `src/index.html`.
- Conteúdo antigo em `public/` foi removido para evitar sobreposição/confusão.

## Execução local

```bash
node src/server.js
```

## Healthcheck

- `GET /health`
