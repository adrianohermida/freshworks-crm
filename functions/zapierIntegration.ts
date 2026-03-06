import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Zapier Integration
 * - Webhook endpoint para automações Zapier
 * - Suporta triggers e actions
 * - Sincronização bidirecional
 */

Deno.serve(async (req) => {
  try {
    // Validar webhook signature (básico)
    const zapierWebhookKey = Deno.env.get('ZAPIER_WEBHOOK_KEY');
    const signature = req.headers.get('x-zapier-signature');

    // Se produção, validar signature
    if (Deno.env.get('ENVIRONMENT') === 'production' && (!signature || signature !== zapierWebhookKey)) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { trigger, action, data } = body;

    // TRIGGER: New Process Created
    if (trigger === 'process_created') {
      try {
        const process = await base44.entities.Process.filter(
          { cnj_number: data.cnj_number },
          '-updated_date',
          1
        );
        
        if (process.length > 0) {
          return Response.json({
            success: true,
            trigger: 'process_created',
            data: process[0],
            message: 'Novo processo encontrado'
          });
        }
      } catch (err) {
        console.error('Error fetching process:', err);
      }
    }

    // TRIGGER: Deadline Alert
    if (trigger === 'deadline_alert') {
      const alerts = await base44.entities.Deadline.filter(
        { 
          status: { $in: ['alert', 'overdue'] },
          created_by: base44.auth.me().then(u => u.email)
        },
        '-deadline_date',
        10
      );

      return Response.json({
        success: true,
        trigger: 'deadline_alert',
        data: alerts,
        count: alerts.length
      });
    }

    // ACTION: Create Deadline
    if (action === 'create_deadline') {
      const newDeadline = await base44.entities.Deadline.create({
        process_id: data.process_id,
        title: data.title,
        deadline_date: data.deadline_date,
        priority: data.priority || 'medium',
        notes: data.notes || ''
      });

      return Response.json({
        success: true,
        action: 'create_deadline',
        data: newDeadline,
        message: 'Prazo criado via Zapier'
      });
    }

    // ACTION: Update Process Status
    if (action === 'update_process') {
      const updated = await base44.entities.Process.update(data.process_id, {
        status: data.status,
        notes: data.notes
      });

      return Response.json({
        success: true,
        action: 'update_process',
        data: updated,
        message: 'Processo atualizado via Zapier'
      });
    }

    // ACTION: Send Notification
    if (action === 'send_notification') {
      const notification = await base44.entities.Notification.create({
        user_id: data.user_id,
        type: data.type || 'system',
        title: data.title,
        message: data.message,
        channel: data.channel || 'system',
        status: 'pending'
      });

      return Response.json({
        success: true,
        action: 'send_notification',
        data: notification,
        message: 'Notificação agendada'
      });
    }

    // GET Available Triggers & Actions
    if (req.method === 'GET') {
      return Response.json({
        triggers: [
          {
            key: 'process_created',
            label: 'Novo Processo Criado',
            description: 'Dispara quando um novo processo é adicionado'
          },
          {
            key: 'deadline_alert',
            label: 'Alerta de Prazo',
            description: 'Dispara quando um prazo entra em alerta'
          },
          {
            key: 'publication_published',
            label: 'Publicação Publicada',
            description: 'Dispara quando uma publicação é feita'
          }
        ],
        actions: [
          {
            key: 'create_deadline',
            label: 'Criar Prazo',
            fields: ['process_id', 'title', 'deadline_date', 'priority']
          },
          {
            key: 'update_process',
            label: 'Atualizar Processo',
            fields: ['process_id', 'status', 'notes']
          },
          {
            key: 'send_notification',
            label: 'Enviar Notificação',
            fields: ['user_id', 'type', 'title', 'message', 'channel']
          }
        ]
      });
    }

    return Response.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('[ZapierIntegration] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});