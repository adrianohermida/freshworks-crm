import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { webhookUrl, message, type, entityData } = body;

    if (!webhookUrl) {
      return Response.json({
        success: false,
        message: 'webhookUrl é obrigatório. Configure em Teams > Canal > Connectors > Incoming Webhook.',
        setupGuide: {
          step1: 'Abra o Microsoft Teams',
          step2: 'Vá para o canal desejado → ⋯ → Connectors',
          step3: 'Selecione "Incoming Webhook" e configure',
          step4: 'Copie a URL gerada e salve como TEAMS_WEBHOOK_URL nas configurações'
        }
      });
    }

    const card = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      "summary": message || "Notificação LegalPush",
      "themeColor": "7E57FF",
      "title": `🔔 LegalPush — ${type || 'Notificação'}`,
      "sections": [{
        "activityTitle": message || "Nova atualização disponível",
        "activitySubtitle": `${new Date().toLocaleString('pt-BR')} · ${user.email}`,
        "facts": entityData ? Object.entries(entityData).map(([k, v]) => ({ name: k, value: String(v) })) : []
      }]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    });

    const ok = response.ok;
    return Response.json({ success: ok, status: response.status, message: ok ? 'Mensagem enviada ao Teams com sucesso.' : 'Falha ao enviar.' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});