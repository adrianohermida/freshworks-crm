import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Perfil da Empresa', description: 'Configure nome, logo e dados do escritório' },
  { id: 2, name: 'Integração Advise', description: 'Conecte sua conta Advise com token API' },
  { id: 3, name: 'Configurar Alertas', description: 'Defina tipos de alerta e canais de notificação' },
  { id: 4, name: 'Convidar Equipe', description: 'Adicione advogados e assistentes' },
  { id: 5, name: 'Primeira Sincronização', description: 'Importe publicações e processos existentes' },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { step, data } = body;

    if (step) {
      const currentStep = ONBOARDING_STEPS.find(s => s.id === step);
      if (!currentStep) return Response.json({ error: 'Step inválido' }, { status: 400 });

      await base44.asServiceRole.entities.AuditLog.create({
        eventType: 'ADMIN_ACTION',
        timestamp: new Date().toISOString(),
        userId: user.email,
        userRole: user.role,
        details: { action: `onboarding_step_${step}`, stepName: currentStep.name, data },
        status: 'success'
      });

      return Response.json({
        success: true,
        step: currentStep,
        nextStep: step < 5 ? ONBOARDING_STEPS[step] : null,
        progress: Math.round((step / 5) * 100),
        message: `Etapa "${currentStep.name}" concluída.`
      });
    }

    return Response.json({
      success: true,
      steps: ONBOARDING_STEPS,
      totalSteps: 5,
      estimatedTime: '15 minutos',
      message: 'Wizard de onboarding carregado.'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});