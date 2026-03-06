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
      audienciaId,
      comparecimento,
      novasAnotacoes,
      resultado
    } = await req.json();

    if (!audienciaId || !comparecimento) {
      return Response.json({
        success: false,
        error: 'audienciaId e comparecimento são obrigatórios'
      }, { status: 400 });
    }

    const validosComparecimento = ['pendente', 'confirmado', 'nao_comparecimento', 'adiada'];
    if (!validosComparecimento.includes(comparecimento)) {
      return Response.json({
        success: false,
        error: `comparecimento deve ser um de: ${validosComparecimento.join(', ')}`
      }, { status: 400 });
    }

    // PUT /audiencias/:id - atualiza audiência
    const response = await fetch(`${adviseApiUrl}/audiencias/${audienciaId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comparecimento: comparecimento,
        novasAnotacoes: novasAnotacoes,
        resultado: resultado
      })
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const audienciaAtualizada = await response.json();

    // Sincronizar com banco de dados
    const existente = await base44.entities.Audiencia.filter({});
    
    if (existente.length > 0) {
      const audiencia = existente.find(a => a.id === audienciaId);
      if (audiencia) {
        await base44.entities.Audiencia.update(audienciaId, {
          comparecimento: comparecimento,
          lembrete_enviado: true,
          data_criacao: new Date().toISOString()
        });
      }
    }

    return Response.json({
      success: true,
      action: 'audiencias.atualizar',
      data: {
        audienciaId: audienciaId,
        comparecimento: comparecimento,
        novasAnotacoes: novasAnotacoes,
        resultado: resultado,
        atualizado: true,
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