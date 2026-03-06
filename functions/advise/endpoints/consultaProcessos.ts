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
      numeroProcesso,
      status,
      tribunal,
      dataInicio,
      dataFim,
      paginaAtual = 1,
      registrosPorPagina = 50,
      campos = '*'
    } = await req.json();

    // Validação mínima
    if (!numeroProcesso && !tribunal && !status && !dataInicio) {
      return Response.json({
        error: 'Ao menos um filtro é obrigatório (numeroProcesso, tribunal, status ou dataInicio)'
      }, { status: 400 });
    }

    // Construir URL com filtros opcionais
    const params = new URLSearchParams({
      paginaAtual: String(paginaAtual),
      registrosPorPagina: String(registrosPorPagina),
      campos: campos
    });

    if (numeroProcesso) params.append('numeroProcesso', numeroProcesso);
    if (status) params.append('status', status);
    if (tribunal) params.append('tribunal', tribunal);
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);

    const url = `${adviseApiUrl}/core/v1/processos?${params}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const data = await response.json();
    const processos = data.itens || data.processos || data.data || [];

    // Sincronizar com banco de dados
    for (const proc of processos) {
      const existente = await base44.entities.ProcessoAdvise.filter({
        idProcessoAdvise: proc.idProcessoAdvise || proc.id
      });

      const processoData = {
        idProcessoAdvise: proc.idProcessoAdvise || proc.id,
        numeroProcesso: proc.numeroProcesso,
        numeroCNJ: proc.numeroCNJ || false,
        statusProcesso: proc.status || proc.statusProcesso || 'ativo',
        tribunal: proc.tribunal || '',
        vara: proc.vara || '',
        municipio: proc.municipio || '',
        dataDistribuicao: proc.dataDistribuicao,
        dataUltimo: proc.dataUltimo || proc.dataUltimoMovimento,
        partesProcesso: proc.partes || proc.partesProcesso || [],
        classeProcessual: proc.classeProcessual || proc.classe || '',
        assunto: proc.assunto || '',
        assuntos: proc.assuntos || [proc.assunto].filter(Boolean),
        juiz: proc.juiz || '',
        valorCausa: proc.valorCausa ? Number(proc.valorCausa) : 0,
        grau: proc.grau || '1º grau',
        dataSincronizacao: new Date().toISOString(),
        ultimoAndamento: proc.ultimoAndamento || ''
      };

      if (existente.length === 0) {
        await base44.entities.ProcessoAdvise.create(processoData);
      } else {
        await base44.entities.ProcessoAdvise.update(existente[0].id, processoData);
      }
    }

    return Response.json({
      success: true,
      action: 'processos.consulta',
      data: {
        processos: processos,
        totalProcessos: processos.length,
        filtros: {
          numeroProcesso: numeroProcesso || 'não definido',
          status: status || 'todos',
          tribunal: tribunal || 'todos',
          dataInicio: dataInicio || 'não definida',
          dataFim: dataFim || 'não definida'
        },
        paginacao: {
          paginaAtual,
          registrosPorPagina,
          total: data.paginacao?.registrosTotal || data.total || processos.length
        },
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