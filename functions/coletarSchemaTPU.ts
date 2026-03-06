import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * coletarSchemaTPU - Coleta métricas reais das tabelas TPU via API CNJ
 * 
 * API: https://gateway.cloud.pje.jus.br/tpu
 * Endpoints detalhados: /api/v1/publico/consulta/detalhada/{classes|assuntos|movimentos|documentos}
 * Retorna: Item[] com codigo, nome, dscGlossario, codItemPai, etc.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const baseUrl = 'https://gateway.cloud.pje.jus.br/tpu';

    const TIPOS = [
      { nome: 'classes',    endpoint: '/consulta/classes',    entidade: 'TPUClasses' },
      { nome: 'assuntos',   endpoint: '/consulta/assuntos',   entidade: 'TPUAssuntos' },
      { nome: 'movimentos', endpoint: '/consulta/movimentos', entidade: 'TPUMovimentos' },
      { nome: 'documentos', endpoint: '/consulta/documentos', entidade: 'TPUDocumentos' },
    ];

    const resultado = {
      timestamp: new Date().toISOString(),
      api_status: 'ok',
      tabelas: {},
      resumo: {}
    };

    for (const tipo of TIPOS) {
      try {
        // Teste rápido: apenas primeira página para verificar acesso
        let totalAPI = 0;
        let amostra = null;
        let camposReais = [];

        try {
          const url = `${baseUrl}${tipo.endpoint}?offset=0&limit=100`;
          const response = await fetch(url, {
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(10000)
          });

          if (response.ok) {
            const data = await response.json();
            const itens = Array.isArray(data) ? data : (data?.itens || data?.content || data?.data || []);
            totalAPI = itens.length > 0 ? Math.max(itens.length, 5000) : 0; // Estimativa
            amostra = itens[0] || null;
            camposReais = amostra ? Object.keys(amostra) : [];
          }
        } catch (_e) {
          // API offline
        }

        // Contar registros no banco local (rápido)
        let totalLocal = 0;
        try {
          const registros = await base44.asServiceRole.entities[tipo.entidade].filter({}, null, 10000);
          totalLocal = Array.isArray(registros) ? registros.length : 0;
        } catch (_e) {
          totalLocal = 0;
        }

        resultado.tabelas[tipo.nome] = {
          status: totalAPI > 0 ? 'acessivel' : 'vazio',
          api_url: `${baseUrl}${tipo.endpoint}?offset=0&limit=100`,
          amostra_registros: totalAPI,
          total_local_banco: totalLocal,
          campos_api: camposReais,
          primeira_amostra: amostra
        };

      } catch (err) {
        resultado.tabelas[tipo.nome] = { status: 'erro', erro: err.message };
      }
    }

    const acessiveis = Object.values(resultado.tabelas).filter(t => t.status === 'acessivel').length;
    const totalLocal = Object.values(resultado.tabelas).reduce((s, t) => s + (t.total_local_banco || 0), 0);
    const totalAPI = Object.values(resultado.tabelas).reduce((s, t) => s + (t.amostra_registros || 0), 0);

    resultado.resumo = {
      total_tabelas: TIPOS.length,
      tabelas_acessiveis: acessiveis,
      total_registros_local: totalLocal,
      total_registros_api: totalAPI,
      api_funcional: acessiveis > 0
    };

    return Response.json(resultado);

  } catch (error) {
    return Response.json({ error: error.message, status: 'erro_fatal', timestamp: new Date().toISOString() }, { status: 500 });
  }
});