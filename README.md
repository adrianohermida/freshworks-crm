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
**Welcome to your Base44 project** 

**About**

View and Edit  your app on [Base44.com](http://Base44.com) 

This project contains everything you need to run your app locally.

**Edit the code in your local development environment**

Any change pushed to the repo will also be reflected in the Base44 Builder.

**Prerequisites:** 

1. Clone the repository using the project's Git URL 
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.
VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6
VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
```

Run the app: `npm run dev`

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)

## Execução local

```bash
node src/server.js
```

