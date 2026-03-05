# freshworks-crm

Base inicial de uma **página inicial operacional para escritório de advocacia**, preparada para evoluir para um dashboard com integrações de DataJud, Freshdesk, Freshworks CRM e Advise.

## O que foi corrigido

- Garantia de carregamento da página inicial com backend HTTP local e endpoint funcional de resumo.
- Inclusão no frontend de uma seção completa para configuração do **SQL Server local no Windows 11**.
- Disponibilização de script SQL pronto em `public/sql-server-setup.sql` para criar banco/tabela e carga inicial.

## Estrutura

- `public/`
  - `index.html`: home do dashboard + guia de configuração SQL Server.
  - `main.js`: renderiza KPIs e cards a partir da API.
  - `styles.css`: layout e estilos.
  - `sql-server-setup.sql`: script inicial para SQL Server.

- `src/`
  - `server.js`: servidor HTTP, rota de saúde, rota de dados e arquivos estáticos.
  - `services/database.js`: inicialização e consultas em SQLite local para ambiente de desenvolvimento.
  - `services/dashboardService.js`: agregações dos indicadores.
  - `config/integrations.js`: integrações base do escritório.

## Banco local no seu PC

### Desenvolvimento rápido

Por padrão, o projeto usa SQLite local em:

```bash
data/advocacia-dashboard.sqlite
```

Você pode mudar com:

```bash
LOCAL_DB_PATH="C:/seu/caminho/advocacia-dashboard.sqlite"
```

### Preparação para SQL Server (Windows 11)

1. Habilite TCP/IP no SQL Server Configuration Manager.
2. Reinicie a instância SQL Server.
3. Abra o SSMS e rode o script:
   - `http://localhost:3000/sql-server-setup.sql`
4. Configure credenciais (exemplo):

```bash
DB_CLIENT=sqlserver
DB_HOST=localhost
DB_PORT=1433
DB_NAME=AdvocaciaOperacional
DB_USER=sa
DB_PASSWORD=SuaSenhaForte
```

## Como executar

```bash
node src/server.js
```

## Endpoints

- `GET /` → página inicial
- `GET /health` → saúde do servidor
- `GET /api/dashboard/summary` → dados operacionais
- `GET /sql-server-setup.sql` → script para SQL Server local
