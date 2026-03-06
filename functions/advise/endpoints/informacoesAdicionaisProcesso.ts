import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { numeroProcesso } = await req.json();

    if (!numeroProcesso) {
      return Response.json({
        success: false,
        error: 'numeroProcesso é obrigatório'
      }, { status: 400 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = 'https://api.advise.com.br';

    // Fetch info adicional from Advise API
    const response = await fetch(`${adviseUrl}/core/v1/processos-clientes/informacoes-adicionais`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ numeroProcesso })
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Advise API error: ${error.message || 'Unknown error'}`
      }, { status: response.status });
    }

    const infoData = await response.json();

    // Store additional metadata
    const infos = {
      numeroProcesso,
      pareceresCount: infoData.pareceresCount || 0,
      documentosCount: infoData.documentosCount || 0,
      audienciasCount: infoData.audienciasCount || 0,
      movimentoUltimo: infoData.movimentoUltimo || null,
      dataDistribuicao: infoData.dataDistribuicao || null,
      dataPrazoFinal: infoData.dataPrazoFinal || null,
      tribunal: infoData.tribunal || '',
      vara: infoData.vara || '',
      grau: infoData.grau || '1º grau',
      dataSincronizacao: new Date().toISOString()
    };

    // Update ProcessoAdvise metadata
    const processos = await base44.entities.ProcessoAdvise.filter({
      numeroProcesso
    });

    if (processos && processos.length > 0) {
      await base44.entities.ProcessoAdvise.update(processos[0].id, {
        grau: infos.grau,
        dataDistribuicao: infos.dataDistribuicao,
        ultimoAndamento: infos.movimentoUltimo,
        dataSincronizacao: new Date().toISOString()
      });
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'informacoesAdicionais',
      entidade: 'ProcessoAdvise',
      resultado: 'success',
      metadados: { numeroProcesso }
    });

    return Response.json({
      success: true,
      action: 'processos.informacoesAdicionais',
      data: {
        numeroProcesso,
        pareceres: infos.pareceresCount,
        documentos: infos.documentosCount,
        audiencias: infos.audienciasCount,
        movimentoUltimo: infos.movimentoUltimo,
        dataDistribuicao: infos.dataDistribuicao,
        dataPrazoFinal: infos.dataPrazoFinal,
        tribunal: infos.tribunal,
        vara: infos.vara,
        grau: infos.grau,
        dataSincronizacao: new Date().toISOString(),
        message: `Informações adicionais recuperadas: ${infos.documentosCount} docs, ${infos.audienciasCount} audiências`
      }
    });
  } catch (error) {
    console.error('InformacoesAdicionaisProcesso error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});