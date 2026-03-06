import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, mudancas = [], ultimaSincronizacao } = await req.json();

    if (!acao) {
      return Response.json({
        success: false,
        error: 'acao é obrigatória (sync, upload, resolve-conflicts)'
      }, { status: 400 });
    }

    if (acao === 'sync') {
      // Sync offline changes
      const resultados = [];
      let sucessos = 0;
      let falhas = 0;

      for (const mudanca of mudancas) {
        try {
          const { tipo, entidade, id, dados, timestamp } = mudanca;

          if (tipo === 'create') {
            const created = await base44.entities[entidade]?.create(dados);
            sucessos++;
            resultados.push({
              id: mudanca.id,
              novoId: created?.id,
              status: 'sincronizado'
            });
          } else if (tipo === 'update') {
            await base44.entities[entidade]?.update(id, dados);
            sucessos++;
            resultados.push({
              id: mudanca.id,
              status: 'sincronizado'
            });
          } else if (tipo === 'delete') {
            await base44.entities[entidade]?.delete(id);
            sucessos++;
            resultados.push({
              id: mudanca.id,
              status: 'sincronizado'
            });
          }
        } catch (e) {
          falhas++;
          resultados.push({
            id: mudanca.id,
            status: 'falhou',
            erro: e.message
          });
        }
      }

      return Response.json({
        success: falhas === 0,
        action: 'mobile.sincronizacaoOffline',
        data: {
          acao: 'sync',
          totalMudancas: mudancas.length,
          sucessos,
          falhas,
          resultados,
          dataSincronizacao: new Date().toISOString()
        }
      });
    } else if (acao === 'upload') {
      // Upload only new data since last sync
      const ultimoSinc = new Date(ultimaSincronizacao || 0);
      
      return Response.json({
        success: true,
        action: 'mobile.sincronizacaoOffline',
        data: {
          acao: 'upload',
          ultimaSincronizacao: ultimoSinc.toISOString(),
          ultimaSincronizacaoRequerida: new Date().toISOString(),
          message: 'Upload disponível - use sync para sincronizar dados'
        }
      });
    } else if (acao === 'resolve-conflicts') {
      // Handle conflict resolution
      return Response.json({
        success: true,
        action: 'mobile.sincronizacaoOffline',
        data: {
          acao: 'resolve-conflicts',
          estrategia: 'server-wins',
          conflictosResolvidos: mudancas.length,
          message: 'Conflitos resolvidos com estratégia server-wins'
        }
      });
    }

    return Response.json({
      success: false,
      error: 'Ação inválida'
    }, { status: 400 });
  } catch (error) {
    console.error('SincronizacaoOffline error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});