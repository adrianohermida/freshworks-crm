import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const errorData = await req.json();

    if (!errorData.message) {
      return Response.json({ error: 'Error message required' }, { status: 400 });
    }

    // Criar registro de erro
    const errorLog = {
      user_email: user.email,
      error_type: errorData.type || 'Unknown',
      error_message: errorData.message,
      error_stack: errorData.stack || null,
      page_url: errorData.pageUrl || null,
      severity: errorData.severity || 'error',
      context: errorData.context ? JSON.stringify(errorData.context) : null,
      user_agent: errorData.userAgent || null,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    const result = await base44.asServiceRole.entities.ErrorLog.create(errorLog);

    // Se for erro crítico, registrar para alertas
    if (errorData.severity === 'critical') {
      console.error('CRITICAL ERROR:', errorData.message, errorData.stack);
      
      // Aqui iria integração com Sentry ou similar
      // await sendToSentry(errorData);
    }

    return Response.json({
      success: true,
      errorId: result.id,
      tracked: true
    });

  } catch (error) {
    console.error('Error tracking error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});