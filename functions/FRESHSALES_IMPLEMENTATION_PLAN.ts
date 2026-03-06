/**
 * FRESHSALES INTEGRATION IMPLEMENTATION PLAN
 * Data: 2026-03-05
 * 
 * Este arquivo documenta o plano completo de implementação de todos os módulos
 * e endpoints do Freshsales com prioridades e status de desenvolvimento.
 * 
 * =============================================================================
 * ÍNDICE RÁPIDO
 * =============================================================================
 * 
 * 1. VISÃO GERAL DOS MÓDULOS
 * 2. MÓDULO 1: CONTACTS (✅ Implementado)
 * 3. MÓDULO 2: ACCOUNTS (❌ A fazer)
 * 4. MÓDULO 3: DEALS (✅ Implementado)
 * 5. MÓDULO 4: SALES ACTIVITIES (✅ Implementado)
 * 6. MÓDULO 5: TASKS (❌ A fazer)
 * 7. MÓDULO 6: APPOINTMENTS (❌ A fazer)
 * 8. MÓDULO 7: NOTES (❌ A fazer)
 * 9. MÓDULO 8: MARKETING LISTS (❌ A fazer)
 * 10. MÓDULO 9: PRODUCTS (❌ A fazer)
 * 11. MÓDULO 10: CPQ DOCUMENTS (Premium - ❌ A fazer)
 * 12. MÓDULO 11: PHONE CALLS (❌ A fazer)
 * 13. MÓDULO 12: CUSTOM MODULES (❌ A fazer)
 * 14. ROADMAP E PRÓXIMOS PASSOS
 * 
 * =============================================================================
 * MÓDULO 1: CONTACTS
 * =============================================================================
 * 
 * STATUS: ✅ IMPLEMENTADO (CRUD BÁSICO)
 * PRIORIDADE: P1 (MVP)
 * COMPLETUDE: 60%
 * 
 * ENDPOINTS IMPLEMENTADOS:
 * ✅ POST   /api/contacts              - Criar contato
 * ✅ GET    /api/contacts/[id]         - Visualizar contato
 * ✅ GET    /api/contacts/view/[view_id] - Listar contatos
 * ✅ PUT    /api/contacts/[id]         - Atualizar contato
 * ✅ DELETE /api/contacts/[id]         - Deletar contato
 * ❌ POST   /api/contacts/upsert               - Upsert
 * ❌ POST   /api/contacts/bulk_upsert        - Bulk upsert
 * ❌ POST   /api/contacts/bulk_assign_owner  - Bulk assign
 * ❌ POST   /api/contacts/[id]/clone        - Clonar
 * ❌ DELETE /api/contacts/[id]/forget       - Deletar (GDPR)
 * ❌ POST   /api/contacts/bulk_destroy      - Bulk delete
 * ❌ GET    /api/contacts/[id]/activities   - Listar atividades
 * 
 * CAMPOS PRINCIPAIS:
 * - first_name (obrigatório)
 * - last_name
 * - email (obrigatório, único)
 * - phone
 * - company_name
 * - lead_score (0-100)
 * - status (prospect, lead, customer, inactive)
 * - source (website, chat_widget, manual, api, import, other)
 * - tags (array)
 * - custom_fields (object)
 * 
 * ENTIDADE BASE44:
 * entities/FreshsalesContact.json - ✅ Criada
 * 
 * COMPONENTES:
 * components/freshsales/ContactsList.jsx     - ✅ Implementado
 * components/freshsales/ContactDialog.jsx    - ✅ Implementado
 * 
 * BACKEND FUNCTIONS:
 * functions/syncFreshsalesContacts.js - ✅ Implementado
 * functions/freshsalesSync.js         - ✅ Implementado
 * 
 * MELHORIAS PLANEJADAS (Fase 2):
 * [ ] Bulk upsert para importação em lote
 * [ ] Integração com atividades (relacionamento 1:N)
 * [ ] Campos customizados dinâmicos
 * [ ] Busca/filtro por view_id
 * [ ] Clonagem de contatos
 * [ ] Gestão de team members
 * 
 * =============================================================================
 * MÓDULO 2: ACCOUNTS (Contas/Empresas)
 * =============================================================================
 * 
 * STATUS: ❌ NÃO INICIADO
 * PRIORIDADE: P2 (Enhancement)
 * 
 * ENDPOINTS COMPLETOS:
 * POST   /api/sales_accounts
 * GET    /api/sales_accounts/[id]
 * GET    /api/sales_accounts/view/[view_id]
 * PUT    /api/sales_accounts/[id]
 * PUT    /api/sales_accounts/[id]/manage_team_members
 * POST   /api/sales_accounts/upsert
 * POST   /api/sales_accounts/bulk_upsert
 * POST   /api/sales_accounts/[id]/clone
 * DELETE /api/sales_accounts/[id]
 * DELETE /api/sales_accounts/[id]/forget
 * POST   /api/sales_accounts/bulk_destroy
 * GET    /api/settings/sales_accounts/fields
 * 
 * CAMPOS PRINCIPAIS:
 * - name (obrigatório)
 * - owner_id
 * - industry
 * - website
 * - phone
 * - billing_address
 * - shipping_address
 * - annual_revenue
 * - employees
 * - custom_fields
 * 
 * TAREFAS:
 * [ ] Criar entidade FreshsalesAccount
 * [ ] Implementar CRUD completo
 * [ ] Criar lista de contas
 * [ ] Integração com contatos
 * [ ] Dialog para criar/editar
 * 
 * =============================================================================
 * MÓDULO 3: DEALS
 * =============================================================================
 * 
 * STATUS: ✅ IMPLEMENTADO (CRUD BÁSICO + KANBAN)
 * PRIORIDADE: P1 (MVP)
 * COMPLETUDE: 70%
 * 
 * ENDPOINTS IMPLEMENTADOS:
 * ✅ POST   /api/deals              - Criar deal
 * ✅ GET    /api/deals/[id]         - Visualizar
 * ✅ GET    /api/deals/view/[view_id] - Listar
 * ✅ PUT    /api/deals/[id]         - Atualizar
 * ✅ DELETE /api/deals/[id]         - Deletar
 * ❌ PUT    /api/deals/[id]/manage_team_members
 * ❌ PUT    /api/deals/[id]?include=products
 * ❌ POST   /api/deals/upsert
 * ❌ POST   /api/deals/bulk_upsert
 * ❌ POST   /api/deals/[id]/clone
 * ❌ DELETE /api/deals/[id]/forget
 * ❌ POST   /api/deals/bulk_destroy
 * 
 * CAMPOS PRINCIPAIS:
 * - name (obrigatório)
 * - contact_id (obrigatório)
 * - value (decimal)
 * - currency (BRL, USD, etc)
 * - stage (qualification, proposal, negotiation, closed_won, closed_lost)
 * - probability (0-100%)
 * - close_date
 * - owner_id
 * - product_id
 * - description
 * 
 * COMPONENTES:
 * components/freshsales/DealsFiltered.jsx - ✅ Kanban view implementada
 * components/freshsales/DealDialog.jsx    - ✅ Implementado
 * 
 * MELHORIAS PLANEJADAS (Fase 2):
 * [ ] Adicionar produtos aos deals
 * [ ] Drag-and-drop entre stages
 * [ ] Probability weighting
 * [ ] Histórico de estágios
 * [ ] Freddy AI scoring
 * 
 * =============================================================================
 * MÓDULO 4: SALES ACTIVITIES
 * =============================================================================
 * 
 * STATUS: ✅ IMPLEMENTADO (CRUD BÁSICO)
 * PRIORIDADE: P1 (MVP)
 * COMPLETUDE: 65%
 * 
 * ENDPOINTS IMPLEMENTADOS:
 * ✅ POST   /api/sales_activities    - Criar atividade
 * ✅ GET    /api/sales_activities/[id] - Visualizar
 * ✅ GET    /api/sales_activities    - Listar
 * ✅ PUT    /api/sales_activities/[id] - Atualizar
 * ✅ DELETE /api/sales_activities/[id] - Deletar
 * 
 * TIPOS DE ATIVIDADE:
 * - task (Tarefas)
 * - call (Chamadas)
 * - meeting (Reuniões)
 * - note (Notas)
 * 
 * CAMPOS PRINCIPAIS:
 * - type (obrigatório)
 * - title (obrigatório)
 * - description
 * - status (pending, completed, cancelled)
 * - priority (low, medium, high)
 * - due_date
 * - assigned_to
 * - contact_id / deal_id
 * - duration_minutes (calls/meetings)
 * - outcome
 * 
 * COMPONENTES:
 * components/freshsales/ActivitiesList.jsx - ✅ Implementado
 * components/freshsales/ActivityDialog.jsx  - ✅ Implementado
 * 
 * MELHORIAS PLANEJADAS (Fase 2):
 * [ ] Associar com deals além de contacts
 * [ ] Timeline view
 * [ ] Filtro por responsável
 * [ ] Notificações de vencimento
 * [ ] Integração com calendário
 * 
 * =============================================================================
 * MÓDULO 5: TASKS (Tarefas Independentes)
 * =============================================================================
 * 
 * STATUS: ❌ NÃO INICIADO
 * PRIORIDADE: P2 (Enhancement)
 * 
 * ENDPOINTS:
 * POST   /api/tasks
 * GET    /api/tasks/[id]
 * GET    /api/tasks?filter=[param]
 * PUT    /api/tasks/[id]
 * DELETE /api/tasks/[id]
 * 
 * DISTINÇÃO:
 * Tasks são tarefas genéricas não associadas a contatos/deals
 * Sales Activities são vinculadas a vendas
 * 
 * TAREFAS:
 * [ ] Criar entidade FreshsalesTasks
 * [ ] CRUD completo
 * [ ] List view com filtros
 * [ ] Kanban view (To do, In progress, Done)
 * 
 * =============================================================================
 * MÓDULO 6: APPOINTMENTS (Agendamentos)
 * =============================================================================
 * 
 * STATUS: ❌ NÃO INICIADO
 * PRIORIDADE: P2 (Enhancement)
 * 
 * ENDPOINTS:
 * POST   /api/appointments
 * GET    /api/appointments/[id]
 * GET    /api/appointments?filter=[param]
 * PUT    /api/appointments/[id]
 * DELETE /api/appointments/[id]
 * 
 * CAMPOS PRINCIPAIS:
 * - title (obrigatório)
 * - start_at (datetime)
 * - end_at (datetime)
 * - contact_id
 * - deal_id
 * - description
 * - location
 * - assigned_to
 * - reminder (minutes before)
 * 
 * TAREFAS:
 * [ ] Criar entidade FreshsalesAppointment
 * [ ] CRUD completo
 * [ ] Calendar view
 * [ ] Sync com Google Calendar/Outlook
 * 
 * =============================================================================
 * MÓDULO 7: NOTES
 * =============================================================================
 * 
 * STATUS: ❌ NÃO INICIADO
 * PRIORIDADE: P2 (Enhancement)
 * 
 * ENDPOINTS:
 * POST   /api/notes
 * PUT    /api/notes/[id]
 * DELETE /api/notes/[id]
 * 
 * CAMPOS PRINCIPAIS:
 * - description (obrigatório)
 * - contact_id / deal_id / account_id
 * - created_at, updated_at
 * - created_by
 * 
 * TAREFAS:
 * [ ] Widget rápido em contact/deal details
 * [ ] Timeline de notas
 * [ ] @mentions
 * 
 * =============================================================================
 * MÓDULO 8: MARKETING LISTS
 * =============================================================================
 * 
 * STATUS: ❌ NÃO INICIADO
 * PRIORIDADE: P2 (Enhancement)
 * 
 * ENDPOINTS:
 * POST   /api/lists
 * GET    /api/lists
 * PUT    /api/lists/[id]
 * GET    /api/contacts/lists/[id]
 * PUT    /api/lists/[id]/add_contacts
 * PUT    /api/lists/[id]/remove_contacts
 * PUT    /api/lists/[id]/move_contacts
 * 
 * CASOS DE USO:
 * - Segmentação para campanhas
 * - Importação em lote de contatos
 * - Tags dinâmicas
 * 
 * TAREFAS:
 * [ ] Criar entidade FreshsalesMarketingList
 * [ ] UI para criar segmentos
 * [ ] Bulk add/remove contacts
 * 
 * =============================================================================
 * MÓDULO 9: PRODUCTS
 * =============================================================================
 * 
 * STATUS: ❌ NÃO INICIADO
 * PRIORIDADE: P2 (Enhancement)
 * 
 * ENDPOINTS:
 * POST   /api/cpq/products
 * GET    /api/cpq/products/[id]
 * PUT    /api/cpq/products/[id]
 * DELETE /api/cpq/products/[id]
 * PUT    /api/cpq/products/[id]/restore
 * PUT    /api/cpq/products/[id]?include=pricing
 * POST   /api/cpq/products/bulk_assign
 * POST   /api/cpq/products/bulk_delete
 * 
 * CAMPOS PRINCIPAIS:
 * - name (obrigatório)
 * - code (SKU)
 * - description
 * - category
 * - unit_price
 * - currency
 * - tax_percent
 * - owner_id
 * 
 * TAREFAS:
 * [ ] Criar entidade FreshsalesProduct
 * [ ] Catálogo de produtos
 * [ ] Associar com deals
 * 
 * =============================================================================
 * MÓDULO 10: CPQ DOCUMENTS (Propostas - PREMIUM)
 * =============================================================================
 * 
 * STATUS: ❌ NÃO INICIADO
 * PRIORIDADE: P3 (Premium Feature)
 * REQUER: Plano Premium+
 * 
 * ENDPOINTS:
 * POST   /api/cpq/cpq_documents
 * GET    /api/cpq/cpq_documents/[id]
 * PUT    /api/cpq/cpq_documents/[id]
 * DELETE /api/cpq/cpq_documents/[id]/forget
 * PUT    /api/cpq/cpq_documents/[id]/restore
 * PUT    /api/cpq/cpq_documents/[id]?include=products
 * GET    /api/cpq/cpq_documents/[id]/related_products
 * POST   /api/cpq/cpq_documents/bulk_assign
 * 
 * CAMPOS PRINCIPAIS:
 * - name (obrigatório)
 * - deal_id
 * - contact_id
 * - status (draft, sent, accepted, rejected, expired)
 * - template_id
 * - valid_until
 * - discount_percent
 * - line_items (array de produtos)
 * - total_amount
 * 
 * TAREFAS:
 * [ ] Criar entidade FreshsalesCPQDocument
 * [ ] Gerador de PDFs
 * [ ] Integração de assinatura digital
 * 
 * =============================================================================
 * MÓDULO 11: PHONE CALLS
 * =============================================================================
 * 
 * STATUS: ❌ NÃO INICIADO
 * PRIORIDADE: P3 (Premium Feature)
 * 
 * ENDPOINTS:
 * POST   /api/phone_calls
 * 
 * CAMPOS PRINCIPAIS:
 * - contact_id (obrigatório)
 * - call_type (inbound, outbound)
 * - call_duration (segundos)
 * - call_result (answered, busy, no_answer)
 * - notes
 * - call_start_time
 * - call_end_time
 * 
 * TAREFAS:
 * [ ] Integração com telefonia (Twilio, RingCentral)
 * [ ] Gravação de chamadas
 * [ ] Transcrição com IA (Freddy)
 * 
 * =============================================================================
 * MÓDULO 12: CUSTOM MODULES
 * =============================================================================
 * 
 * STATUS: ❌ NÃO INICIADO
 * PRIORIDADE: P3 (Premium Feature)
 * 
 * ENDPOINTS GENÉRICOS:
 * POST   /api/custom_module/[entity_name]
 * GET    /api/custom_module/[entity_name]/[id]
 * GET    /api/custom_module/[entity_name]/view/[view_id]
 * PUT    /api/custom_module/[entity_name]/[id]
 * DELETE /api/custom_module/[entity_name]/[id]
 * POST   /api/custom_module/[entity_name]/[id]/clone
 * POST   /api/custom_module/[entity_name]/bulk_destroy
 * 
 * TAREFAS:
 * [ ] Sistema dinâmico baseado em schema Freshsales
 * [ ] Auto-gerar UI baseada em campo types
 * [ ] CRUD genérico
 * 
 * =============================================================================
 * ROADMAP DETALHADO
 * =============================================================================
 * 
 * 🟢 FASE 1 (IMPLEMENTADO) - MVP:
 * [x] Contacts CRUD
 * [x] Deals CRUD (FreshsalesLead como deals)
 * [x] Sales Activities CRUD
 * [x] Sincronização básica
 * [x] Dashboard com stats
 * [x] Auth & Tenant isolation
 * 
 * 🟡 FASE 2 (PRÓXIMO) - Enhancement:
 * [ ] Accounts (CRUD + relacionamentos) - 1 semana
 * [ ] Tasks (CRUD) - 3 dias
 * [ ] Appointments (CRUD) - 3 dias
 * [ ] Marketing Lists (CRUD + segmentação) - 5 dias
 * [ ] Products (Catálogo) - 4 dias
 * [ ] Bulk operations (import/export) - 5 dias
 * [ ] Relatórios básicos - 5 dias
 * [ ] API Metadata caching - 2 dias
 * 
 * 🔴 FASE 3 (LONG TERM) - Premium:
 * [ ] CPQ Documents (propostas) - 2 semanas
 * [ ] Phone Calls integration - 2 semanas
 * [ ] Custom Modules (dinâmicos) - 2 semanas
 * [ ] Freddy AI integration - 1 semana
 * [ ] Workflow automation - 2 semanas
 * [ ] Advanced analytics - 2 semanas
 * 
 * =============================================================================
 * PLANO TÉCNICO
 * =============================================================================
 * 
 * BACKEND FUNCTIONS A CRIAR:
 * 
 * Fase 2:
 * [ ] freshsalesAccounts.js
 * [ ] freshsalesTasks.js
 * [ ] freshsalesAppointments.js
 * [ ] freshsalesProducts.js
 * [ ] freshsalesSearch.js
 * [ ] bulkImport.js
 * [ ] metadataCache.js
 * 
 * Fase 3:
 * [ ] cpqDocuments.js
 * [ ] phoneCallsIntegration.js
 * [ ] freddy.js (AI scoring)
 * [ ] workflowEngine.js
 * 
 * ENTITIES A CRIAR:
 * 
 * Fase 2:
 * [ ] FreshsalesAccount
 * [ ] FreshsalesTask
 * [ ] FreshsalesAppointment
 * [ ] FreshsalesProduct
 * [ ] FreshsalesMarketingList
 * 
 * Fase 3:
 * [ ] FreshsalesCPQDocument
 * [ ] FreshsalesPhoneCall
 * [ ] FreshsalesWorkflow
 * 
 * COMPONENTS A CRIAR:
 * 
 * Fase 2:
 * [ ] AccountsList
 * [ ] AccountDialog
 * [ ] TasksBoard
 * [ ] AppointmentsCalendar
 * [ ] ProductsCatalog
 * [ ] MarketingListsManager
 * 
 * Fase 3:
 * [ ] CPQDocumentBuilder
 * [ ] PhoneCallWidget
 * 
 * =============================================================================
 * PERMISSÕES POR PLANO
 * =============================================================================
 * 
 * Feature           | Free  | Growth | Pro  | Enterprise
 * ------------------|-------|--------|------|------------
 * Contacts          | ✅    | ✅     | ✅   | ✅
 * Accounts          | ❌    | ✅     | ✅   | ✅
 * Deals             | ❌    | ✅     | ✅   | ✅
 * Activities        | ⚠️    | ✅     | ✅   | ✅
 * Marketing Lists   | ❌    | ❌     | ✅   | ✅
 * Products          | ❌    | ❌     | ✅   | ✅
 * CPQ/Proposals     | ❌    | ❌     | ❌   | ✅
 * Phone Integration | ❌    | ❌     | ✅   | ✅
 * Custom Modules    | ❌    | ❌     | ⚠️   | ✅
 * Freddy AI         | ❌    | ✅     | ✅   | ✅
 * 
 * IMPLEMENTAÇÃO:
 * - Detectar plano do usuário
 * - Mostrar "Feature available in [plano]" para features não disponíveis
 * - Graceful degradation na UI
 * - Avisos sobre upgrade de plano
 * 
 * =============================================================================
 * PRÓXIMOS PASSOS IMEDIATOS
 * =============================================================================
 * 
 * 1. Revisar e ajustar plan conforme feedback
 * 2. Iniciar Fase 2 com Accounts (CRUD completo)
 * 3. Criar entidade FreshsalesAccount
 * 4. Implementar AccountsList + AccountDialog
 * 5. Integrar com API Freshsales
 * 
 * =============================================================================
 * REFERÊNCIAS
 * =============================================================================
 * 
 * - Freshsales API: https://developers.freshworks.com/crm/api/
 * - Getknit Directory: https://www.getknit.dev/blog/freshsales-api-directory-d8efxu
 * - Community: https://community.freshworks.dev/
 * 
 * =============================================================================
 */

// Este arquivo é apenas para documentação
// Para usar: ler este arquivo como referência para implementação

export const IMPLEMENTATION_PLAN = {
  version: "1.0.0",
  lastUpdated: "2026-03-05",
  phase1Status: "COMPLETE",
  phase2Status: "NOT_STARTED",
  phase3Status: "NOT_STARTED",
  totalModules: 12,
  implementedModules: 3, // Contacts, Deals, Activities
  completionPercentage: 25
};