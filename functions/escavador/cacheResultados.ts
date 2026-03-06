import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, chave, dados, ttl = 3600 } = await req.json();

    if (!acao || !chave) {
      return Response.json({
        success: false,
        error: 'acao e chave são obrigatórios'
      }, { status: 400 });
    }

    // Simple cache implementation using local entity
    const cacheData = {
      chave,
      dados,
      dataCriacao: new Date().toISOString(),
      dataExpiracao: new Date(Date.now() + ttl * 1000).toISOString(),
      ttl,
      tipo: 'escavador'
    };

    if (acao === 'set') {
      // Store cache
      try {
        const existing = await base44.entities.Cache?.filter({ chave });
        
        if (existing && existing.length > 0) {
          await base44.entities.Cache.update(existing[0].id, cacheData);
        } else {
          await base44.entities.Cache?.create(cacheData);
        }
      } catch (e) {
        console.log('Cache entity not available, skipping storage');
      }

      return Response.json({
        success: true,
        action: 'cache.set',
        data: {
          chave,
          ttl,
          dataExpiracao: cacheData.dataExpiracao,
          message: `Cache definido para chave: ${chave}`
        }
      });
    } else if (acao === 'get') {
      // Retrieve cache
      try {
        const cached = await base44.entities.Cache?.filter({ chave });
        
        if (cached && cached.length > 0) {
          const item = cached[0];
          const agora = new Date();
          const expiracao = new Date(item.dataExpiracao);

          if (agora < expiracao) {
            return Response.json({
              success: true,
              action: 'cache.get',
              data: {
                chave,
                dados: item.dados,
                dataCriacao: item.dataCriacao,
                dataExpiracao: item.dataExpiracao,
                valido: true,
                message: 'Cache recuperado com sucesso'
              }
            });
          } else {
            // Cache expirado
            await base44.entities.Cache.delete(item.id);
            return Response.json({
              success: false,
              error: 'Cache expirado',
              data: { chave }
            }, { status: 404 });
          }
        }
        return Response.json({
          success: false,
          error: 'Cache não encontrado',
          data: { chave }
        }, { status: 404 });
      } catch (e) {
        return Response.json({
          success: false,
          error: 'Cache not available'
        }, { status: 500 });
      }
    } else if (acao === 'delete') {
      try {
        const cached = await base44.entities.Cache?.filter({ chave });
        if (cached && cached.length > 0) {
          await base44.entities.Cache.delete(cached[0].id);
        }
        return Response.json({
          success: true,
          action: 'cache.delete',
          data: { chave, message: `Cache deletado: ${chave}` }
        });
      } catch (e) {
        return Response.json({
          success: false,
          error: 'Failed to delete cache'
        }, { status: 500 });
      }
    }

    return Response.json({
      success: false,
      error: 'Invalid action. Use: set, get, or delete'
    }, { status: 400 });
  } catch (error) {
    console.error('CacheResultados error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});