# freshworks-crm

## Auditoria e ajuste do novo site (Hermida Maia Advocacia)

Foi realizada auditoria da estrutura em `src/` e aplicadas correções para funcionamento no GitHub Pages sem criar nova página.

## Correções aplicadas

- Mantida apenas a página existente do site em `src/index.html`.
- Conteúdo ajustado para **Hermida Maia Advocacia**.
- Migração de módulos de `.jsx` para `.js` para evitar problemas de MIME no GitHub Pages estático.
- Workflow do Pages atualizado para validar os arquivos atuais (`main.js`, `App.js`, `Layout.js`).
- Servidor local permanece servindo o site diretamente de `src/`.

## Estrutura atual do site

- `src/index.html`
- `src/main.js`
- `src/App.js`
- `src/Layout.js`
- `src/pages/home.js`
- `src/index.css`
- `src/globals.css`

## Execução local

```bash
node src/server.js
```
