import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { fields = ['id', 'subject', 'status', 'priority', 'customer_name', 'created_date'] } = body;

    // Fetch all tickets
    const tickets = await base44.asServiceRole.entities.Ticket.list();

    // Build CSV header
    const header = fields.join(',');

    // Build CSV rows
    const rows = tickets.map(ticket => {
      return fields.map(field => {
        let value = ticket[field] || '';
        
        // Format dates
        if (field === 'created_date' || field === 'updated_date') {
          value = new Date(value).toLocaleDateString('pt-BR');
        }

        // Escape quotes in values
        if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`;
        }

        return value;
      }).join(',');
    });

    const csv = [header, ...rows].join('\n');

    // Return CSV file
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="tickets-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});