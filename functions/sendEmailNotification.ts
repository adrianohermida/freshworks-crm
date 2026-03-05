import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      template_id,
      template_name,
      recipient_email,
      recipient_type,
      ticket_id,
      trigger_event,
      variables = {}
    } = await req.json();

    // Get template if not provided
    let template = null;
    if (template_id) {
      const templates = await base44.entities.EmailTemplate.filter({ id: template_id });
      template = templates[0];
    } else if (template_name) {
      const templates = await base44.entities.EmailTemplate.filter({ name: template_name });
      template = templates[0];
    }

    if (!template) {
      throw new Error('Template não encontrado');
    }

    if (!template.enabled) {
      throw new Error('Template desativado');
    }

    // Replace variables in subject and body
    let subject = template.subject;
    let body = template.body;

    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, variables[key] || '');
      body = body.replace(regex, variables[key] || '');
    });

    // Send email using Core integration
    await base44.integrations.Core.SendEmail({
      to: recipient_email,
      subject: subject,
      body: body
    });

    // Log the email
    const emailLog = await base44.entities.EmailLog.create({
      template_id: template.id,
      template_name: template.name,
      ticket_id,
      recipient_email,
      recipient_type,
      subject,
      status: 'sent',
      sent_at: new Date().toISOString(),
      trigger_event,
      variables_used: variables,
      is_automated: true
    });

    // Update template usage
    await base44.entities.EmailTemplate.update(template.id, {
      usage_count: (template.usage_count || 0) + 1,
      last_used: new Date().toISOString()
    });

    return Response.json({
      success: true,
      email_log_id: emailLog.id,
      message: `Email enviado para ${recipient_email}`
    });
  } catch (error) {
    // Log error
    const log = await (await createClientFromRequest(req)).entities.EmailLog.create({
      recipient_email: (await req.json()).recipient_email,
      subject: 'Email não enviado',
      status: 'failed',
      error_message: error.message,
      trigger_event: 'error'
    }).catch(() => null);

    return Response.json(
      { error: error.message, log_id: log?.id },
      { status: 500 }
    );
  }
});