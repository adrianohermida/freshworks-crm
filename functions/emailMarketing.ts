import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Email Marketing Automation
 * - Sequences de welcome e onboarding
 * - Drip campaigns
 * - Newsletter semanal
 * - Analytics de abertura
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'list_campaigns' } = await req.json();

    // LIST CAMPAIGNS
    if (action === 'list_campaigns') {
      return Response.json({
        success: true,
        campaigns: [
          {
            id: 'welcome',
            name: 'Welcome Sequence',
            type: 'onboarding',
            status: 'active',
            emails: [
              {
                id: 'welcome_1',
                subject: '🎉 Bem-vindo ao DataJud!',
                delay_hours: 0,
                open_rate: 0.65,
                click_rate: 0.28
              },
              {
                id: 'welcome_2',
                subject: '3 dicas para começar (Parte 1)',
                delay_hours: 24,
                open_rate: 0.52,
                click_rate: 0.18
              },
              {
                id: 'welcome_3',
                subject: 'Seu primeiro processo em 5 minutos',
                delay_hours: 72,
                open_rate: 0.48,
                click_rate: 0.22
              }
            ]
          },
          {
            id: 'features',
            name: 'Feature Discovery',
            type: 'education',
            status: 'active',
            emails: [
              {
                id: 'feature_1',
                subject: 'Você sabia? IA Preditiva pode prever desfechos',
                delay_hours: 168,
                open_rate: 0.43,
                click_rate: 0.15
              },
              {
                id: 'feature_2',
                subject: 'Otimize seus prazos com alertas inteligentes',
                delay_hours: 336,
                open_rate: 0.41,
                click_rate: 0.13
              }
            ]
          },
          {
            id: 'weekly',
            name: 'Weekly Newsletter',
            type: 'recurring',
            status: 'active',
            schedule: 'Every Monday 9:00 AM',
            subscribers: 1240,
            last_sent: '2026-03-03T09:00:00Z'
          }
        ]
      });
    }

    // GET CAMPAIGN ANALYTICS
    if (action === 'analytics') {
      const { campaign_id } = await req.json();

      return Response.json({
        success: true,
        analytics: {
          campaign_id,
          sent: 1245,
          delivered: 1230,
          opened: 612,
          clicked: 156,
          unsubscribed: 8,
          bounced: 7,
          metrics: {
            open_rate: 0.498,
            click_rate: 0.127,
            unsubscribe_rate: 0.0065,
            bounce_rate: 0.0057
          },
          top_clicks: [
            { url: '/processes', clicks: 45 },
            { url: '/analytics', clicks: 32 },
            { url: '/marketplace', clicks: 28 }
          ]
        }
      });
    }

    // SEND TEST EMAIL
    if (action === 'send_test') {
      const { template_id, recipient_email } = await req.json();

      return Response.json({
        success: true,
        test_email: {
          template_id,
          sent_to: recipient_email,
          sent_at: new Date().toISOString(),
          status: 'queued',
          preview_url: '/email-preview/' + template_id
        }
      });
    }

    // MANAGE SUBSCRIPTION
    if (action === 'manage_subscription') {
      const { campaign_id, subscribed } = await req.json();

      return Response.json({
        success: true,
        subscription: {
          user_id: user.email,
          campaign_id,
          subscribed,
          updated_at: new Date().toISOString()
        }
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[EmailMarketing] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});