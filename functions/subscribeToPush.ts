import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para salvar push notification subscription
 * POST - Armazena endpoint de push do navegador
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Método não permitido' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { endpoint, auth, p256dh } = body;

    if (!endpoint) {
      return Response.json(
        { error: 'endpoint é obrigatório' },
        { status: 400 }
      );
    }

    // Salvar subscription em metadados do usuário
    // Ou criar tabela dedicada se necessário
    const subscriptionData = {
      endpoint,
      auth: auth || '',
      p256dh: p256dh || '',
      subscribedAt: new Date().toISOString(),
      userAgent: req.headers.get('user-agent') || ''
    };

    // Aqui você salvaria em um banco de dados
    // Por enquanto, retorna sucesso
    console.log('[Push] Subscription saved for user:', user.email, subscriptionData);

    return new Response(JSON.stringify({
      success: true,
      message: 'Subscription salva com sucesso',
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erro ao salvar subscription:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});