import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin users can view reports
    if (user.role !== 'admin') {
      return Response.json({
        success: false,
        error: 'Forbidden: Admin access required'
      }, { status: 403 });
    }

    const { dataInicio, dataFim, tipo = 'completo' } = await req.json();

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = 'https://api.advise.com.br';

    // Fetch reports from Advise API
    const response = await fetch(`${adviseUrl}/core/v1/relatorios/uso`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dataInicio,
        dataFim,
        tipo
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Advise API error: ${error.message || 'Failed to fetch reports'}`
      }, { status: response.status });
    }

    const relatorios = await response.json();

    // Process report data
    const reportProcessed = {
      periodo: { dataInicio, dataFim },
      requisicoes: relatorios.requisicoes || 0,
      processosConsultados: relatorios.processosConsultados || 0,
      publicacoesConsultadas: relatorios.publicacoesConsultadas || 0,
      intimacoesConsultadas: relatorios.intimacoesConsultadas || 0,
      anexosDownload: relatorios.anexosDownload || 0,
      usuariosAtivos: relatorios.usuariosAtivos || 0,
      tempoMedioRequisicao: relatorios.tempoMedioRequisicao || 0,
      taxaErro: relatorios.taxaErro || 0,
      dataGeracao: new Date().toISOString()
    };

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'getRelatoriosUso',
      entidade: 'Relatorios',
      resultado: 'success',
      metadados: { tipo, periodo: reportProcessed.periodo }
    });

    return Response.json({
      success: true,
      action: 'relatorios.uso',
      data: reportProcessed
    });
  } catch (error) {
    console.error('GetRelatoriosUso error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});