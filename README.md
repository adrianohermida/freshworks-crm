# freshworks-crm

## Ajuste solicitado: dashboard não é mais a página inicial

Foi aplicado o ajuste para que a **home prevaleça** e o dashboard não se sobreponha mais.

### Resultado

- `public/index.html` agora é a página inicial do projeto (landing/home).
- O dashboard foi movido para `public/dashboard.html`.
- A lógica do painel está em `public/dashboard.js`.
- O arquivo `public/main.js` foi mantido apenas para compatibilidade da home.

## Rotas estáticas

- Home: `/`
- Dashboard: `/dashboard.html`
- Script SQL Server: `/sql-server-setup.sql`

## Observação sobre arquivos React citados

Você mencionou alterações em `App.jsx`, `main.jsx`, `Layout.jsx`, `pages/`, `pages.config.js`, `index.css`, `globals.css`, `api/`, `hooks/`, `lib/`, `utils/`.

No estado atual deste repositório, esses arquivos/pastas não estão presentes. Por isso, apliquei a correção na estrutura existente (`public/` + `src/server.js`) para garantir que sua home não seja sobrescrita pelo dashboard.

Se você quiser, no próximo passo eu também posso reconstruir a estrutura React/Vite e encaixar exatamente nesses arquivos.

## Execução local

```bash
node src/server.js
```
