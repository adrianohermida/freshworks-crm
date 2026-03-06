import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { dataType } = await req.json();

    const demoTickets = [
      {
        id: 'demo-1',
        subject: 'Login não funciona após atualização',
        description: 'Usuário relata que não consegue fazer login após a última atualização do sistema',
        status: 'open',
        priority: 'high',
        customer_name: 'João Silva',
        customer_email: 'joao@example.com',
        assigned_to: null,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['bug', 'urgent']
      },
      {
        id: 'demo-2',
        subject: 'Solicitar novo recurso: Dark mode',
        description: 'Solicitação de implementação de dark mode na aplicação',
        status: 'pending',
        priority: 'medium',
        customer_name: 'Maria Santos',
        customer_email: 'maria@example.com',
        assigned_to: null,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['feature-request']
      },
      {
        id: 'demo-3',
        subject: 'Erro ao exportar relatório em PDF',
        description: 'Ao tentar exportar relatório em PDF, recebo erro 500',
        status: 'in_progress',
        priority: 'high',
        customer_name: 'Carlos Oliveira',
        customer_email: 'carlos@example.com',
        assigned_to: null,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['bug', 'export']
      },
      {
        id: 'demo-4',
        subject: 'Sistema muito lento com 1000+ tickets',
        description: 'Performance degrada significativamente quando há muitos tickets carregados',
        status: 'open',
        priority: 'critical',
        customer_name: 'Ana Costa',
        customer_email: 'ana@example.com',
        assigned_to: null,
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        tags: ['performance', 'critical']
      },
      {
        id: 'demo-5',
        subject: 'Pagamento recusado no checkout',
        description: 'Cliente relata que o pagamento foi recusado no checkout sem motivo claro',
        status: 'resolved',
        priority: 'high',
        customer_name: 'Pedro Mendes',
        customer_email: 'pedro@example.com',
        assigned_to: null,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['payment', 'resolved']
      }
    ];

    const demoContacts = [
      {
        id: 'contact-1',
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '+55 (11) 98765-4321',
        company: 'Acme Corp',
        status: 'active'
      },
      {
        id: 'contact-2',
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '+55 (21) 99876-5432',
        company: 'Tech Solutions',
        status: 'active'
      },
      {
        id: 'contact-3',
        name: 'Carlos Oliveira',
        email: 'carlos@example.com',
        phone: '+55 (31) 97654-3210',
        company: 'Inovate Inc',
        status: 'inactive'
      }
    ];

    let created = 0;
    let failed = 0;

    // Gerar dados
    if (!dataType || dataType === 'tickets') {
      for (const ticket of demoTickets) {
        try {
          await base44.asServiceRole.entities.Ticket.create(ticket);
          created++;
        } catch (e) {
          failed++;
          console.log('Ticket already exists or error:', e.message);
        }
      }
    }

    if (!dataType || dataType === 'contacts') {
      for (const contact of demoContacts) {
        try {
          await base44.asServiceRole.entities.Contact.create(contact);
          created++;
        } catch (e) {
          failed++;
          console.log('Contact already exists or error:', e.message);
        }
      }
    }

    return Response.json({
      success: true,
      created,
      failed,
      message: `Demo data gerado: ${created} registros criados, ${failed} falharam`
    });

  } catch (error) {
    console.error('Demo data generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});