/**
 * Função para contar total de publicações disponíveis na API Advise
 * Estratégia: fazer uma busca paginada com limit=1 para obter o total
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseApiToken = Deno.env.get('ADVISE_TOKEN');
    const adviseApiUrl = Deno.env.get('ADVISE_API_URL');

    if (!adviseApiToken || !adviseApiUrl) {
      return Response.json({ error: 'API credentials not configured' }, { status: 500 });
    }

    // Buscar com limit=1 para obter apenas o total sem dados
    const datas = getDatesRange();
    const url = new URL(`${adviseApiUrl}/core/v1/publicacoes-clientes/consulta-paginada`);
    url.searchParams.append('campos', '*');
    url.searchParams.append('RegistrosPorPagina', '1');
    url.searchParams.append('paginaAtual', '1');
    url.searchParams.append('DataInicioMovimento', datas.dataInicio);
    url.searchParams.append('DataFimMovimento', datas.dataFim);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseApiToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Advise API error: ${response.status}`);
      return Response.json({
        status: 'error',
        totalPublicacoes: null,
        confiavel: false,
        message: `API returned ${response.status}`,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    const data = await response.json();
    const totalPublicacoes = data.totalPaginaRegistros || data.totalRegistros || data.total;

    // Validar se o total é um número válido e positivo
    if (totalPublicacoes === undefined || totalPublicacoes === null || totalPublicacoes < 0) {
      console.error(`Invalid total value: ${totalPublicacoes}. Data:`, data);
      return Response.json({
        status: 'error',
        totalPublicacoes: null,
        confiavel: false,
        message: 'Campo total inválido ou não encontrado',
        timestamp: new Date().toISOString(),
        responseKeys: Object.keys(data)
      }, { status: 200 });
    }

    return Response.json({
      status: 'success',
      totalPublicacoes: Number(totalPublicacoes),
      confiavel: true,
      timestamp: new Date().toISOString(),
      source: 'advise_api'
    });
  } catch (error) {
    console.error('Error counting publicacoes:', error);
    return Response.json({ 
      status: 'error',
      totalPublicacoes: 0,
      error: error.message 
    });
  }
});

function getDatesRange() {
  const dataFim = new Date().toISOString().split('T')[0];
  const dataInicio = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return { dataInicio, dataFim };
}