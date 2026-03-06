# freshworks-crm

## Auditoria de rastros legados

Foi realizada uma auditoria completa para identificar rastros do módulo legado criado anteriormente.

### Resultado da auditoria

Foram encontrados rastros apenas em conteúdo textual e script SQL de exemplo. Esses pontos foram corrigidos.

### Correções aplicadas

- `public/index.html` revisado para remover qualquer referência a módulo legado.
- `public/sql-server-setup.sql` reescrito para estrutura neutra (`FreshworksSite` + `site_settings`).
- `README.md` atualizado com status pós-auditoria.

## Estado atual

- Site principal ativo: `public/index.html`
- Script SQL neutro: `public/sql-server-setup.sql`
- Servidor local estático + healthcheck: `src/server.js`

## Execução local

```bash
node src/server.js
```
