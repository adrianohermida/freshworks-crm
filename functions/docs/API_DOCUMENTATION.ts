# 📚 Legal Tasks API - Documentação Completa

## Visão Geral

API REST pública para acesso a publicações, intimações e processos judiciais com rate limiting, autenticação e documentação OpenAPI.

**Base URL:** `https://api.legaltasks.com/api/v1`
**Versão:** 1.0.0
**Status:** ✅ Produção

---

## 🔐 Autenticação

Todas as requisições requerem um token Bearer nos headers:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  https://api.legaltasks.com/api/v1/publicacoes
```

### Obter Token
```bash
POST /auth/token
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "sua_senha"
}
```

---

## 📋 Endpoints

### 1. Listar Publicações

```
GET /publicacoes
```

**Parâmetros Query:**
- `limit` (int, 1-100, default: 20) - Registros por página
- `offset` (int, default: 0) - Offset de paginação
- `status` (string) - Filtro: `importado|processado|pendente`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pub_123",
      "idPublicacaoAdvise": "12345",
      "numeroProcesso": "0000000-00.0000.0.00.0000",
      "dataPublicacao": "2026-03-04T10:30:00Z",
      "status": "importado",
      "lido": false
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1234
  }
}
```

### 2. Listar Intimações

```
GET /intimacoes
```

**Response:** Mesmo formato que `/publicacoes`

### 3. Processos

```
GET /processos
```

**Parâmetros:**
- `numeroProcesso` (string) - Filtro por número

### 4. Estatísticas

```
GET /stats
```

**Response 200:**
```json
{
  "success": true,
  "stats": {
    "totalPublicacoes": 15234,
    "totalIntimacoes": 3421,
    "publicacoesNaoLidas": 45,
    "intimacoesPendentes": 12,
    "lastSync": "2026-03-04T11:00:00Z"
  }
}
```

### 5. Documentação OpenAPI

```
GET /docs
```

Retorna especificação OpenAPI 3.0.0 em JSON.

---

## ⏱️ Rate Limiting

- **Limite:** 100 requisições por minuto
- **Header resposta:** `X-Rate-Limit-Remaining`
- **Status 429:** Excedeu limite

```
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

---

## 🔍 Busca Avançada

```
POST /search
Content-Type: application/json

{
  "query": "prazo vencimento",
  "filters": {
    "status": "pendente",
    "tribunal": "TJSP",
    "dataInicio": "2026-01-01",
    "dataFim": "2026-03-31"
  },
  "sort": "-dataPublicacao",
  "limit": 50,
  "offset": 0
}
```

**Response:**
```json
{
  "success": true,
  "query": "prazo vencimento",
  "total": 45,
  "results": [...],
  "facets": {
    "byStatus": {"pendente": 30, "processado": 15},
    "byTribunal": {"TJSP": 25, "TJRJ": 20}
  }
}
```

---

## 📱 Notificações

### Criar Regra

```
POST /notifications/rules
Content-Type: application/json

{
  "name": "Alertar prazo próximo",
  "trigger": "deadline_approaching",
  "action": "email",
  "enabled": true
}
```

---

## ❌ Tratamento de Erros

### Erro 400 - Requisição Inválida
```json
{
  "error": "Invalid query parameters",
  "details": "limit must be between 1 and 100"
}
```

### Erro 401 - Não Autenticado
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing Authorization header"
}
```

### Erro 429 - Rate Limit
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## 🧪 Exemplos de Uso

### JavaScript/Node.js
```javascript
const response = await fetch(
  'https://api.legaltasks.com/api/v1/publicacoes?limit=10',
  {
    headers: {
      'Authorization': 'Bearer TOKEN'
    }
  }
);
const data = await response.json();
```

### Python
```python
import requests

headers = {'Authorization': 'Bearer TOKEN'}
response = requests.get(
  'https://api.legaltasks.com/api/v1/publicacoes',
  headers=headers,
  params={'limit': 10}
)
data = response.json()
```

### cURL
```bash
curl -H "Authorization: Bearer TOKEN" \
  "https://api.legaltasks.com/api/v1/publicacoes?limit=10"
```

---

## 📞 Suporte

- **Email:** api-support@legaltasks.com
- **Slack:** #api-support
- **Docs:** https://docs.legaltasks.com
- **Status:** https://status.legaltasks.com

---

## 📋 Changelog

### v1.0.0 (2026-03-04)
- ✅ Launch inicial
- ✅ Endpoints: publicacoes, intimacoes, processos, stats
- ✅ Busca avançada com full-text search
- ✅ Rate limiting
- ✅ Documentação OpenAPI