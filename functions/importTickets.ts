import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const format = formData.get('format');

    if (!file || !format) {
      return Response.json({ error: 'File and format required' }, { status: 400 });
    }

    const fileText = await file.text();
    let tickets = [];
    let importedCount = 0;
    let failedCount = 0;
    const errors = [];

    try {
      if (format === 'json') {
        const parsed = JSON.parse(fileText);
        tickets = Array.isArray(parsed) ? parsed : [parsed];
      } else if (format === 'csv') {
        const lines = fileText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          const ticket = {};
          
          headers.forEach((header, idx) => {
            let value = values[idx]?.trim().replace(/^"|"$/g, '') || '';
            if (header === 'id') ticket.freshdesk_id = value;
            else if (header === 'assunto') ticket.subject = value;
            else if (header === 'cliente') ticket.customer_name = value;
            else if (header === 'status') ticket.status = value;
            else if (header === 'prioridade') ticket.priority = value;
            else if (header === 'categoria') ticket.category = value;
          });
          
          if (ticket.subject) tickets.push(ticket);
        }
      }

      // Importar tickets
      for (const ticketData of tickets) {
        try {
          if (!ticketData.subject || !ticketData.customer_name) {
            throw new Error('Campos obrigatórios faltando');
          }

          const newTicket = {
            subject: ticketData.subject,
            customer_name: ticketData.customer_name,
            customer_email: ticketData.customer_email || 'unknown@example.com',
            description: ticketData.description || '',
            status: ticketData.status || 'open',
            priority: ticketData.priority || 'medium',
            category: ticketData.category || '',
            freshdesk_id: ticketData.freshdesk_id || `import_${Date.now()}_${Math.random()}`
          };

          await base44.entities.Ticket.create(newTicket);
          importedCount++;
        } catch (error) {
          failedCount++;
          errors.push(`Erro ao importar: ${error.message}`);
        }
      }

      return Response.json({
        success: true,
        imported: importedCount,
        failed: failedCount,
        total: tickets.length,
        errors: errors.slice(0, 10)
      });
    } catch (error) {
      return Response.json(
        { error: `Erro ao processar arquivo: ${error.message}` },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});