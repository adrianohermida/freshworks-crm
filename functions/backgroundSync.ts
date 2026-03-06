import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Sincronismo em Background - PWA Offline
 * Sincroniza dados pendentes quando app volta online
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { tipo, force = false } = await req.json();
    const resultado = {};

    // Sincronizar Advise
    if (!tipo || tipo === 'advise') {
      const adviseRes = await base44.functions.invoke('adviseIntegration', {
        action: 'intimacoes.consultar',
        payload: { lido: false, registrosPorPagina: 50 }
      });
      resultado.advise = {
        sucesso: adviseRes.data.success,
        sincronizados: adviseRes.data.data?.intimacoes?.length || 0
      };
    }

    // Sincronizar Freshdesk
    if (!tipo || tipo === 'freshdesk') {
      const freshdeskRes = await base44.functions.invoke('freshdesk', {
        action: 'sincronizar'
      });
      resultado.freshdesk = {
        sucesso: freshdeskRes.data.success,
        sincronizados: freshdeskRes.data.data?.sincronizados || 0
      };
    }

    // Registrar última sincronização
    const config = await base44.asServiceRole.entities.AdviseConfig.list(1, 1);
    if (config.length > 0) {
      await base44.asServiceRole.entities.AdviseConfig.update(config[0].id, {
        ultimaSincronizacao: new Date().toISOString()
      });
    }

    return Response.json({
      success: true,
      resultado,
      timestamp: new Date().toISOString(),
      message: 'Sincronismo em background concluído'
    });

  } catch (error) {
    console.error('Erro sincronismo background:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});