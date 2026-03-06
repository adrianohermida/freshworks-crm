import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const token = Deno.env.get('ADVISE_TOKEN');
    if (!token || token === '') {
      return Response.json({
        error: 'ADVISE_TOKEN não configurado',
        code: 'NO_TOKEN'
      }, { status: 400 });
    }

    // Log do token para debug
    console.log('[TEST] Token length:', token.length);
    console.log('[TEST] Token starts with:', token.substring(0, 20) + '...');

    // Testar com requisição simples e timeout maior
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(
        'https://sandbox-api.advise.com.br/core/v1/publicacoes-clientes/consulta-paginada?Campos=*&Lido=false&DataInicioMovimento=2026-02-01&DataFimMovimento=2026-03-03&RegistrosPorPagina=1&paginaAtual=1',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      return Response.json({
        success: response.ok,
        status: response.status,
        message: response.statusText,
        tokenValid: response.status !== 401
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return Response.json({
          error: 'Request timeout (API Advise não respondeu em 3s)',
          status: 408
        }, { status: 408 });
      }
      return Response.json({
        error: fetchError.message,
        status: 502
      }, { status: 502 });
    }

  } catch (error) {
    console.error('[TEST] Erro:', error.message);
    return Response.json({
      error: error.message,
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
});