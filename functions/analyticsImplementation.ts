/**
 * Analytics Implementation - Sprint 36
 * Sistema de analytics para rastreamento de uso e otimização de features
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class AnalyticsEngine {
  constructor() {
    this.events = [];
    this.users = new Map();
    this.sessions = new Map();
  }

  rastrearEvento(usuario_id, evento_tipo, propriedades = {}) {
    const evento = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      usuario_id,
      tipo: evento_tipo,
      propriedades,
      timestamp: new Date().toISOString()
    };

    this.events.push(evento);

    // Manter últimos 100k eventos
    if (this.events.length > 100000) {
      this.events.shift();
    }

    return evento;
  }

  registrarSessao(usuario_id, dados_sessao) {
    const sessao_id = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const sessao = {
      id: sessao_id,
      usuario_id,
      inicio: new Date().toISOString(),
      fim: null,
      duracao_segundos: 0,
      paginas_visitadas: [],
      eventos_count: 0,
      ...dados_sessao
    };

    this.sessions.set(sessao_id, sessao);
    return sessao;
  }

  finalizarSessao(sessao_id) {
    const sessao = this.sessions.get(sessao_id);
    if (sessao) {
      sessao.fim = new Date().toISOString();
      sessao.duracao_segundos = Math.floor(
        (new Date(sessao.fim) - new Date(sessao.inicio)) / 1000
      );
    }
    return sessao;
  }

  calcularMetricasCohorte(data_inicio, data_fim) {
    const eventsNoIntervalo = this.events.filter(e => {
      const eTime = new Date(e.timestamp);
      return eTime >= new Date(data_inicio) && eTime <= new Date(data_fim);
    });

    const usuariosUnicos = new Set(eventsNoIntervalo.map(e => e.usuario_id)).size;
    const totalEventos = eventsNoIntervalo.length;

    return {
      periodo_inicio: data_inicio,
      periodo_fim: data_fim,
      usuarios_unicos: usuariosUnicos,
      total_eventos: totalEventos,
      media_eventos_por_usuario: Math.round(totalEventos / Math.max(usuariosUnicos, 1)),
      tipos_eventos: [...new Set(eventsNoIntervalo.map(e => e.tipo))]
    };
  }

  calcularRetencao(dias = 7) {
    const retencaoMap = new Map();

    // Agrupar usuários por dia de primeiro evento
    for (const evento of this.events) {
      const data = evento.timestamp.split('T')[0];
      if (!retencaoMap.has(data)) {
        retencaoMap.set(data, new Set());
      }
      retencaoMap.get(data).add(evento.usuario_id);
    }

    const datasOrdenadas = Array.from(retencaoMap.keys()).sort();

    const retencao = [];
    for (let i = 0; i < Math.min(datasOrdenadas.length, dias); i++) {
      const dataAtual = datasOrdenadas[i];
      const usuariosOriginais = retencaoMap.get(dataAtual);
      
      let retidos = 0;
      for (let j = i + 1; j <= i + 7 && j < datasOrdenadas.length; j++) {
        const usuariosDia = retencaoMap.get(datasOrdenadas[j]);
        retidos = usuariosDia.size; // Simplificação
      }

      retencao.push({
        data: dataAtual,
        usuarios_originais: usuariosOriginais.size,
        taxa_retencao: usuariosOriginais.size > 0 ? 
          Math.round((retidos / usuariosOriginais.size) * 100) : 0
      });
    }

    return retencao;
  }

  obterFunelAnalise(etapas_funnel) {
    const resultado = {
      total_usuarios: new Set(this.events.map(e => e.usuario_id)).size,
      etapas: []
    };

    for (const etapa of etapas_funnel) {
      const usuariosNaEtapa = new Set(
        this.events
          .filter(e => e.tipo === etapa)
          .map(e => e.usuario_id)
      );

      resultado.etapas.push({
        etapa,
        usuarios: usuariosNaEtapa.size,
        taxa_conversao: resultado.total_usuarios > 0 ?
          Math.round((usuariosNaEtapa.size / resultado.total_usuarios) * 100) : 0
      });
    }

    return resultado;
  }

  obterFeatureAdoption(feature_names) {
    const adoption = {};

    for (const feature of feature_names) {
      const usuariosQueusamFeature = new Set(
        this.events
          .filter(e => e.propriedades.feature === feature)
          .map(e => e.usuario_id)
      );

      adoption[feature] = {
        usuarios_usando: usuariosQueusamFeature.size,
        taxa_adocao: this.events.length > 0 ?
          Math.round((usuariosQueusamFeature.size / new Set(this.events.map(e => e.usuario_id)).size) * 100) : 0
      };
    }

    return adoption;
  }
}

const analyticsEngine = new AnalyticsEngine();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, usuario_id, evento_tipo, propriedades, sessao_id, data_inicio, data_fim, dias, etapas_funnel, feature_names } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (operacao) {
      case 'rastrear_evento':
        if (!usuario_id || !evento_tipo) {
          return Response.json({ error: 'usuario_id e evento_tipo são obrigatórios' }, { status: 400 });
        }
        resultado = analyticsEngine.rastrearEvento(usuario_id, evento_tipo, propriedades);
        break;

      case 'registrar_sessao':
        if (!usuario_id) {
          return Response.json({ error: 'usuario_id é obrigatório' }, { status: 400 });
        }
        resultado = analyticsEngine.registrarSessao(usuario_id, {});
        break;

      case 'finalizar_sessao':
        if (!sessao_id) {
          return Response.json({ error: 'sessao_id é obrigatório' }, { status: 400 });
        }
        resultado = analyticsEngine.finalizarSessao(sessao_id);
        break;

      case 'metricas_cohorte':
        if (!data_inicio || !data_fim) {
          return Response.json({ error: 'data_inicio e data_fim são obrigatórios' }, { status: 400 });
        }
        resultado = analyticsEngine.calcularMetricasCohorte(data_inicio, data_fim);
        break;

      case 'retencao':
        resultado = analyticsEngine.calcularRetencao(dias || 7);
        break;

      case 'funnel_analise':
        if (!etapas_funnel) {
          return Response.json({ error: 'etapas_funnel é obrigatório' }, { status: 400 });
        }
        resultado = analyticsEngine.obterFunelAnalise(etapas_funnel);
        break;

      case 'feature_adoption':
        if (!feature_names) {
          return Response.json({ error: 'feature_names é obrigatório' }, { status: 400 });
        }
        resultado = analyticsEngine.obterFeatureAdoption(feature_names);
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[analyticsImplementation] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});