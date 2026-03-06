/**
 * FRESHSALES OAUTH CREDENTIALS BY MODULE
 * 
 * Documentação centralizada de todas as credenciais OAuth
 * Registradas no Freshsales Developer Console
 * 
 * Data de Criação: 2026-03-05
 * Status: Em desenvolvimento
 */

// =============================================================================
// MÓDULO 1: APPOINTMENTS ✅ REGISTRADO
// =============================================================================
export const APPOINTMENTS_OAUTH = {
  module: "Appointments",
  status: "REGISTERED",
  registrationDate: "2026-03-05",
  description: "Base44 Freshsales appointments",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: "fw_ext_949477013872645602",
  clientSecret: "8oV66FS56iyorzLVP4E106dUWC770O4S",
  scopes: [
    "appointments",
    "freshsales.appointments.create",
    "freshsales.appointments.delete",
    "freshsales.appointments.edit",
    "freshsales.appointments.view"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true
  },
  endpoints: {
    create: "POST /api/appointments",
    list: "GET /api/appointments",
    view: "GET /api/appointments/[id]",
    update: "PUT /api/appointments/[id]",
    delete: "DELETE /api/appointments/[id]"
  },
  notes: "Integração com agendamentos - prioridade P2",
  requirements: {
    planMinimum: "Growth",
    customFields: true,
    bulkOperations: false
  }
};

// =============================================================================
// MÓDULO 2: CONTACTS ✅ REGISTRADO
// =============================================================================
export const CONTACTS_OAUTH = {
  module: "Contacts",
  status: "REGISTERED",
  registrationDate: "2026-03-05",
  description: "Base44 Freshsales Contacts",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: "fw_ext_949477476877669864",
  clientSecret: "uQq6PZRJjkPtG1zT9Od43BvW8nPj4SOX",
  scopes: [
    "contacts",
    "freshsales.contacts.create",
    "freshsales.contacts.filters.view",
    "freshsales.contacts.upsert",
    "freshsales.contacts.edit",
    "freshsales.contacts.delete",
    "freshsales.contacts.activities.view",
    "freshsales.contacts.fields.view",
    "freshsales.contacts.view"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true,
    upsert: true,
    viewFilters: true,
    viewActivities: true,
    viewFields: true
  },
  endpoints: {
    create: "POST /api/contacts",
    list: "GET /api/contacts/view/[view_id]",
    view: "GET /api/contacts/[id]",
    update: "PUT /api/contacts/[id]",
    delete: "DELETE /api/contacts/[id]",
    upsert: "POST /api/contacts/upsert",
    viewFilters: "GET /api/contacts/filters",
    viewActivities: "GET /api/contacts/[id]/activities",
    viewFields: "GET /api/settings/contacts/fields"
  },
  notes: "✅ OAuth implementado - Pronto para Fase 1 production",
  requirements: {
    planMinimum: "Free",
    customFields: true,
    bulkOperations: true
  }
};

// =============================================================================
// MÓDULO 3: ACCOUNTS ⏳ PENDENTE REGISTRO
// =============================================================================
export const ACCOUNTS_OAUTH = {
  module: "Accounts (Sales Accounts)",
  status: "REGISTERED",
  registrationDate: "2026-03-05",
  description: "Base44 Freshsales Sales Accounts",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: "fw_ext_949478001673180658",
  clientSecret: "xv1cqGKNvbnwgeMxAYvp0HRaTnwWL7Sr",
  scopes: [
    "sales_accounts",
    "freshsales.sales_accounts.fields.view",
    "freshsales.sales_accounts.create",
    "freshsales.sales_accounts.upsert",
    "freshsales.sales_accounts.filters.view",
    "freshsales.sales_accounts.delete",
    "freshsales.sales_accounts.view",
    "freshsales.sales_accounts.edit"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true,
    upsert: true,
    viewFilters: true,
    viewFields: true
  },
  endpoints: {
    create: "POST /api/sales_accounts",
    list: "GET /api/sales_accounts/view/[view_id]",
    view: "GET /api/sales_accounts/[id]",
    update: "PUT /api/sales_accounts/[id]",
    delete: "DELETE /api/sales_accounts/[id]",
    upsert: "POST /api/sales_accounts/upsert",
    viewFilters: "GET /api/sales_accounts/filters",
    viewFields: "GET /api/settings/sales_accounts/fields"
  },
  notes: "✅ OAuth implementado - Fase 2 production ready",
  requirements: {
    planMinimum: "Growth",
    customFields: true,
    bulkOperations: false
  }
};

