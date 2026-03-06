import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const tenant_id = user.email.split('@')[1];
    const timestamp = new Date().toISOString();

    // Seed 3 realistic contacts
    const contactsData = [
      {
        freshsales_id: 'fs_c_001',
        first_name: 'Carlos',
        last_name: 'Silva',
        email: 'carlos.silva@techcorp.com',
        phone: '+55 11 98765-4321',
        company_name: 'TechCorp Brasil',
        lead_score: 92,
        status: 'customer',
        source: 'website',
        tags: ['enterprise', 'high-value'],
        custom_fields: { industry: 'Technology', employees: 500 },
        sync_status: 'synced',
        last_synced_at: timestamp,
        tenant_id
      },
      {
        freshsales_id: 'fs_c_002',
        first_name: 'Marina',
        last_name: 'Costa',
        email: 'marina.costa@retail.com.br',
        phone: '+55 21 99876-5432',
        company_name: 'RetailMax',
        lead_score: 78,
        status: 'lead',
        source: 'chat_widget',
        tags: ['e-commerce', 'sme'],
        sync_status: 'synced',
        last_synced_at: timestamp,
        tenant_id
      },
      {
        freshsales_id: 'fs_c_003',
        first_name: 'João',
        last_name: 'Ferreira',
        email: 'joao.ferreira@finance.com.br',
        phone: '+55 31 97654-3210',
        company_name: 'FinanceFlow Consultoria',
        lead_score: 65,
        status: 'prospect',
        source: 'api',
        tags: ['financial', 'consulting'],
        sync_status: 'synced',
        last_synced_at: timestamp,
        tenant_id
      }
    ];

    const contacts = [];
    for (const contactData of contactsData) {
      const contact = await base44.entities.FreshsalesContact.create(contactData);
      contacts.push(contact);
    }

    // Seed 3 realistic leads
    const leadsData = [
      {
        freshsales_id: 'fs_l_001',
        contact_id: contacts[0].id,
        title: 'Enterprise SaaS Platform - 2026',
        value: 150000,
        currency: 'BRL',
        status: 'proposal',
        pipeline_id: 'pipe_enterprise',
        owner_id: 'sales_001',
        expected_close_date: '2026-04-15',
        probability: 85,
        freddy_score: 92,
        next_action: 'Send contract for signature',
        notes: 'High priority deal, executive sponsor confirmed',
        tenant_id
      },
      {
        freshsales_id: 'fs_l_002',
        contact_id: contacts[1].id,
        title: 'E-Commerce Integration Package',
        value: 45000,
        currency: 'BRL',
        status: 'negotiation',
        pipeline_id: 'pipe_sme',
        owner_id: 'sales_002',
        expected_close_date: '2026-03-20',
        probability: 65,
        freddy_score: 68,
        next_action: 'Schedule pricing discussion',
        notes: 'Waiting on budget approval from finance',
        tenant_id
      },
      {
        freshsales_id: 'fs_l_003',
        contact_id: contacts[2].id,
        title: 'Financial Services Solution',
        value: 200000,
        currency: 'BRL',
        status: 'qualification',
        pipeline_id: 'pipe_enterprise',
        owner_id: 'sales_001',
        expected_close_date: '2026-06-30',
        probability: 45,
        freddy_score: 55,
        next_action: 'Arrange discovery call with CFO',
        notes: 'Initial inquiry, needs deep dive',
        tenant_id
      }
    ];

    const leads = [];
    for (const leadData of leadsData) {
      const lead = await base44.entities.FreshsalesLead.create(leadData);
      leads.push(lead);
    }

    return Response.json({
      status: 'success',
      message: 'Seed data created successfully!',
      data: {
        contacts_created: contacts.length,
        leads_created: leads.length,
        conversations_created: 0,
        tenant_id,
        total_lead_value: leadsData.reduce((sum, l) => sum + l.value, 0)
      }
    });
  } catch (error) {
    return Response.json({
      error: error.message,
      status: 'failed'
    }, { status: 500 });
  }
});