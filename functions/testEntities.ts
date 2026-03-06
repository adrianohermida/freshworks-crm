import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Test tenant_id from email domain
    const tenant_id = user.email.split('@')[1];

    // Test 1: Create mock contact
    const mockContact = {
      freshsales_id: 'test_' + Date.now(),
      first_name: 'Test',
      last_name: 'User',
      email: user.email,
      phone: '+55 11 98765-4321',
      company_name: 'Test Company',
      lead_score: 85,
      status: 'lead',
      source: 'api',
      tags: ['test', 'automation'],
      sync_status: 'synced',
      tenant_id
    };

    const contactResult = await base44.entities.FreshsalesContact.create(mockContact);

    // Test 2: Create mock lead
    const mockLead = {
      freshsales_id: 'lead_' + Date.now(),
      contact_id: contactResult.id,
      title: 'Enterprise Package Inquiry',
      value: 50000,
      currency: 'BRL',
      status: 'qualified',
      pipeline_id: 'pipe_001',
      owner_id: 'owner_001',
      expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      probability: 75,
      freddy_score: 88,
      next_action: 'Schedule follow-up call',
      notes: 'High-value prospect from webinar',
      tenant_id
    };

    const leadResult = await base44.entities.FreshsalesLead.create(mockLead);

    // Test 3: Create mock conversation
    const mockConversation = {
      freshsales_conversation_id: 'conv_' + Date.now(),
      contact_id: contactResult.id,
      widget_source: 'website',
      channel: 'chat',
      status: 'active',
      assigned_to: 'agent_001',
      subject: 'Product Inquiry',
      message_count: 3,
      messages: [
        {
          timestamp: new Date().toISOString(),
          sender: 'user',
          content: 'Hi, can you tell me more about your Enterprise plan?',
          sentiment: 'neutral'
        },
        {
          timestamp: new Date().toISOString(),
          sender: 'agent',
          content: 'Of course! Our Enterprise plan includes...',
          sentiment: 'positive'
        }
      ],
      tenant_id
    };

    const conversationResult = await base44.entities.ChatConversation.create(mockConversation);

    // Test 4: List all records
    const contacts = await base44.entities.FreshsalesContact.list();
    const leads = await base44.entities.FreshsalesLead.list();
    const conversations = await base44.entities.ChatConversation.list();

    return Response.json({
      status: 'success',
      message: 'All tests passed!',
      tests: {
        contact_created: contactResult.id,
        lead_created: leadResult.id,
        conversation_created: conversationResult.id,
        total_contacts: contacts.length,
        total_leads: leads.length,
        total_conversations: conversations.length,
        tenant_id
      }
    });
  } catch (error) {
    return Response.json({ 
      error: error.message,
      status: 'failed'
    }, { status: 500 });
  }
});