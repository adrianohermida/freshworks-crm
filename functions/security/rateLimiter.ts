import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limitConfigs = {
      defaultUser: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        description: 'Limite padrão para usuários'
      },
      premiumUser: {
        requestsPerMinute: 300,
        requestsPerHour: 5000,
        description: 'Limite para usuários premium'
      },
      admin: {
        requestsPerMinute: 1000,
        requestsPerHour: 10000,
        description: 'Limite para administradores'
      },
      apiEndpoints: {
        adviseAPI: {
          requestsPerMinute: 120,
          description: 'Rate limit para Advise API'
        },
        webhooks: {
          requestsPerMinute: 300,
          description: 'Rate limit para webhooks'
        }
      }
    };

    const userRole = user.role || 'defaultUser';
    const currentConfig = limitConfigs[userRole] || limitConfigs.defaultUser;

    return Response.json({
      success: true,
      action: 'security.rateLimiter',
      data: {
        userEmail: user.email,
        userRole: userRole,
        currentLimits: currentConfig,
        allConfigs: limitConfigs,
        status: 'active',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Rate limiter error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});