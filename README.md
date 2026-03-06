# freshworks-crm

## Ajuste refeito do site (Hermida Maia Advocacia)

Refiz a configuração de publicação para garantir que o site existente em `src/` execute corretamente no GitHub Pages.

## O que foi ajustado agora

- Mantida a página existente em `src/index.html` (sem criar páginas novas).
- Workflow do GitHub Pages atualizado para:
  - disparar em push de qualquer branch;
  - validar os arquivos necessários em `src/`;
  - montar artifact `_site/` com os arquivos de `src/` na raiz do deploy.
- Isso evita falhas de execução por caminho/subpasta e garante que `index.html` publicado aponte corretamente para `main.js`.

## Estrutura publicada no Pages

A partir de `src/`:

- `index.html`
- `main.js`
- `App.js`
- `Layout.js`
- `pages/home.js`
- `globals.css`
- `index.css`
- `sql-server-setup.sql`

## Execução local

```bash
node src/server.js
```

## Healthcheck

- `GET /health`
