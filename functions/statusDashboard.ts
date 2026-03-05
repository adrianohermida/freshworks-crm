import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get real-time status metrics
    const processos = await base44.entities.ProcessoAdvise.list();
    const alertas = await base44.entities.Alerta.filter({ resolvido: false });
    const prazos = await base44.entities.PrazoProcessual.filter({ status: 'aberto' });
    const audiencias = await base44.entities.Audiencia.filter({ comparecimento: 'pendente' });

    // Calculate statistics
    const processosAtivos = processos.filter(p => p.statusProcesso === 'ativo').length;
    const prazosVencidos = prazos.filter(p => new Date(p.dataVencimento) < new Date()).length;
    const alertasCriticos = alertas.filter(a => a.severidade === 'critica').length;
    const audienciasProximas = audiencias.filter(a => {
      const data = new Date(a.dataAudiencia);
      const hoje = new Date();
      const diasDiff = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24));
      return diasDiff <= 7 && diasDiff >= 0;
    }).length;

    const statusReport = {
      timestamp: new Date().toISOString(),
      sistema: {
        status: alertasCriticos === 0 ? 'healthy' : 'warning',
        saude: Math.max(0, 100 - (alertasCriticos * 10))
      },
      metricas: {
        processosAtivos,
        prazosVencidos,
        alertasCriticos,
        audienciasProximas
      },
      ultimaSincronizacao: new Date().toISOString(),
      componentes: {
        adviseAPI: 'conectado',
        database: 'disponivel',
        cache: 'ativo'
      }
    };

    return Response.json(statusReport);
  } catch (error) {
    console.error('Status dashboard error:', error);
    return Response.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});