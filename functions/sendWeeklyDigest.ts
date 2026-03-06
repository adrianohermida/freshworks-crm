import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch aggregated metrics for last 7 days
    const response = await base44.functions.invoke('aggregateAnalyticsMetrics', {
      days: 7
    });

    const metrics = response.data;

    // Build email content
    const emailContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">
          <h1 style="color: #1a1a1a; border-bottom: 3px solid #06b6d4; padding-bottom: 10px;">
            📊 Resumo Semanal - Analytics
          </h1>
          
          <p style="color: #666;">Olá ${user.full_name},</p>
          
          <p style="color: #666; margin-bottom: 20px;">
            Aqui está seu resumo semanal de atividades no DataJud Integrador.
          </p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #06b6d4; margin-top: 0;">Métricas Principais</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">Total de Eventos</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
                  ${metrics?.totalEvents || 0}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">Taxa de Sucesso</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
                  ${metrics?.successRate || 0}%
                </td>
              </tr>
              <tr>
                <td style="padding: 8px;">Tipos de Evento</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">
                  ${Object.keys(metrics?.eventsByType || {}).length}
                </td>
              </tr>
            </table>
          </div>

          ${metrics?.topActions && metrics.topActions.length > 0 ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="color: #06b6d4; margin-top: 0;">Ações Mais Frequentes</h3>
              <ol style="margin: 0; padding-left: 20px; color: #666;">
                ${metrics.topActions.slice(0, 5).map(action => `
                  <li style="margin-bottom: 8px;">
                    ${action.action} <strong>(${action.count}x)</strong>
                  </li>
                `).join('')}
              </ol>
            </div>
          ` : ''}

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #1976d2;">
              📈 Acesse seu dashboard completo: <a href="https://datajud.app/analytics" style="color: #1976d2; text-decoration: none;">clique aqui</a>
            </p>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
            Este é um resumo automático gerado pelo DataJud Integrador.
          </p>
        </div>
      </body>
    </html>
    `;

    // Send email
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `📊 Resumo Semanal - Analytics DataJud`,
      body: emailContent
    });

    return Response.json({
      success: true,
      message: 'Weekly digest sent successfully',
      metricsSnapshot: {
        totalEvents: metrics.totalEvents,
        successRate: metrics.successRate,
        eventTypes: Object.keys(metrics.eventsByType || {}).length
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});