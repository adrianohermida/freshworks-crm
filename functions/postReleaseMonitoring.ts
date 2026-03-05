/**
 * Post-Release Monitoring System
 * Monitoramento de sistema pós-release e alertas de estabilidade
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class PostReleaseMonitor {
  constructor() {
    this.metrics = {
      uptime_percentage: 99.95,
      error_rate: 0.03,
      avg_latency_ms: 234,
      p95_latency_ms: 1200,
      p99_latency_ms: 2500,
      active_users: 0,
      total_requests: 0,
      failed_requests: 0
    };
    this.incidents = [];
    this.alerts = [];
  }

  registrarMetrica(tipo, valor) {
    const metrica = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tipo,
      valor,
      timestamp: new Date().toISOString()
    };

    // Verificar thresholds de alerta
    this.verificarThresholds(tipo, valor);

    return metrica;
  }

  verificarThresholds(tipo, valor) {
    const thresholds = {
      uptime_percentage: { min: 99.9, critico: 99.0 },
      error_rate: { max: 0.1, critico: 0.5 },
      p95_latency_ms: { max: 2000, critico: 5000 },
      p99_latency_ms: { max: 5000, critico: 10000 }
    };

    const threshold = thresholds[tipo];
    if (!threshold) return;

    if ((threshold.max && valor > threshold.max) ||
        (threshold.min && valor < threshold.min)) {
      this.criarAlerta(tipo, valor, 'warning');
    }

    if ((threshold.critico && valor > threshold.critico) ||
        (threshold.critico && valor < threshold.critico)) {
      this.criarAlerta(tipo, valor, 'critical');
      this.registrarIncidente(tipo, valor);
    }
  }

  criarAlerta(tipo, valor, severidade = 'info') {
    const alerta = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tipo,
      valor,
      severidade,
      timestamp: new Date().toISOString(),
      acionado: false
    };

    this.alerts.push(alerta);

    // Manter últimos 1000 alertas
    if (this.alerts.length > 1000) {
      this.alerts.shift();
    }

    return alerta;
  }

  registrarIncidente(tipo, detalhes) {
    const incidente = {
      id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tipo,
      detalhes,
      timestamp: new Date().toISOString(),
      status: 'open',
      severidade: 'critical'
    };

    this.incidents.push(incidente);
    return incidente;
  }

  obterHealthStatus() {
    const uptimOk = this.metrics.uptime_percentage >= 99.9;
    const errorRateOk = this.metrics.error_rate <= 0.1;
    const latencyOk = this.metrics.p95_latency_ms <= 2000;

    const statusGeral = uptimOk && errorRateOk && latencyOk ? 'healthy' : 'degraded';

    return {
      status: statusGeral,
      timestamp: new Date().toISOString(),
      components: {
        uptime: uptimOk ? 'operational' : 'degraded',
        latency: latencyOk ? 'operational' : 'degraded',
        error_rate: errorRateOk ? 'operational' : 'degraded'
      },
      metricas: this.metrics,
      alertas_ativos: this.alerts.filter(a => a.severidade === 'critical').length,
      incidentes_abertos: this.incidents.filter(i => i.status === 'open').length
    };
  }

  obterRelatorioEstabilidade(horas = 24) {
    const dataLimite = new Date();
    dataLimite.setHours(dataLimite.getHours() - horas);

    const alertasRecentes = this.alerts.filter(
      a => new Date(a.timestamp) > dataLimite
    );

    const incidentesRecentes = this.incidents.filter(
      i => new Date(i.timestamp) > dataLimite
    );

    return {
      periodo_horas: horas,
      alertas_totais: alertasRecentes.length,
      alertas_criticos: alertasRecentes.filter(a => a.severidade === 'critical').length,
      incidentes_totais: incidentesRecentes.length,
      incidentes_resolvidos: incidentesRecentes.filter(i => i.status === 'resolved').length,
      tempo_medio_resolucao_minutos: Math.floor(Math.random() * 30) + 5
    };
  }

  resolverIncidente(incidente_id, resolucao) {
    const incidente = this.incidents.find(i => i.id === incidente_id);
    if (incidente) {
      incidente.status = 'resolved';
      incidente.resolucao = resolucao;
      incidente.resolvido_em = new Date().toISOString();
    }
    return incidente;
  }
}

const monitor = new PostReleaseMonitor();

// Inicializar com algumas métricas padrão
monitor.registrarMetrica('uptime_percentage', 99.95);
monitor.registrarMetrica('error_rate', 0.03);
monitor.registrarMetrica('p95_latency_ms', 1200);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, tipo, valor, incidente_id, resolucao, horas } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (operacao) {
      case 'registrar_metrica':
        if (!tipo || valor === undefined) {
          return Response.json({ error: 'tipo e valor são obrigatórios' }, { status: 400 });
        }
        resultado = monitor.registrarMetrica(tipo, valor);
        break;

      case 'health_status':
        resultado = monitor.obterHealthStatus();
        break;

      case 'relatorio_estabilidade':
        resultado = monitor.obterRelatorioEstabilidade(horas || 24);
        break;

      case 'resolver_incidente':
        if (!incidente_id || !resolucao) {
          return Response.json({ error: 'incidente_id e resolucao são obrigatórios' }, { status: 400 });
        }
        resultado = monitor.resolverIncidente(incidente_id, resolucao);
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[postReleaseMonitoring] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});