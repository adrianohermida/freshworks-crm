<<<<<<< HEAD
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
=======
# freshworks-crm

Base inicial de uma **página operacional para escritório de advocacia**, preparada para evoluir para um dashboard com integrações de DataJud, Freshdesk, Freshworks CRM e Advise.

## Correção aplicada para GitHub Pages

O projeto agora funciona em 2 modos:

1. **Modo servidor local (Node + SQLite)**
   - A página busca dados em `./api/dashboard/summary`.
2. **Modo GitHub Pages (estático)**
   - Se a API não existir, a página usa fallback automático em `./dashboard-summary.json`.

Também foram trocados caminhos absolutos (`/arquivo`) por relativos (`./arquivo`), evitando quebra em repositórios publicados em subpath no GitHub Pages.

## Estrutura

- `public/`
  - `index.html`: home do dashboard + guia de configuração SQL Server.
  - `main.js`: renderiza KPIs e cards, com fallback automático para modo estático.
  - `styles.css`: layout e estilos.
  - `dashboard-summary.json`: fallback estático para GitHub Pages.
  - `sql-server-setup.sql`: script inicial para SQL Server.

- `src/`
  - `server.js`: servidor HTTP, rota de saúde, rota de dados e estáticos.
  - `services/database.js`: inicialização e consultas em SQLite local.
  - `services/dashboardService.js`: agregações de indicadores.
  - `config/integrations.js`: catálogo base de integrações.

## SQL Server no Windows 11 (você ainda não executou o script)

Como você importou o repositório no SQL mas ainda não executou o script, rode primeiro:

- `public/sql-server-setup.sql` (ou `http://localhost:3000/sql-server-setup.sql` com servidor local ligado)

Depois valide no SSMS com:

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

## Endpoints

- `GET /` → página inicial
- `GET /health` → saúde do servidor
- `GET /api/dashboard/summary` → dados operacionais
- `GET /sql-server-setup.sql` → script para SQL Server
>>>>>>> c1f773578b3ce27afce95c807fb7d38fae3be70d
