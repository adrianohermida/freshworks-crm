# 📋 PLANO DE INTEGRAÇÃO ADVISE - BASE44

## 🎯 Objetivo
Criar uma integração **100% modular, replicável e testada** da API do Advise no Base44, funcionando como um "instalador" para outras instâncias.

---

## 📊 ENDPOINTS ADVISE MAPEADOS

### 1️⃣ **PUBLICAÇÕES** (Publications)
Consulta publicações baseadas em palavras-chave cadastradas

| Função | Endpoint | Método | Status |
|--------|----------|--------|--------|
| Listar publicações | `/core/v1/publicacoes-clientes` | GET | ✅ IMPLEMENTADO |
| Listar paginado | `/core/v1/publicacoes-clientes/consulta-paginada` | GET | ✅ IMPLEMENTADO |
| Marcar como lido | `/core/v1/publicacoes-clientes/marcar-lidos` | PUT | ✅ IMPLEMENTADO |
| Desmarcar lido | `/core/v1/publicacoes-clientes/desmarcar-lidos` | PUT | ✅ IMPLEMENTADO |

### 2️⃣ **INTIMAÇÕES** (Notices)
Monitoramento de intimações de processos

| Função | Endpoint | Método | Status |
|--------|----------|--------|--------|
| Listar fontes | `/core/v1/intimacao/ConsultaFonteIntimacoes` | GET | 📝 PLANEJADO |
| Registrar credenciais | `/core/v1/intimacao` | POST | 📝 PLANEJADO |
| Listar intimações | `/core/v1/intimacoes-clientes` | GET | 📝 PLANEJADO |
| Ativar pesquisa | `/core/v1/intimacao/ativar-pesquisa` | PUT | 📝 PLANEJADO |
| Inativar pesquisa | `/core/v1/intimacao/inativar-pesquisa` | PUT | 📝 PLANEJADO |
| Excluir pesquisa | `/core/v1/intimacao/excluir-pesquisa` | PUT | 📝 PLANEJADO |
| Marcar como lido | `/core/v1/movimento-processo-cliente-lido/marcar` | PUT | 📝 PLANEJADO |

### 3️⃣ **PROCESSOS** (Cases)
Gerenciamento completo de processos judiciais

| Função | Endpoint | Método | Status |
|--------|----------|--------|--------|
| Cadastrar processo | `/core/v1/processos-clientes` | POST | 📝 PLANEJADO |
| Listar fontes processo | `/core/v1/processos-clientes/fontes-processos` | GET | 📝 PLANEJADO |
| Alterar situação | `/core/v1/processos-clientes/alterar-situacao` | PUT | 📝 PLANEJADO |
| Listar andamentos | `/core/v1/processos-clientes/andamentos` | GET | 📝 PLANEJADO |
| Andamentos paginado | `/core/v1/processos-clientes/andamentos-paginado` | GET | 📝 PLANEJADO |
| Marcar andamentos lidos | `/core/v1/processos-clientes/marcar-lidos` | PUT | 📝 PLANEJADO |
| Cabeçalho processo | `/core/v1/cabecalhos-processos` | GET | 📝 PLANEJADO |
| Info adicionais | `/core/v1/processos-clientes/informacoes-adicionais` | GET | 📝 PLANEJADO |
| Pesquisar anexos | `/core/v1/processos-clientes/anexos` | POST | 📝 PLANEJADO |
| Download anexo | `/core/v1/anexo-fonte-processo/{id}` | GET | 📝 PLANEJADO |
| Excluir processo | `/core/v1/processos-clientes/excluir-pesquisas-por-processos` | POST | 📝 PLANEJADO |

---

## 🏗️ ARQUITETURA DE IMPLEMENTAÇÃO

### Estrutura de Pastas
```
base44-advise-integration/
├── functions/
│   ├── advise/
│   │   ├── baseAdviseClient.js         (Cliente base reutilizável)
│   │   ├── publicacoes.js              (Endpoints de publicações)
│   │   ├── intimacoes.js               (Endpoints de intimações)
│   │   ├── processos.js                (Endpoints de processos)
│   │   └── sync/
│   │       ├── syncAdvisePublications.js
│   │       ├── syncAdviseIntimations.js
│   │       └── syncAdviseProcesses.js
│   └── webhooks/
│       └── adviseWebhook.js            (Webhook receiver - future)
│
├── entities/
│   ├── AdviseConfig.json               (Config da integração)
│   ├── PublicacaoAdvise.json
│   ├── IntimacaoAdvise.json
│   ├── ProcessoAdvise.json
│   ├── AndamentoAdvise.json
│   └── IntegrationLog.json             (Audit trail)
│
├── pages/
│   ├── AdviseIntegration.jsx           (Setup wizard)
│   ├── PublicacoesAdvise.jsx           (Dashboard publicações)
│   ├── IntimalcoesAdvise.jsx           (Dashboard intimações)
│   └── ProcessosAdvise.jsx             (Dashboard processos)
│
├── components/
│   ├── advise/
│   │   ├── AdviseConfigForm.jsx        (Formulário de config)
│   │   ├── PublicacoesList.jsx
│   │   ├── IntimacoesList.jsx
│   │   ├── ProcessosList.jsx
│   │   ├── IntegrationStatus.jsx
│   │   └── SyncControls.jsx
│   └── shared/
│       ├── AdviseTokenInput.jsx
│       └── AdviseConnectionTest.jsx
│
└── docs/
    ├── SETUP.md                        (Guia de setup)
    ├── API_REFERENCE.md                (Referência dos endpoints)
    └── TROUBLESHOOTING.md              (Resolução de problemas)
```

