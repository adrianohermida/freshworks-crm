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
      status,
      dataInicio,
      dataFim,
      paginaAtual = 1,
      registrosPorPagina = 50
    } = await req.json();

    // Construir URL com filtros opcionais
    const params = new URLSearchParams({
      paginaAtual: String(paginaAtual),
      registrosPorPagina: String(registrosPorPagina)
    });

    if (status) params.append('status', status);
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);

    const url = `${adviseApiUrl}/core/v1/intimacoes-clientes?${params}`;

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
    const intimacoes = data.itens || data.intimacoes || data.data || [];

    // Sincronizar com banco de dados
    for (const intim of intimacoes) {
      const existente = await base44.entities.IntimacaoAdvise.filter({
        idIntimacao: intim.idIntimacao || intim.id
      });

      const intimacaoData = {
        idIntimacao: intim.idIntimacao || intim.id,
        numeroProcesso: intim.numeroProcesso,
        tipo: intim.tipo || '',
        descricao: intim.descricao || '',
        dataMovimento: intim.dataMovimento || new Date().toISOString(),
        dataIntimacao: intim.dataIntimacao || intim.dataMovimento || new Date().toISOString(),
        fonte: intim.fonte || '',
        statusIntimacao: intim.status || intim.statusIntimacao || 'pendente',
        lido: intim.lido || false,
        conteudo: intim.conteudo || '',
        municipio: intim.municipio || '',
        vara: intim.vara || '',
        dataSincronizacao: new Date().toISOString(),
        idMovProcessoCliente: intim.idMovProcessoCliente || ''
      };

      if (existente.length === 0) {
        await base44.entities.IntimacaoAdvise.create(intimacaoData);
      } else {
        await base44.entities.IntimacaoAdvise.update(existente[0].id, intimacaoData);
      }
    }

    return Response.json({
      success: true,
      action: 'intimacoes-clientes.consulta',
      data: {
        intimacoes: intimacoes,
        totalIntimacoes: intimacoes.length,
        filtros: {
          status: status || 'todos',
          dataInicio: dataInicio || 'não definida',
          dataFim: dataFim || 'não definida'
        },
        paginacao: {
          paginaAtual,
          registrosPorPagina,
          total: data.paginacao?.registrosTotal || data.total || intimacoes.length
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