import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { numeroProcesso, limit = 100, offset = 0 } = await req.json();

    if (!numeroProcesso) {
      return Response.json({
        success: false,
        error: 'numeroProcesso é obrigatório'
      }, { status: 400 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = 'https://api.advise.com.br';

    // Fetch cabecalhos from Advise API
    const response = await fetch(`${adviseUrl}/core/v1/cabecalhos-processos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numeroProcesso,
        limit,
        offset
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Advise API error: ${error.message || 'Unknown error'}`
      }, { status: response.status });
    }

    const cabecalhosData = await response.json();
    const cabecalhos = Array.isArray(cabecalhosData) ? cabecalhosData : cabecalhosData.data || [];

    // Parse e sincronizar com ProcessoAdvise
    for (const cab of cabecalhos) {
      const processos = await base44.entities.ProcessoAdvise.filter({
        numeroProcesso
      });

      if (processos && processos.length > 0) {
        await base44.entities.ProcessoAdvise.update(processos[0].id, {
          assunto: cab.assunto || '',
          classeProcessual: cab.classe || '',
          statusProcesso: cab.status || 'ativo',
          valorCausa: cab.valorCausa || 0,
          juiz: cab.juiz || '',
          dataSincronizacao: new Date().toISOString()
        });
      }
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'cabecalhosProcessos',
      entidade: 'ProcessoAdvise',
      resultado: 'success',
      metadados: { numeroProcesso, cabecalhosCount: cabecalhos.length }
    });

    return Response.json({
      success: true,
      action: 'processos.cabecalhos',
      data: {
        numeroProcesso,
        cabecalhos: cabecalhos.map(cab => ({
          assunto: cab.assunto,
          classe: cab.classe,
          status: cab.status,
          valorCausa: cab.valorCausa,
          juiz: cab.juiz
        })),
        totalCabecalhos: cabecalhos.length,
        dataSincronizacao: new Date().toISOString(),
        message: `${cabecalhos.length} cabecalhos recuperados para processo ${numeroProcesso}`
      }
    });
  } catch (error) {
    console.error('CabecalhosProcessos error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});