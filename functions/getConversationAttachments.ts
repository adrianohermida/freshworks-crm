import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_API_KEY = Deno.env.get("FRESHDESK_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!FRESHDESK_DOMAIN || !FRESHDESK_API_KEY) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { ticket_id, conversation_id } = body;

    if (!ticket_id || !conversation_id) {
      return Response.json({ 
        error: 'Missing required fields: ticket_id, conversation_id' 
      }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${ticket_id}/conversations/${conversation_id}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json({ 
        error: 'Failed to fetch conversation attachments',
        status: response.status
      }, { status: response.status });
    }

    const conversation = await response.json();
    const attachmentIds = conversation.attachment_ids || [];

    // Fetch attachment details for each attachment ID
    const attachments = await Promise.all(
      attachmentIds.map(async (attachmentId) => {
        const attachmentUrl = `${domain}api/v2/attachments/${attachmentId}`;
        const attachmentResponse = await fetch(attachmentUrl, {
          headers: {
            'Authorization': `Basic ${FRESHDESK_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (attachmentResponse.ok) {
          const attachment = await attachmentResponse.json();
          return {
            id: attachment.id,
            name: attachment.name,
            size: attachment.size,
            content_type: attachment.content_type,
            created_at: attachment.created_at
          };
        }
        return null;
      })
    );

    return Response.json({ 
      success: true, 
      attachments: attachments.filter(a => a !== null),
      total: attachments.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});