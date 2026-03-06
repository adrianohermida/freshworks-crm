import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const DEFAULT_PREFERENCES = {
  theme: 'light',
  language: 'pt-BR',
  timezone: 'America/Manaus',
  notifications: { email: true, push: true, digest: 'daily', digestTime: '08:00' },
  dashboard: { defaultTab: 'publicacoes', itemsPerPage: 20, showKPIs: true },
  alerts: { prazosDias: 5, emailAlertas: true, pushAlertas: true },
  display: { compactMode: false, showProcessNumbers: true },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action, preferences } = body;

    if (action === 'save' && preferences) {
      await base44.auth.updateMe({ preferences: { ...DEFAULT_PREFERENCES, ...preferences } });
      return Response.json({ success: true, saved: preferences, message: 'Preferências salvas.' });
    }

    const current = user.preferences || DEFAULT_PREFERENCES;
    return Response.json({ success: true, preferences: current, defaults: DEFAULT_PREFERENCES });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});