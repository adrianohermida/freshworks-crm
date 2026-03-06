import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action, notification } = body;

    if (action === 'create' && notification) {
      const created = await base44.asServiceRole.entities.Notificacao.create({
        ...notification,
        destinatario: user.email,
        lida: false,
        dataEnvio: new Date().toISOString(),
        canal: 'in_app'
      });
      return Response.json({ success: true, notification: created, message: 'Notificação criada.' });
    }

    if (action === 'mark_read') {
      const { id } = body;
      await base44.asServiceRole.entities.Notificacao.update(id, { lida: true });
      return Response.json({ success: true, message: 'Marcada como lida.' });
    }

    // List unread
    const all = await base44.entities.Notificacao.list('-dataEnvio', 20);
    const unread = all.filter(n => !n.lida);

    return Response.json({
      success: true,
      total: all.length,
      unread: unread.length,
      notifications: all,
      channels: ['in_app', 'email', 'push'],
      realtimeEnabled: true
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});