---

## 🔐 CONFIGURAÇÃO (AdviseConfig Entity)

```json
{
  "name": "AdviseConfig",
  "type": "object",
  "properties": {
    "adviseApiToken": {
      "type": "string",
      "description": "Bearer token da API Advise (Sandbox ou Production)"
    },
    "adviseApiUrl": {
      "type": "string",
      "enum": ["https://sandbox-api.advise.com.br", "https://api.advise.com.br"],
      "description": "URL do ambiente (Sandbox ou Production)"
    },
    "ambiente": {
      "type": "string",
      "enum": ["sandbox", "production"],
      "description": "Ambiente configurado"
    },
    "syncPublicacoes": {
      "type": "boolean",
      "default": true,
      "description": "Sincronizar publicações?"
    },
    "syncIntimacoes": {
      "type": "boolean",
      "default": false,
      "description": "Sincronizar intimações?"
    },
    "syncProcessos": {
      "type": "boolean",
      "default": false,
      "description": "Sincronizar processos?"
    },
    "frequenciaSync": {
      "type": "string",
      "enum": ["hourly", "daily", "weekly"],
      "default": "daily",
      "description": "Frequência de sincronização"
    },
    "ultimaSincronizacao": {
      "type": "string",
      "format": "date-time",
      "description": "Data/hora da última sincronização bem-sucedida"
    },
    "statusConexao": {
      "type": "string",
      "enum": ["conectado", "desconectado", "erro"],
      "default": "desconectado",
      "description": "Status atual da conexão com Advise"
    },
    "erroUltimo": {
      "type": "string",
      "description": "Mensagem do último erro"
    }
  },
  "required": ["adviseApiToken", "adviseApiUrl"]
}
```

---

## 🔧 CLIENT BASE (Reutilizável)

```javascript
// baseAdviseClient.js - Core da integração
class AdviseAPIClient {
  constructor(token, baseUrl) {
    this.token = token;
    this.baseUrl = baseUrl;
    this.headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async request(method, endpoint, body = null) {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      const options = {
        method,
        headers: this.headers
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Advise API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Publicações
  async getPublicacoes(params) { /* ... */ }
  
  // Intimações
  async getIntimacoes(params) { /* ... */ }
  
  // Processos
  async getProcessos(params) { /* ... */ }
}

export { AdviseAPIClient };
```

---

## 🔄 FLUXOS DE SINCRONIZAÇÃO

### Publicações (Implementado)
```
Advise API → syncAdvisePublications → PublicacaoAdvise Entity
                                    ↓
                        processPublicationToTask
                                    ↓
                            TarefaAgendada Entity
```

### Intimações (Planejado)
```
Advise API → syncAdviseIntimations → IntimacaoAdvise Entity
                                   ↓
                        Dashboard (em tempo real)
```

### Processos (Planejado)
```
Advise API → syncAdviseProcesses → ProcessoAdvise + AndamentoAdvise
                                 ↓
                        Dashboard (histórico completo)
```

---

## 📱 INTERFACE SETUP WIZARD

### Passo 1: Credenciais
- Input: Token Advise
- Input: Ambiente (Sandbox/Production)
- Botão: Testar Conexão

### Passo 2: Selecionar Integrações
- ✓ Publicações (default on)
- ✓ Intimações
- ✓ Processos

### Passo 3: Configurar Frequência
- Sincronização Publicações: Diária
- Sincronização Intimações: A cada 6 horas
- Sincronização Processos: Semanal

### Passo 4: Revisão e Ativação
- Confirmar configurações
- Ativar automações
- Ir para dashboards

---

## ✅ TESTES PLANEJADOS

### Testes Unitários
```
✅ adviseApiClient - Conexão básica
✅ adviseApiClient - Parsing de respostas
✅ publicacoes - GET com filtros
✅ publicacoes - Marcar como lido
✅ intimacoes - Listar fontes
✅ processos - Cadastrar processo
```

### Testes de Integração
```
✅ Fluxo completo publicações
✅ Fluxo completo intimações
✅ Fluxo completo processos
✅ Sincronizações automáticas
✅ Tratamento de erros e retry
```

### Testes de UI
```
✅ Setup Wizard funcional
✅ Dashboards responsivos
✅ Real-time status updates
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Todas as funções testadas
- [ ] Entidades criadas e validadas
- [ ] Automações agendadas
- [ ] UI criada e testada
- [ ] Documentação completa
- [ ] Setup wizard funcional
- [ ] Modo replicável (configs exportáveis)
- [ ] Exemplos de configuração prontos

---

## 📦 MODO REPLICÁVEL

A integração será configurada para ser facilmente replicável:

1. **Export de Configurações**: Salvar setup em JSON
2. **Setup Automático**: Importar configurações em nova instância
3. **Validação**: Verificar token e permissões
4. **Ativação**: Ligar automações
5. **Sync Inicial**: Sincronizar dados históricos

---

## 🔗 ENDPOINTS SUPORTADOS (Fase 1 - Publicações)

✅ **LIVE** (em produção)
- `GET /core/v1/publicacoes-clientes`
- `PUT /core/v1/publicacoes-clientes/marcar-lidos`

📝 **PLANEJADO** (próximas fases)
- Intimações (Phase 2)
- Processos (Phase 3)
- Webhooks (Phase 4)