// =============================================================================
// MÓDULO 4: DEALS ⏳ PENDENTE REGISTRO
// =============================================================================
export const DEALS_OAUTH = {
  module: "Deals",
  status: "REGISTERED",
  registrationDate: "2026-03-05",
  description: "Base44 Freshsales Deals",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: "fw_ext_949478980139490341",
  clientSecret: "obNbAx4PjIBFfpWiJTS5octWH6YfRfVf",
  scopes: [
    "deals",
    "freshsales.deals.fields.view",
    "freshsales.deals.create",
    "freshsales.deals.filters.view",
    "freshsales.deals.upsert",
    "freshsales.deals.delete",
    "freshsales.deals.view",
    "freshsales.deals.edit"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true,
    upsert: true,
    viewFilters: true,
    viewFields: true
  },
  endpoints: {
    create: "POST /api/deals",
    list: "GET /api/deals/view/[view_id]",
    view: "GET /api/deals/[id]",
    update: "PUT /api/deals/[id]",
    delete: "DELETE /api/deals/[id]",
    upsert: "POST /api/deals/upsert",
    viewFilters: "GET /api/deals/filters",
    viewFields: "GET /api/settings/deals/fields"
  },
  notes: "✅ OAuth implementado - Phase 1 production ready",
  requirements: {
    planMinimum: "Growth",
    customFields: true,
    bulkOperations: false
  }
};

// =============================================================================
// MÓDULO 5: SALES ACTIVITIES ⏳ PENDENTE REGISTRO
// =============================================================================
export const ACTIVITIES_OAUTH = {
  module: "Sales Activities",
  status: "PENDING_REGISTRATION",
  description: "Base44 Freshsales sales activities",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: null,
  clientSecret: null,
  scopes: [
    "sales_activities",
    "freshsales.sales_activities.create",
    "freshsales.sales_activities.delete",
    "freshsales.sales_activities.edit",
    "freshsales.sales_activities.view"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true
  },
  endpoints: {
    create: "POST /api/sales_activities",
    list: "GET /api/sales_activities",
    view: "GET /api/sales_activities/[id]",
    update: "PUT /api/sales_activities/[id]",
    delete: "DELETE /api/sales_activities/[id]"
  },
  notes: "Já implementado com credentials manuais - upgrade para OAuth",
  requirements: {
    planMinimum: "Free",
    customFields: true,
    bulkOperations: false
  }
};

// =============================================================================
// MÓDULO 6: TASKS ⏳ PENDENTE REGISTRO
// =============================================================================
export const TASKS_OAUTH = {
  module: "Tasks",
  status: "PENDING_REGISTRATION",
  description: "Base44 Freshsales tasks",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: null,
  clientSecret: null,
  scopes: [
    "tasks",
    "freshsales.tasks.create",
    "freshsales.tasks.delete",
    "freshsales.tasks.edit",
    "freshsales.tasks.view"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true,
    markAsDone: true
  },
  endpoints: {
    create: "POST /api/tasks",
    list: "GET /api/tasks",
    view: "GET /api/tasks/[id]",
    update: "PUT /api/tasks/[id]",
    markDone: "PUT /api/tasks/[id]",
    delete: "DELETE /api/tasks/[id]"
  },
  notes: "Novo módulo - Fase 2",
  requirements: {
    planMinimum: "Free",
    customFields: true,
    bulkOperations: false
  }
};

