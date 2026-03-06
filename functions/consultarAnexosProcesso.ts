import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para consultar anexos do processo
 * GET /core/v1/anexo-fonte-processo/{id}
 * Lista todos os anexos de um processo com URLs de download
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const numeroProcesso = url.searchParams.get('numeroProcesso');
    const idProcessoAdvise = url.searchParams.get('idProcessoAdvise');
    const tipo = url.searchParams.get('tipo'); // filtro opcional

    if (!numeroProcesso && !idProcessoAdvise) {
      return Response.json(
        { error: 'numeroProcesso ou idProcessoAdvise é obrigatório' },
        { status: 400 }
      );
    }

    // Consultar Advise
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const queryId = idProcessoAdvise || numeroProcesso;
    const response = await fetch(
      `${adviseUrl}/core/v1/anexo-fonte-processo/${queryId}?campos=*`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adviseToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { error: errorData.message || 'Erro ao consultar anexos' },
        { status: response.status }
      );
    }

    const adviseData = await response.json();
    const anexos = Array.isArray(adviseData) ? adviseData : adviseData.anexos || [];

    // Filtrar por tipo se fornecido
    const anexosFiltrados = tipo
      ? anexos.filter(a => a.tipo === tipo)
      : anexos;

    // Mapear estrutura Advise para AnexoProcesso
    const anexosFormatados = anexosFiltrados.map(a => ({
      idAnexo: a.idAnexo,
      numeroProcesso: numeroProcesso || a.numeroProcesso,
      nomeArquivo: a.nomeArquivo,
      extensao: a.extensao || a.nomeArquivo?.split('.').pop(),
      tamanhoBytes: a.tamanhoBytes || 0,
      tipo: a.tipo,
      descricao: a.descricao || '',
      dataUpload: a.dataUpload,
      dataDocumento: a.dataDocumento,
      autoria: a.autoria || 'Sistema',
      assinado: a.assinado || false,
      privado: a.privado || false,
      hashSha256: a.hashSha256 || '',
      metadados: a.metadados || {}
    }));

    // Sincronizar com base44 (upsert)
    for (const anexo of anexosFormatados) {
      try {
        // Buscar se já existe
        const existing = await base44.entities.AnexoProcesso.filter({
          idAnexo: anexo.idAnexo
        });

        if (existing.length === 0) {
          // Criar novo
          await base44.entities.AnexoProcesso.create({
            ...anexo,
            dataSincronizacao: new Date().toISOString(),
            status: 'disponivel'
          });
        }
      } catch (err) {
        console.error('Erro ao sincronizar anexo:', err);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      total: anexosFormatados.length,
      anexos: anexosFormatados,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300' // 5 minutos
      }
    });

  } catch (error) {
    console.error('Erro ao consultar anexos:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});