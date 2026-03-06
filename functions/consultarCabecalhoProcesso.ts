import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para consultar dados do cabeçalho do processo
 * GET /core/v1/cabecalhos-processos
 * Retorna: juiz, classe, assunto, valor da causa, etc
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const idFonteProcesso = url.searchParams.get('idFonteProcesso');

    if (!idFonteProcesso) {
      return Response.json(
        { error: 'idFonteProcesso é obrigatório' },
        { status: 400 }
      );
    }

    // Chamar API Advise
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const response = await fetch(
      `${adviseUrl}/core/v1/cabecalhos-processos?campos=*&idFonteProcesso=${idFonteProcesso}`,
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
        { error: errorData.message || 'Erro ao consultar cabeçalho' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Estruturar resposta
    const cabecalho = {
      idFonteProcesso,
      numeroProcesso: data.numeroProcesso,
      juiz: data.juiz || 'Não informado',
      tribunal: data.tribunal || 'Não informado',
      vara: data.vara || 'Não informado',
      classe: data.classe || 'Não informada',
      assunto: data.assunto || 'Não informado',
      assuntos: data.assuntos || [],
      valorCausa: data.valorCausa || 0,
      dataDistribuicao: data.dataDistribuicao,
      dataInicio: data.dataInicio,
      municipio: data.municipio,
      grau: data.grau,
      status: data.status,
      partes: data.partes || [],
      metadados: data.metadados || {}
    };

    return new Response(JSON.stringify({
      success: true,
      cabecalho,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=1800' // 30 minutos
      }
    });

  } catch (error) {
    console.error('Erro ao consultar cabeçalho:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});