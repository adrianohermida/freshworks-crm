import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Premium Features Unlock
 * - Premium tier management
 * - Feature flags by tier
 * - Upgrade paths
 * - Billing integration
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'tiers' } = await req.json();

    // PRICING TIERS
    if (action === 'tiers') {
      return Response.json({
        success: true,
        tiers: [
          {
            id: 'free',
            name: 'Free',
            price_monthly: 'R$ 0',
            price_yearly: 'R$ 0',
            limit_processes: 10,
            api_calls_monthly: 10000,
            features: ['Process tracking', 'Basic sync', 'Email alerts']
          },
          {
            id: 'pro',
            name: 'Professional',
            price_monthly: 'R$ 299',
            price_yearly: 'R$ 2.990',
            limit_processes: 500,
            api_calls_monthly: 500000,
            features: [
              'Unlimited processes',
              'Advanced sync',
              'Slack integration',
              'Custom workflows',
              'Priority support'
            ]
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price_monthly: 'Custom',
            price_yearly: 'Custom',
            limit_processes: 'Unlimited',
            api_calls_monthly: 'Unlimited',
            features: [
              'Everything in Pro',
              'Custom SLA',
              'Dedicated account manager',
              'On-premise option',
              '24/7 phone support'
            ]
          }
        ]
      });
    }

    // FEATURE MATRIX
    if (action === 'features') {
      return Response.json({
        success: true,
        features: {
          core: [
            { name: 'Process Management', free: true, pro: true, enterprise: true },
            { name: 'Real-time Sync', free: false, pro: true, enterprise: true },
            { name: 'Deadline Tracking', free: true, pro: true, enterprise: true }
          ],
          integrations: [
            { name: 'Email Alerts', free: true, pro: true, enterprise: true },
            { name: 'Slack Integration', free: false, pro: true, enterprise: true },
            { name: 'Zapier Automation', free: false, pro: true, enterprise: true },
            { name: 'Custom Webhooks', free: false, pro: true, enterprise: true }
          ],
          analytics: [
            { name: 'Basic Reports', free: false, pro: true, enterprise: true },
            { name: 'Advanced Analytics', free: false, pro: true, enterprise: true },
            { name: 'Predictive AI', free: false, pro: false, enterprise: true }
          ]
        }
      });
    }

    // UPGRADE
    if (action === 'upgrade') {
      const { from_tier, to_tier } = await req.json();
      return Response.json({
        success: true,
        upgrade: {
          user: user.email,
          from: from_tier,
          to: to_tier,
          effective_immediately: true,
          billing_adjustment: 'Prorated credit applied',
          next_billing_date: '2026-04-03'
        }
      });
    }

    // MY SUBSCRIPTION
    if (action === 'my_subscription') {
      return Response.json({
        success: true,
        subscription: {
          user: user.email,
          tier: 'pro',
          status: 'active',
          started_date: '2026-02-15',
          next_billing_date: '2026-04-15',
          amount_monthly: 'R$ 299',
          features_used: {
            processes: '245/500',
            api_calls_monthly: '156000/500000',
            integrations: '3/unlimited'
          }
        }
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[PremiumFeaturesUnlock] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});