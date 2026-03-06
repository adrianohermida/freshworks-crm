# 🔌 GUIA DE INTEGRAÇÃO API DATAJUD

## 📋 VISÃO GERAL

Este documento fornece instruções completas para replicar a integração DataJud em outra instância do Base44.

### Versão: 1.0.0
### Status: Production-Ready ✅
### Última Atualização: 2026-03-03

---

## 1️⃣ PREREQUISITOS

### Backend
- Node.js 18+ ou Deno 1.30+
- Base44 SDK `@base44/sdk@0.8.6+`
- Credenciais DataJud (API Key + Base URL)

### Frontend
- React 18.2+
- React Query 5.84+
- Tailwind CSS 3.4+
- Lucide React 0.475+

### Database
- Base44 Entities (schema provided)

---

## 2️⃣ QUICK START

### Step 1: Copy Entities
```json
// entities/Process.json
// entities/ProcessMovement.json
```

### Step 2: Set Secrets
```env
DATAJUD_BASE_URL=https://api.cnj.jus.br/api/graphql
DATAJUD_API_KEY=seu_api_key
```

### Step 3: Deploy Backend
Copy `functions/datajudFetchProcess.js` to functions/

### Step 4: Deploy Frontend
Copy components & pages to your structure

---

## 3️⃣ API ENDPOINT

**POST** `/functions/datajudFetchProcess`

**Payload:**
```json
{
  "cnj_number": "0000001-00.0000.0.00000.0000000",
  "title": "Opcional"
}
```

**Response:**
```json
{
  "process": {...},
  "movements": [...]
}
```

---

**Version:** 1.0.0 | **Status:** ✅ Production-Ready