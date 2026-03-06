import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_BASIC_TOKEN = Deno.env.get("FRESHDESK_BASIC_TOKEN");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { attachmentId } = body;

    if (!attachmentId) {
      return Response.json({ error: 'attachmentId required' }, { status: 400 });
    }

    let domain = FRESHDESK_DOMAIN.trim().replace(/\/+$/, '');
    if (!domain.startsWith('http')) domain = `https://${domain}`;

    const url = `${domain}/api/v2/attachments/${attachmentId}`;
    const res = await fetch(url, {
      headers: { 'Authorization': FRESHDESK_BASIC_TOKEN }
    });

    if (!res.ok) {
      return Response.json({ error: `Freshdesk API ${res.status}` }, { status: res.status });
    }

    const attachment = await res.json();
    
    // Retorna URL de download
    return Response.json({ 
      success: true, 
      attachment,
      downloadUrl: attachment.attachment?.url || attachment.url 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});