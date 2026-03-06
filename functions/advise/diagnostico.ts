import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { AdviseClient } from './utils/client.js';

/**
 * Função de diagnóstico - Validar token e endpoints Advise
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const token = Deno.env.get('ADVISE_TOKEN');
    const diagnostico = {
      timestamp: new Date().toISOString(),
      tokenConfigured: !!token,
      tokenLength: token?.length || 0,
      tests: []
    };

    if (!token) {
      return Response.json({
        success: false,
        error: 'ADVISE_TOKEN não configurado',
        diagnostico
      });
    }

    const client = new AdviseClient(token);

    // Teste 1: Endpoint /core/v1/publicacoes-clientes
    console.log('[Diagnóstico] Teste 1: /core/v1/publicacoes-clientes');
    try {
      const url1 = '/core/v1/publicacoes-clientes?campos=*&lido=false&registrosPorPagina=1&paginaAtual=1';
      const resp1 = await client.get(url1);
      console.log('[Diagnóstico] Resposta 1:', JSON.stringify(resp1).substring(0, 200));
      diagnostico.tests.push({
        endpoint: '/core/v1/publicacoes-clientes',
        status: 'OK',
        response: {
          type: typeof resp1,
          isArray: Array.isArray(resp1),
          keys: Object.keys(resp1 || {}).slice(0, 5),
          dataType: resp1?.publicacoes ? 'object.publicacoes' : resp1?.dados ? 'object.dados' : 'unknown',
          length: Array.isArray(resp1) ? resp1.length : (resp1?.publicacoes?.length || resp1?.dados?.length || 0)
        }
      });
    } catch (err1) {
      console.error('[Diagnóstico] Erro 1:', err1.message);
      diagnostico.tests.push({
        endpoint: '/core/v1/publicacoes-clientes',
        status: 'ERROR',
        error: err1.message
      });
    }

    // Teste 2: Endpoint alternativo /v2/publicacoes
    console.log('[Diagnóstico] Teste 2: /v2/publicacoes');
    try {
      const url2 = '/v2/publicacoes?campos=*&lido=false&registrosPorPagina=1&paginaAtual=1';
      const resp2 = await client.get(url2);
      console.log('[Diagnóstico] Resposta 2:', JSON.stringify(resp2).substring(0, 200));
      diagnostico.tests.push({
        endpoint: '/v2/publicacoes',
        status: 'OK',
        response: {
          type: typeof resp2,
          isArray: Array.isArray(resp2),
          keys: Object.keys(resp2 || {}).slice(0, 5),
          length: Array.isArray(resp2) ? resp2.length : (resp2?.publicacoes?.length || resp2?.dados?.length || 0)
        }
      });
    } catch (err2) {
      console.error('[Diagnóstico] Erro 2:', err2.message);
      diagnostico.tests.push({
        endpoint: '/v2/publicacoes',
        status: 'ERROR',
        error: err2.message
      });
    }

    // Teste 3: Endpoint de consulta paginada
    console.log('[Diagnóstico] Teste 3: /core/v1/publicacoes-clientes/consulta-paginada');
    try {
      const url3 = '/core/v1/publicacoes-clientes/consulta-paginada?campos=*&lido=false&registrosPorPagina=1&paginaAtual=1';
      const resp3 = await client.get(url3);
      console.log('[Diagnóstico] Resposta 3:', JSON.stringify(resp3).substring(0, 200));
      diagnostico.tests.push({
        endpoint: '/core/v1/publicacoes-clientes/consulta-paginada',
        status: 'OK',
        response: {
          type: typeof resp3,
          keys: Object.keys(resp3 || {}).slice(0, 5),
          length: Array.isArray(resp3) ? resp3.length : (resp3?.publicacoes?.length || 0)
        }
      });
    } catch (err3) {
      console.error('[Diagnóstico] Erro 3:', err3.message);
      diagnostico.tests.push({
        endpoint: '/core/v1/publicacoes-clientes/consulta-paginada',
        status: 'ERROR',
        error: err3.message
      });
    }

    // Análise
    const sucessos = diagnostico.tests.filter(t => t.status === 'OK').length;
    const temDados = diagnostico.tests.some(t => t.response?.length > 0);

    diagnostico.analysis = {
      endpointsOK: sucessos,
      endpointsTotal: diagnostico.tests.length,
      temDados: temDados,
      recomendacao: temDados 
        ? '✅ API retornando dados - Código pronto'
        : sucessos > 0
        ? '⚠️ API respondendo mas sem dados (token sem escopo?)'
        : '❌ Nenhum endpoint respondendo'
    };

    return Response.json({
      success: true,
      diagnostico
    });

  } catch (error) {
    console.error('[Diagnóstico] Erro geral:', error.message);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});