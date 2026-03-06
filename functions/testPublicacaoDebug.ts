import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { AdviseClient } from './advise/utils/client.js';
import { PublicacaoService } from './advise/publicacoes.js';

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

    console.log('[Debug] Iniciando teste de publicações');
    console.log('[Debug] Token:', token.substring(0, 10) + '...');

    const client = new AdviseClient(token);
    const service = new PublicacaoService(client);

    console.log('[Debug] Chamando consultarPublicacoes');
    const result = await service.consultarPublicacoes(false, null, null, 5, 1);

    console.log('[Debug] Resultado:', result);
    console.log('[Debug] Tipo:', typeof result);
    console.log('[Debug] É array?:', Array.isArray(result));
    console.log('[Debug] Keys:', result ? Object.keys(result).slice(0, 5) : 'null');

    return Response.json({
      success: true,
      result,
      details: {
        type: typeof result,
        isArray: Array.isArray(result),
        keys: result ? Object.keys(result).slice(0, 5) : null,
        length: Array.isArray(result) ? result.length : result?.length || 'N/A'
      }
    });

  } catch (error) {
    console.error('[Debug] Erro:', error);
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});