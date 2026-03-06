import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Gera resumo diário de notificações
 * Executa via scheduled automation (01:00 diariamente)
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Se não houver usuário, usar service role
    const isServiceRole = !user;
    const sdk = isServiceRole ? base44.asServiceRole : base44;

    // Buscar preferências de digest
    const preferences = await sdk.entities.NotificationPreference.filter(
      { daily_digest_enabled: true },
      null,
      1000
    );

    let digests = 0;

    for (const pref of preferences) {
      // Buscar notificações do último dia para este usuário
      const today = new Date();
      today.setDate(today.getDate() - 1);

      const notifications = await sdk.entities.Notification.filter(
        {
          user_id: pref.user_id,
          status: { $in: ['sent', 'delivered'] }
        },
        '-created_date',
        50
      ).catch(() => []);

      if (notifications.length === 0) continue;

      // Contar por tipo
      const counts = {
        deadline: notifications.filter(n => n.type === 'deadline').length,
        publication: notifications.filter(n => n.type === 'publication').length,
        movement: notifications.filter(n => n.type === 'movement').length
      };

      // Enviar email com resumo
      const message = `
Resumo do dia:
- ${counts.deadline} alertas de prazos
- ${counts.publication} publicações
- ${counts.movement} movimentos registrados

Acesse a plataforma para mais detalhes.
      `.trim();

      try {
        await sdk.integrations.Core.SendEmail({
          to: pref.user_id,
          subject: 'Resumo diário - DataJud',
          body: `
<h2>Seu resumo diário</h2>
<p>${message.replace(/\n/g, '<br>')}</p>
          `
        });

        digests++;
      } catch (err) {
        console.error(`Failed to send digest to ${pref.user_id}:`, err);
      }
    }

    return Response.json({
      message: `${digests} resumos diários enviados`,
      processed: preferences.length
    });
  } catch (error) {
    console.error('[GenerateDailyDigest] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});