// =============================================================================
// MÓDULO 7: MARKETING LISTS ⏳ PENDENTE REGISTRO
// =============================================================================
export const LISTS_OAUTH = {
  module: "Marketing Lists",
  status: "PENDING_REGISTRATION",
  description: "Base44 Freshsales marketing lists",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: null,
  clientSecret: null,
  scopes: [
    "lists",
    "freshsales.lists.create",
    "freshsales.lists.delete",
    "freshsales.lists.edit",
    "freshsales.lists.view",
    "freshsales.contacts.view"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true,
    manageContacts: true
  },
  endpoints: {
    create: "POST /api/lists",
    list: "GET /api/lists",
    update: "PUT /api/lists/[id]",
    addContacts: "PUT /api/lists/[id]/add_contacts",
    removeContacts: "PUT /api/lists/[id]/remove_contacts",
    moveContacts: "PUT /api/lists/[id]/move_contacts"
  },
  notes: "Novo módulo - Fase 2 - Segmentação",
  requirements: {
    planMinimum: "Pro",
    customFields: false,
    bulkOperations: true
  }
};

// =============================================================================
// MÓDULO 8: PRODUCTS ⏳ PENDENTE REGISTRO
// =============================================================================
export const PRODUCTS_OAUTH = {
  module: "Products",
  status: "PENDING_REGISTRATION",
  description: "Base44 Freshsales products",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: null,
  clientSecret: null,
  scopes: [
    "products",
    "freshsales.products.create",
    "freshsales.products.delete",
    "freshsales.products.edit",
    "freshsales.products.view",
    "freshsales.products.pricing"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true,
    managePricing: true
  },
  endpoints: {
    create: "POST /api/cpq/products",
    view: "GET /api/cpq/products/[id]",
    update: "PUT /api/cpq/products/[id]",
    delete: "DELETE /api/cpq/products/[id]",
    managePricing: "PUT /api/cpq/products/[id]?include=pricing"
  },
  notes: "Novo módulo - Fase 2 - Catálogo",
  requirements: {
    planMinimum: "Pro",
    customFields: true,
    bulkOperations: true
  }
};

// =============================================================================
// MÓDULO 9: NOTES ✅ REGISTERED
// =============================================================================
export const NOTES_OAUTH = {
  module: "Notes",
  status: "REGISTERED",
  registrationDate: "2026-03-05",
  description: "Base44 Freshsales Notes",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: "fw_ext_949479947326920187",
  clientSecret: "2NBZcKTS8WcVhT99aKRWKl2IFgyngYSD",
  scopes: [
    "notes",
    "freshsales.notes.create",
    "freshsales.notes.delete",
    "freshsales.notes.edit"
  ],
  permissions: {
    create: true,
    edit: true,
    delete: true
  },
  endpoints: {
    create: "POST /api/notes",
    update: "PUT /api/notes/[id]",
    delete: "DELETE /api/notes/[id]"
  },
  notes: "✅ OAuth implementado - Phase 2 production ready",
  requirements: {
    planMinimum: "Free",
    customFields: false,
    bulkOperations: false
  }
};

// =============================================================================
// MÓDULO 10: CPQ DOCUMENTS (PREMIUM) ⏳ PENDENTE REGISTRO
// =============================================================================
export const CPQ_OAUTH = {
  module: "CPQ Documents",
  status: "PENDING_REGISTRATION",
  description: "Base44 Freshsales CPQ documents",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: null,
  clientSecret: null,
  scopes: [
    "cpq_documents",
    "freshsales.cpq_documents.create",
    "freshsales.cpq_documents.delete",
    "freshsales.cpq_documents.edit",
    "freshsales.cpq_documents.view",
    "freshsales.products.view"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true,
    manageProducts: true,
    generatePDF: true
  },
  endpoints: {
    create: "POST /api/cpq/cpq_documents",
    view: "GET /api/cpq/cpq_documents/[id]",
    update: "PUT /api/cpq/cpq_documents/[id]",
    delete: "DELETE /api/cpq/cpq_documents/[id]/forget",
    manageProducts: "PUT /api/cpq/cpq_documents/[id]?include=products",
    getRelated: "GET /api/cpq/cpq_documents/[id]/related_products"
  },
  notes: "PREMIUM FEATURE - Fase 3 - Propostas",
  requirements: {
    planMinimum: "Enterprise",
    customFields: true,
    bulkOperations: true
  }
};

