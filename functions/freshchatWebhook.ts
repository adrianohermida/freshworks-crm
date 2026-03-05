import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { crypto } from 'https://deno.land/std@0.208.0/crypto/mod.ts';

const FRESHCHAT_WEBHOOK_SECRET = Deno.env.get('FRESHSALES_WEBHOOK_SECRET');

async function verifyWebhookSignature(req, secret) {
  const signature = req.headers.get('X-Webhook-Signature');
  if (!signature) return false;

  const body = await req.clone().text();
  const encoder = new TextEncoder();
  const data = encoder.encode(secret + body);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return signature === hashHex;
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const isValid = await verifyWebhookSignature(req, FRESHCHAT_WEBHOOK_SECRET || '');
    if (!isValid) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { action, data } = payload;

    if (action === 'conversation_created' || action === 'message_created') {
      const conversation = data.conversation || data;

      const conversationData = {
        freshchat_conversation_id: conversation.conversation_id || conversation.id,
        visitor_email: conversation.visitor?.email || '',
        visitor_name: conversation.visitor?.name || '',
        visitor_phone: conversation.visitor?.phone || '',
        status: conversation.status || 'new',
        assigned_agent: conversation.assigned_agent?.email || '',
        messages_count: conversation.messages?.length || 0,
        last_message: conversation.messages?.[conversation.messages.length - 1]?.message_body || '',
        last_message_at: new Date().toISOString(),
        conversation_data: conversation
      };

      const existing = await base44.entities.FreshchatConversation.filter({
        freshchat_conversation_id: conversationData.freshchat_conversation_id
      }, null, 1);

      if (existing.length > 0) {
        await base44.entities.FreshchatConversation.update(existing[0].id, conversationData);
      } else {
        await base44.entities.FreshchatConversation.create(conversationData);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});