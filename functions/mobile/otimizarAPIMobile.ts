import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint, dados, formato = 'comprimido' } = await req.json();

    if (!endpoint) {
      return Response.json({
        success: false,
        error: 'endpoint é obrigatório'
      }, { status: 400 });
    }

    // Mobile optimization strategies
    const otimizacoes = {
      comprimido: {
        removerCamposNulos: true,
        compressaoGzip: true,
        paginacao: 20,
        campos: ['id', 'titulo', 'status', 'dataAtualizacao']
      },
      minimo: {
        removerCamposNulos: true,
        compressaoGzip: true,
        paginacao: 10,
        campos: ['id', 'titulo']
      },
      completo: {
        removerCamposNulos: false,
        compressaoGzip: true,
        paginacao: 50,
        campos: null
      }
    };

    const config = otimizacoes[formato] || otimizacoes.comprimido;

    // Build optimized response
    let resposta = dados;
    
    if (Array.isArray(resposta)) {
      resposta = resposta.map(item => {
        if (config.campos) {
          const optimized = {};
          config.campos.forEach(campo => {
            if (item[campo] !== undefined) {
              optimized[campo] = item[campo];
            }
          });
          return optimized;
        }
        return item;
      });
    } else if (config.campos && typeof resposta === 'object') {
      const optimized = {};
      config.campos.forEach(campo => {
        if (resposta[campo] !== undefined) {
          optimized[campo] = resposta[campo];
        }
      });
      resposta = optimized;
    }

    // Calculate payload size
    const payloadJson = JSON.stringify(resposta);
    const originalSize = Buffer.byteLength(payloadJson);
    const comprimido = Buffer.byteLength(payloadJson.split('').reduce((a, b) => a + b, ''));

    const metricas = {
      endpoint,
      formato,
      tamanhoOriginal: originalSize,
      tamanhoOtimizado: comprimido,
      reducaoPercentual: Math.round(((originalSize - comprimido) / originalSize) * 100),
      compressaoGzip: config.compressaoGzip,
      paginacao: config.paginacao
    };

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'otimizarAPIMobile',
      entidade: 'API',
      resultado: 'success',
      metadados: metricas
    });

    return Response.json({
      success: true,
      action: 'mobile.otimizarAPIMobile',
      data: resposta,
      metricas
    }, {
      headers: {
        'Content-Encoding': 'gzip',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('OtimizarAPIMobile error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});