// =============================================================================
// MÓDULO 11: PHONE CALLS ⏳ PENDENTE REGISTRO
// =============================================================================
export const PHONECALLS_OAUTH = {
  module: "Phone Calls",
  status: "PENDING_REGISTRATION",
  description: "Base44 Freshsales phone calls",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: null,
  clientSecret: null,
  scopes: [
    "phone_calls",
    "freshsales.phone_calls.create",
    "freshsales.phone_calls.view"
  ],
  permissions: {
    create: true,
    read: true
  },
  endpoints: {
    create: "POST /api/phone_calls"
  },
  notes: "PREMIUM FEATURE - Fase 3 - Integração telefonia",
  requirements: {
    planMinimum: "Pro",
    customFields: false,
    bulkOperations: false
  }
};

// =============================================================================
// MÓDULO 12: CUSTOM MODULES ⏳ PENDENTE REGISTRO
// =============================================================================
export const CUSTOM_OAUTH = {
  module: "Custom Modules",
  status: "PENDING_REGISTRATION",
  description: "Base44 Freshsales custom modules",
  redirectUrl: "https://app.base44.com/oauth/callback",
  registrationType: "Manual",
  clientId: null,
  clientSecret: null,
  scopes: [
    "custom_module",
    "freshsales.custom_module.create",
    "freshsales.custom_module.delete",
    "freshsales.custom_module.edit",
    "freshsales.custom_module.view"
  ],
  permissions: {
    create: true,
    read: true,
    edit: true,
    delete: true,
    bulkOperations: true
  },
  endpoints: {
    generic: "/api/custom_module/[entity_name]/..."
  },
  notes: "PREMIUM FEATURE - Fase 3 - Dinâmico",
  requirements: {
    planMinimum: "Enterprise",
    customFields: true,
    bulkOperations: true
  }
};

// =============================================================================
// SUMMARY & STATUS
// =============================================================================
export const CREDENTIALS_SUMMARY = {
  totalModules: 12,
  registered: 5,
  pendingRegistration: 7,
  registrationProgress: "5/12 (42%)",
  
  modules: [
    { name: "Appointments", status: "✅ REGISTERED", phase: "2" },
    { name: "Contacts", status: "✅ REGISTERED", phase: "1" },
    { name: "Accounts", status: "✅ REGISTERED", phase: "2" },
    { name: "Deals", status: "✅ REGISTERED", phase: "1" },
    { name: "Activities", status: "⏳ PENDING", phase: "1" },
    { name: "Tasks", status: "⏳ PENDING", phase: "2" },
    { name: "Marketing Lists", status: "⏳ PENDING", phase: "2" },
    { name: "Products", status: "⏳ PENDING", phase: "2" },
    { name: "Notes", status: "✅ REGISTERED", phase: "2" },
    { name: "CPQ Documents", status: "⏳ PENDING", phase: "3" },
    { name: "Phone Calls", status: "⏳ PENDING", phase: "3" },
    { name: "Custom Modules", status: "⏳ PENDING", phase: "3" }
  ],
  
  nextSteps: [
    "1. Registrar Contacts OAuth",
    "2. Registrar Deals OAuth",
    "3. Registrar Activities OAuth",
    "4. Registrar Tasks OAuth",
    "5. Registrar Accounts OAuth",
    "6. Registrar Marketing Lists OAuth",
    "7. Registrar Products OAuth",
    "8. Registrar Notes OAuth",
    "9. Registrar CPQ Documents OAuth (Premium)",
    "10. Registrar Phone Calls OAuth (Premium)",
    "11. Registrar Custom Modules OAuth (Premium)"
  ]
};

// =============================================================================
// EXPORT ALL CREDENTIALS
// =============================================================================
export const ALL_CREDENTIALS = {
  appointments: APPOINTMENTS_OAUTH,
  contacts: CONTACTS_OAUTH,
  accounts: ACCOUNTS_OAUTH,
  deals: DEALS_OAUTH,
  activities: ACTIVITIES_OAUTH,
  tasks: TASKS_OAUTH,
  lists: LISTS_OAUTH,
  products: PRODUCTS_OAUTH,
  notes: NOTES_OAUTH,
  cpq: CPQ_OAUTH,
  phoneCalls: PHONECALLS_OAUTH,
  custom: CUSTOM_OAUTH
};

export default ALL_CREDENTIALS;