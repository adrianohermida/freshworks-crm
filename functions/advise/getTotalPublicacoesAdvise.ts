/**
 * Busca o total de publicações disponíveis no Advise
 * Usado para metrificar quantas publicações faltam importar
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ADVISE_TOKEN = Deno.env.get('ADVISE_TOKEN');
    const ADVISE_API_URL = Deno.env.get('ADVISE_API_URL');

    if (!ADVISE_TOKEN || !ADVISE_API_URL) {
      return Response.json({ error: 'ADVISE_TOKEN ou ADVISE_API_URL não configurados' }, { status: 500 });
    }

    // Data do último ano
    const dataFim = new Date().toISOString().split('T')[0];
    const dataInicio = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Requisição com RegistrosPorPagina=1 para pegar só o total sem baixar dados
    const url = new URL(ADVISE_API_URL.replace(/\/$/, ''));
    url.searchParams.append('campos', '*');
    url.searchParams.append('RegistrosPorPagina', '1');
    url.searchParams.append('paginaAtual', '1');
    url.searchParams.append('DataInicioMovimento', dataInicio);
    url.searchParams.append('DataFimMovimento', dataFim);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADVISE_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na API Advise: ${response.status}`, errorText);
      return Response.json({ 
        error: `API Advise retornou ${response.status}`,
        confiavel: false,
        totalPublicacoesAdvise: null
      }, { status: 200 });
    }

    const data = await response.json();

    // Extrair o total da resposta
    const totalPublicacoes = data.totalPaginaRegistros || data.total;
    
    if (totalPublicacoes === undefined || totalPublicacoes === null || totalPublicacoes < 0) {
      console.error('Total inválido ou não encontrado. Data:', data);
      return Response.json({
        error: 'Campo total inválido na API',
        confiavel: false,
        totalPublicacoesAdvise: null,
        responseKeys: Object.keys(data)
      }, { status: 200 });
    }
    
    // Buscar quantas já estão importadas no BD
    const publicacoesImportadas = await base44.asServiceRole.entities.PublicacaoAdvise.list();
    const totalImportadas = publicacoesImportadas.length;
    const faltamImportar = totalPublicacoes - totalImportadas;

    console.log(`\n📊 MÉTRICAS DE PUBLICAÇÕES`);
    console.log(`Total na API: ${totalPublicacoes}`);
    console.log(`Total importadas: ${totalImportadas}`);
    console.log(`Faltam importar: ${faltamImportar}`);
    console.log(`Progresso: ${((totalImportadas / totalPublicacoes) * 100).toFixed(2)}%\n`);

    return Response.json({
      totalPublicacoesAdvise: Number(totalPublicacoes),
      totalImportadas: totalImportadas,
      faltamImportar: faltamImportar,
      percentualProgresso: totalPublicacoes > 0 ? ((totalImportadas / totalPublicacoes) * 100).toFixed(2) : 0,
      confiavel: true,
      periodo: { dataInicio, dataFim },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar total de publicações:', error.message);
    return Response.json({ 
      error: error.message,
      confiavel: false,
      totalPublicacoesAdvise: null
    }, { status: 200 });
  }
});