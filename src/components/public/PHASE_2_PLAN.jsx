# 🗓️ SPRINT FASE 2 - GERENCIAMENTO DE PRAZOS

## 📊 VISÃO GERAL

Após conclusão 100% da Fase 1.1, iniciamos **Fase 2: Gerenciamento de Prazos**.

**Objetivo:** Implementar sistema completo de prazos, alertas e integração calendário.

---

## 📋 BACKLOG - FASE 2

### 1️⃣ Entity: Deadline
**Status:** ⏳ TODO

```json
{
  "name": "Deadline",
  "properties": {
    "process_id": "string (FK Process)",
    "title": "string",
    "deadline_date": "date",
    "days_until": "integer (calculated)",
    "status": "enum [pending, alert, overdue, completed]",
    "priority": "enum [low, medium, high]",
    "notification_sent": "boolean",
    "notes": "string"
  }
}
```

### 2️⃣ Components
**Status:** ⏳ TODO

- DeadlineCard.jsx - Card com status e countdown
- DeadlineList.jsx - Lista de prazos ordenada
- DeadlineDialog.jsx - Add/Edit deadline
- DeadlineTimeline.jsx - Timeline visual (dias)
- AlertBadge.jsx - Badge de alerta (vermelho/amarelo)

### 3️⃣ Page: Deadlines
**Status:** ⏳ TODO

- Página dedicada para gerenciar prazos
- Filtros por status/priority
- Search por processo
- Calendar view integrada
- Bulk actions

### 4️⃣ Features
**Status:** ⏳ TODO

- [x] Cálculo automático de dias úteis
- [x] Alertas de vencimento (cores)
- [x] Notificações push (opcional)
- [x] Integração calendário
- [x] Estatísticas (prazos vencidos, próximos)
- [x] Relatório PDF

### 5️⃣ Backend
**Status:** ⏳ TODO

- Função para calcular dias úteis
- Função para gerar alertas
- Scheduled automation para notificações
- Integração Google Calendar (opcional)

---

## 🎯 ESTIMATIVA

| Tarefa | Tempo | Prioridade |
|--------|-------|-----------|
| Entity Deadline | 1h | 🔴 HIGH |
| Components | 4h | 🔴 HIGH |
| Page Deadlines | 3h | 🔴 HIGH |
| Backend functions | 3h | 🔴 HIGH |
| Testing | 2h | 🟡 MEDIUM |
| Documentation | 1h | 🟡 MEDIUM |
| **TOTAL** | **14h** | |

**Prazo:** ~2 dias de desenvolvimento

---

## 🚀 PRÓXIMAS FASES

### Fase 3: Publicações DJe
- Extração automática
- Vinculação a processos
- Timeline de publicações

### Fase 4: Premium Features
- Notificações push
- Relatórios customizados
- Integrações WhatsApp/Telegram

---

**Pronto para iniciar Fase 2?** ✅