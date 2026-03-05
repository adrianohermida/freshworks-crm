# freshworks-crm

Base inicial de uma **página inicial operacional para escritório de advocacia**, preparada para evoluir para um dashboard com integrações de DataJud, Freshdesk, Freshworks CRM e Advise.

## Análise estrutural aplicada

A estrutura foi organizada em camadas para facilitar manutenção e evolução:

- **Camada de apresentação (`public/`)**
  - `index.html`: layout principal da página inicial.
  - `main.js`: renderização de KPIs e cards das integrações a partir da API.
  - `styles.css`: identidade visual inicial para uso jurídico/operacional.

- **Camada de API (`src/routes/`)**
  - Endpoint `GET /api/dashboard/summary` para abastecer a página com dados consolidados.

- **Camada de serviços (`src/services/`)**
  - `database.js`: conexão, inicialização e leitura do banco SQL local (SQLite).
  - `dashboardService.js`: regra de agregação e cálculo dos indicadores operacionais.

- **Configuração de domínio (`src/config/`)**
  - `integrations.js`: catálogo das integrações estratégicas do escritório.

- **Bootstrap da aplicação (`src/server.js`)**
  - Cria pasta de dados local.
  - Inicializa banco.
  - Expõe API e arquivos estáticos.

## Banco de dados SQL local (PC)

Este projeto usa **SQLite local** por padrão, armazenando o arquivo em:

```bash
data/advocacia-dashboard.sqlite
```

Você pode alterar o caminho com variável de ambiente:

```bash
LOCAL_DB_PATH="/caminho/no/seu/pc/dashboard.sqlite"
```

## Como executar

1. Instale dependências:

```bash
npm install
```

2. Inicie a aplicação:

```bash
npm start
```

3. Acesse:

- Página inicial: `http://localhost:3000`
- Saúde da API: `http://localhost:3000/health`
- Dados do dashboard: `http://localhost:3000/api/dashboard/summary`

## Próximos passos sugeridos

1. Criar tabela de `processos` com número CNJ, polo, fase e prazos.
2. Criar tabela de `clientes` com vínculo ao CRM.
3. Adicionar fila de sincronização com DataJud e Freshdesk.
4. Incluir autenticação com perfis (sócio, coordenador, advogado, assistente).
5. Adicionar métricas operacionais: SLA de resposta, risco de prazo, taxa de êxito.
