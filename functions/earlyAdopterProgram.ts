import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Early Adopter Program
 * - DataJud Founders Club
 * - Recruitment & onboarding
 * - Exclusive benefits
 * - Feedback collection
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'program_info' } = await req.json();

    // PROGRAM INFO
    if (action === 'program_info') {
      return Response.json({
        success: true,
        program: {
          name: 'DataJud Founders Club',
          status: 'recruiting',
          target_members: 100,
          current_members: 28,
          launch_date: '2026-03-05',
          benefits: [
            {
              name: 'Lifetime discount',
              value: '30% off for life',
              tier: 'all'
            },
            {
              name: 'Priority support',
              value: '24/7 dedicated support',
              tier: 'all'
            },
            {
              name: 'Custom features',
              value: 'Direct influence on roadmap',
              tier: 'platinum'
            },
            {
              name: 'Free credits',
              value: '$500/month in API credits',
              tier: 'platinum'
            },
            {
              name: 'Founders badge',
              value: 'Exclusive badge in app',
              tier: 'all'
            }
          ],
          tiers: [
            {
              name: 'Silver',
              price_monthly: 'Free',
              max_members: 50,
              benefits_count: 2
            },
            {
              name: 'Gold',
              price_monthly: 'R$99',
              max_members: 30,
              benefits_count: 3
            },
            {
              name: 'Platinum',
              price_monthly: 'R$299',
              max_members: 20,
              benefits_count: 5
            }
          ]
        }
      });
    }

    // LIST MEMBERS
    if (action === 'members') {
      return Response.json({
        success: true,
        members: {
          total: 28,
          by_tier: {
            silver: 12,
            gold: 10,
            platinum: 6
          },
          recent: [
            {
              name: 'João Silva',
              email: 'joao@lawfirm.com',
              joined: '2026-03-02',
              tier: 'platinum',
              company: 'Silva & Associados'
            },
            {
              name: 'Maria Santos',
              email: 'maria@jus.com',
              joined: '2026-03-01',
              tier: 'gold',
              company: 'Santos Consultoria Jurídica'
            }
          ]
        }
      });
    }

    // SEND INVITATION
    if (action === 'invite') {
      const { email, tier = 'gold' } = await req.json();
      return Response.json({
        success: true,
        invitation: {
          to: email,
          tier,
          status: 'sent',
          sent_at: new Date().toISOString(),
          expires_in_days: 7
        }
      });
    }

    // GET MEMBER STATS
    if (action === 'member_stats') {
      return Response.json({
        success: true,
        stats: {
          user_id: user.email,
          tier: 'gold',
          joined_date: '2026-02-15',
          processes_added: 45,
          deadlines_set: 82,
          api_calls_used: '12500/50000',
          feedback_submissions: 3,
          surveys_completed: 2
        }
      });
    }

    // EXCLUSIVE CONTENT
    if (action === 'exclusive_content') {
      return Response.json({
        success: true,
        content: [
          {
            id: 'webinar_1',
            title: 'Advanced DataJud Integration Strategies',
            date: '2026-03-10T14:00Z',
            instructor: 'Luiz Architeto',
            duration_minutes: 60
          },
          {
            id: 'workshop_1',
            title: 'Building Custom Workflows',
            date: '2026-03-15T15:00Z',
            instructor: 'Carmen DBA',
            duration_minutes: 120
          },
          {
            id: 'beta_feature_1',
            title: 'AI Predictive Analytics (Beta)',
            status: 'exclusive_access',
            available_for: 'platinum'
          }
        ]
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[EarlyAdopterProgram] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});