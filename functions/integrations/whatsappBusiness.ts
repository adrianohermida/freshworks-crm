import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { to, message, templateName, templateParams } = body;

    const token = Deno.env.get('WHATSAPP_TOKEN');
    const phoneId = Deno.env.get('WHATSAPP_PHONE_ID');

    if (!token || !phoneId) {
      return Response.json({
        success: false,
        message: 'Configure WHATSAPP_TOKEN e WHATSAPP_PHONE_ID nas variáveis de ambiente.',
        setupGuide: {
          step1: 'Crie uma conta Meta Developer em developers.facebook.com',
          step2: 'Crie um App → WhatsApp Business API',
          step3: 'Obtenha o Phone Number ID e o Access Token',
          step4: 'Salve como WHATSAPP_TOKEN e WHATSAPP_PHONE_ID nas configurações'
        },
        demo: { to: to || '+5592999999999', message: message || 'Teste', status: 'demo_mode' }
      });
    }

    const payload = templateName ? {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: { name: templateName, language: { code: 'pt_BR' }, components: templateParams || [] }
    } : {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message }
    };

    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return Response.json({ success: res.ok, data, message: res.ok ? 'WhatsApp enviado com sucesso.' : 'Falha no envio.' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});