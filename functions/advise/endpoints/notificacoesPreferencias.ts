import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseApiUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const {
      canaisAtivos = ['email', 'push', 'in_app'],
      frequencia = 'diaria',
      horarioNotificacoes,
      tiposAlerta = ['prazo', 'movimentacao', 'audiencia']
    } = await req.json();

    if (!canaisAtivos || canaisAtivos.length === 0) {
      return Response.json({
        success: false,
        error: 'canaisAtivos é obrigatório (array de canais)'
      }, { status: 400 });
    }

    // PUT /notificacoes/preferencias - atualiza preferências de notificação
    const response = await fetch(`${adviseApiUrl}/notificacoes/preferencias`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        canaisAtivos: canaisAtivos,
        frequencia: frequencia,
        horarioNotificacoes: horarioNotificacoes,
        tiposAlerta: tiposAlerta,
        usuarioEmail: user.email
      })
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const preferencias = await response.json();

    // Atualizar preferências do usuário
    await base44.auth.updateMe({
      notificacoesPreferencias: {
        canaisAtivos: canaisAtivos,
        frequencia: frequencia,
        horarioNotificacoes: horarioNotificacoes,
        tiposAlerta: tiposAlerta,
        dataAtualizacao: new Date().toISOString()
      }
    });

    return Response.json({
      success: true,
      action: 'notificacoes.preferencias',
      data: {
        canaisAtivos: canaisAtivos,
        frequencia: frequencia,
        horarioNotificacoes: horarioNotificacoes,
        tiposAlerta: tiposAlerta,
        usuarioEmail: user.email,
        salvo: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});