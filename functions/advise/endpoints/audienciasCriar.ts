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
      processoId,
      numeroProcesso,
      dataAudiencia,
      tipo,
      juiz,
      sala,
      descricao
    } = await req.json();

    // Validar campos obrigatórios
    if (!processoId || !dataAudiencia) {
      return Response.json({
        success: false,
        error: 'processoId e dataAudiencia são obrigatórios'
      }, { status: 400 });
    }

    // POST /audiencias - criar nova audiência
    const response = await fetch(`${adviseApiUrl}/audiencias`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        processoId,
        numeroProcesso,
        dataAudiencia,
        tipo: tipo || 'instrucao',
        juiz,
        sala,
        descricao
      })
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const audEncriada = await response.json();

    // Sincronizar com banco de dados
    const audiencia = await base44.entities.Audiencia.create({
      idProcessoAdvise: processoId,
      numeroProcesso: numeroProcesso || '',
      dataAudiencia: dataAudiencia,
      tipo: tipo || 'instrucao',
      juiz: juiz || '',
      sala: sala || '',
      descricao: descricao || '',
      comparecimento: 'pendente',
      data_criacao: new Date().toISOString()
    });

    return Response.json({
      success: true,
      action: 'audiencias.criar',
      data: {
        id: audiencia.id,
        audiencia: audiencia,
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