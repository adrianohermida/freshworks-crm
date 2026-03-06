import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função de debug para testar a API Advise
 * Retorna informações sobre resposta, estrutura de dados, etc
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = Deno.env.get('ADVISE_TOKEN');
    if (!token) {
      return Response.json({ error: 'ADVISE_TOKEN não configurado' }, { status: 500 });
    }

    const ADVISE_API_URL = "https://sandbox-api.advise.com.br";
    const debugInfo = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Endpoint /core/v1/publicacoes-clientes
    try {
      const params1 = new URLSearchParams({
        Campos: '*',
        Lido: 'false',
        RegistrosPorPagina: '10',
        paginaAtual: '1'
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 segundos

      const res1 = await fetch(
        `${ADVISE_API_URL}/core/v1/publicacoes-clientes?${params1}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      debugInfo.tests.push({
        endpoint: '/core/v1/publicacoes-clientes',
        status: res1.status,
        statusText: res1.statusText,
        headers: Object.fromEntries(res1.headers.entries()),
        contentType: res1.headers.get('content-type'),
        isOk: res1.ok
      });

      if (res1.ok) {
        const data = await res1.json();
        debugInfo.tests[0].responseType = typeof data;
        debugInfo.tests[0].isArray = Array.isArray(data);
        debugInfo.tests[0].sampleData = JSON.stringify(data).substring(0, 200);
        debugInfo.tests[0].dataStructure = data ? Object.keys(data).slice(0, 5) : null;
        debugInfo.tests[0].recordCount = Array.isArray(data) ? data.length : 'N/A';
      } else {
        const errorText = await res1.text();
        debugInfo.tests[0].error = errorText.substring(0, 200);
      }
    } catch (e) {
      debugInfo.tests.push({
        endpoint: '/core/v1/publicacoes-clientes',
        error: e.message,
        type: e.name
      });
    }

    // Test 2: Endpoint /v2/publicacoes (alternativo)
    try {
      const params2 = new URLSearchParams({
        campos: '*',
        lido: 'false',
        registrosPorPagina: '10',
        paginaAtual: '1'
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res2 = await fetch(
        `${ADVISE_API_URL}/v2/publicacoes?${params2}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      debugInfo.tests.push({
        endpoint: '/v2/publicacoes',
        status: res2.status,
        statusText: res2.statusText,
        isOk: res2.ok
      });

      if (res2.ok) {
        const data = await res2.json();
        debugInfo.tests[1].responseType = typeof data;
        debugInfo.tests[1].isArray = Array.isArray(data);
        debugInfo.tests[1].sampleData = JSON.stringify(data).substring(0, 200);
        debugInfo.tests[1].recordCount = Array.isArray(data) ? data.length : 'N/A';
      }
    } catch (e) {
      debugInfo.tests.push({
        endpoint: '/v2/publicacoes',
        error: e.message
      });
    }

    return Response.json({
      success: true,
      debugInfo,
      recommendation: debugInfo.tests[0]?.isOk ? 'Usar /core/v1/publicacoes-clientes' : 'Verificar token ou usar /v2/publicacoes'
    });

  } catch (error) {
    console.error('Erro no debug:', error);
    return Response.json({
      error: error.message
    }, { status: 500 });
  }
});