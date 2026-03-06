import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin users can delete searches
    if (user.role !== 'admin') {
      return Response.json({
        success: false,
        error: 'Forbidden: Admin access required'
      }, { status: 403 });
    }

    const { numerosProcesso = [], dataInicio, dataFim, confirma = false } = await req.json();

    if (!numerosProcesso || numerosProcesso.length === 0) {
      return Response.json({
        success: false,
        error: 'numerosProcesso é obrigatório (array)'
      }, { status: 400 });
    }

    if (!confirma) {
      return Response.json({
        success: false,
        error: 'Confirmação necessária: confirma=true',
        warning: `Você está prestes a deletar ${numerosProcesso.length} processos. Esta ação é irreversível.`
      }, { status: 400 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = 'https://api.advise.com.br';

    // Delete on Advise API
    const response = await fetch(`${adviseUrl}/core/v1/excluir-pesquisas-por-processos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numerosProcesso,
        dataInicio,
        dataFim,
        confirma: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Advise API error: ${error.message || 'Failed to delete'}`
      }, { status: response.status });
    }

    const deleteData = await response.json();

    // Delete from local database
    let deletedCount = 0;
    for (const numero of numerosProcesso) {
      const processos = await base44.entities.ProcessoAdvise.filter({
        numeroProcesso: numero
      });

      if (processos && processos.length > 0) {
        for (const proc of processos) {
          await base44.entities.ProcessoAdvise.delete(proc.id);
          deletedCount++;
        }
      }
    }

    // Audit log - CRITICAL
    await base44.functions.invoke('security/auditLog', {
      acao: 'excluirPesquisasProcessos',
      entidade: 'ProcessoAdvise',
      resultado: 'success',
      metadados: {
        processosCount: numerosProcesso.length,
        deletedLocalCount: deletedCount,
        usuarioAdmin: user.email,
        timestamp: new Date().toISOString()
      }
    });

    return Response.json({
      success: true,
      action: 'processos.excluir',
      data: {
        processosEnviados: numerosProcesso.length,
        processosDeleted: deletedCount,
        dataSincronizacao: new Date().toISOString(),
        message: `${deletedCount} processos excluídos do banco de dados local e Advise API`
      }
    });
  } catch (error) {
    console.error('ExcluirPesquisasProcessos error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});