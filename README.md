# freshworks-crm

## Ajuste refeito do site (Hermida Maia Advocacia)

Refiz a implementação do site existente em `src/`, sem criar nova página, com foco em estabilidade para GitHub Pages.

## O que foi revisado

- Estrutura da home mantida em `src/index.html`.
- Fluxo de renderização revisado (`src/main.js` → `src/App.js` → `src/Layout.js` + `src/pages/home.js`).
- `src/pages.config.js` agora é efetivamente usado pelo app.
- Conteúdo da página ajustado para Hermida Maia Advocacia.
- CSS refinado para melhorar legibilidade e consistência visual.

## Compatibilidade GitHub Pages

- Deploy continua publicando `src/` via workflow.
- Módulos em `.js` (evitando problema de MIME comum com `.jsx` em hosting estático).

## Execução local

```bash
node src/server.js
```

## Healthcheck

- `GET /health`
