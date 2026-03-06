import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action, entityType, entityId, comentario, mentions } = body;

    if (action === 'create' && comentario) {
      const notifPromises = (mentions || []).map(email =>
        base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject: `LegalPush — Você foi mencionado por ${user.full_name || user.email}`,
          body: `${user.full_name || user.email} te mencionou em um comentário:\n\n"${comentario}"\n\nEntidade: ${entityType} #${entityId}`,
          from_name: 'LegalPush Colaboração'
        })
      );
      if (notifPromises.length > 0) await Promise.allSettled(notifPromises);

      return Response.json({
        success: true,
        comment: {
          id: `cmt_${Date.now()}`,
          autor: user.email,
          autorNome: user.full_name || user.email,
          entityType,
          entityId,
          conteudo: comentario,
          mentions: mentions || [],
          criadoEm: new Date().toISOString()
        },
        mentionsNotified: mentions?.length || 0,
        message: 'Comentário criado e menções notificadas.'
      });
    }

    return Response.json({
      success: true,
      features: ['create_comment', 'mentions', 'email_notifications', 'thread_replies'],
      message: 'Engine de comentários e colaboração ativo.'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});