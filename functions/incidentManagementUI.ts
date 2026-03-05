/**
 * Incident Management UI Backend
 * Sistema de gerenciamento de incidentes pós-release (Sprint 36)
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class IncidentManager {
  constructor() {
    this.incidents = [];
    this.on_call_schedules = new Map();
    this.escalation_policies = [];
  }

  criarIncidente(titulo, severidade, impacto_usuarios, descricao) {
    const incidente = {
      id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      titulo,
      severidade, // critical, high, medium, low
      impacto_usuarios,
      descricao,
      status: 'open',
      criada_em: new Date().toISOString(),
      atualizada_em: new Date().toISOString(),
      resolvida_em: null,
      duracao_minutos: 0,
      timeline: []
    };

    this.incidents.push(incidente);
    
    // Auto-escalate se crítico
    if (severidade === 'critical') {
      this.escalar(incidente.id);
    }

    return incidente;
  }

  adicionarAtualizacao(incident_id, mensagem, tipo = 'update') {
    const incidente = this.incidents.find(i => i.id === incident_id);
    if (incidente) {
      incidente.timeline.push({
        timestamp: new Date().toISOString(),
        tipo,
        mensagem
      });
      incidente.atualizada_em = new Date().toISOString();
    }
    return incidente;
  }

  escalar(incident_id) {
    const incidente = this.incidents.find(i => i.id === incident_id);
    if (incidente) {
      this.adicionarAtualizacao(incident_id, 'Escalated to on-call team', 'escalation');
      return {
        escalado: true,
        notificacoes_enviadas: true,
        on_call: 'primary-engineer'
      };
    }
    return null;
  }

  resolverIncidente(incident_id, resolucao) {
    const incidente = this.incidents.find(i => i.id === incident_id);
    if (incidente) {
      incidente.status = 'resolved';
      incidente.resolvida_em = new Date().toISOString();
      incidente.duracao_minutos = Math.floor(
        (new Date(incidente.resolvida_em) - new Date(incidente.criada_em)) / 60000
      );
      this.adicionarAtualizacao(incident_id, `Resolved: ${resolucao}`, 'resolution');
    }
    return incidente;
  }

  obterIncidentesAtivos() {
    return this.incidents.filter(i => i.status === 'open' || i.status === 'investigating');
  }

  obterRelatorioIncidentes(dias = 7) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    const incidentes = this.incidents.filter(
      i => new Date(i.criada_em) > dataLimite
    );

    const porSeveridade = { critical: 0, high: 0, medium: 0, low: 0 };
    const porStatus = { open: 0, investigating: 0, resolved: 0 };

    incidentes.forEach(i => {
      porSeveridade[i.severidade]++;
      porStatus[i.status]++;
    });

    const tempoMedioResolucao = incidentes
      .filter(i => i.resolvida_em)
      .reduce((sum, i) => sum + i.duracao_minutos, 0) / 
      Math.max(incidentes.filter(i => i.resolvida_em).length, 1);

    return {
      periodo_dias: dias,
      total_incidentes: incidentes.length,
      por_severidade: porSeveridade,
      por_status: porStatus,
      tempo_medio_resolucao_minutos: Math.round(tempoMedioResolucao),
      mttr_criticos: incidentes
        .filter(i => i.severidade === 'critical' && i.resolvida_em)
        .map(i => i.duracao_minutos)
    };
  }

  registrarOnCallSchedule(engenheiro_id, inicio, fim, escala) {
    const schedule = {
      id: `oncall_${Date.now()}`,
      engenheiro_id,
      inicio,
      fim,
      escala,
      criada_em: new Date().toISOString()
    };

    this.on_call_schedules.set(schedule.id, schedule);
    return schedule;
  }
}

const incidentManager = new IncidentManager();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, titulo, severidade, impacto_usuarios, descricao, incident_id, mensagem, tipo, resolucao, dias, engenheiro_id, inicio, fim, escala } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (operacao) {
      case 'criar_incidente':
        if (!titulo || !severidade) {
          return Response.json({ error: 'titulo e severidade são obrigatórios' }, { status: 400 });
        }
        resultado = incidentManager.criarIncidente(titulo, severidade, impacto_usuarios, descricao);
        break;

      case 'adicionar_atualizacao':
        if (!incident_id || !mensagem) {
          return Response.json({ error: 'incident_id e mensagem são obrigatórios' }, { status: 400 });
        }
        resultado = incidentManager.adicionarAtualizacao(incident_id, mensagem, tipo);
        break;

      case 'resolver':
        if (!incident_id || !resolucao) {
          return Response.json({ error: 'incident_id e resolucao são obrigatórios' }, { status: 400 });
        }
        resultado = incidentManager.resolverIncidente(incident_id, resolucao);
        break;

      case 'ativos':
        resultado = incidentManager.obterIncidentesAtivos();
        break;

      case 'relatorio':
        resultado = incidentManager.obterRelatorioIncidentes(dias || 7);
        break;

      case 'registrar_oncall':
        if (!engenheiro_id || !inicio || !fim) {
          return Response.json({ error: 'engenheiro_id, inicio e fim são obrigatórios' }, { status: 400 });
        }
        resultado = incidentManager.registrarOnCallSchedule(engenheiro_id, inicio, fim, escala);
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[incidentManagementUI] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});