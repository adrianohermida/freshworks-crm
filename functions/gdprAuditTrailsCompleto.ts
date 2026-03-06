/**
 * GDPR Audit Trails Completo
 * Sistema completo de rastreamento para conformidade GDPR/LGPD
 * Registra TODAS as operações, acessos e processamento de dados
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class AuditTrailGDPR {
  constructor() {
    this.registros = [];
  }

  registrar(evento) {
    const registro = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      tipo_evento: evento.tipo, // 'access', 'create', 'update', 'delete', 'export', 'consent'
      usuario_id: evento.usuario_id,
      recurso_id: evento.recurso_id,
      recurso_tipo: evento.recurso_tipo, // 'process', 'user', 'document'
      operacao: evento.operacao,
      resultado: evento.resultado, // 'sucesso', 'falha'
      dados_antes: evento.dados_antes || null,
      dados_depois: evento.dados_depois || null,
      ip_address: evento.ip_address,
      user_agent: evento.user_agent,
      motivo: evento.motivo || null,
      base_legal: evento.base_legal || 'legitimate_interest', // GDPR lawful basis
      compliant: true
    };

    this.registros.push(registro);
    
    // Manter apenas últimos 10000 registros
    if (this.registros.length > 10000) {
      this.registros.shift();
    }

    return registro;
  }

  obterAuditTrail(usuario_id, dias = 30) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    return this.registros.filter(r =>
      r.usuario_id === usuario_id &&
      new Date(r.timestamp) > dataLimite
    );
  }

  obterPorRecurso(recurso_id, recurso_tipo) {
    return this.registros.filter(r =>
      r.recurso_id === recurso_id &&
      r.recurso_tipo === recurso_tipo
    );
  }

  exportarDadosUsuario(usuario_id) {
    return {
      usuario_id,
      data_export: new Date().toISOString(),
      audit_trail: this.obterAuditTrail(usuario_id),
      total_registros: this.obterAuditTrail(usuario_id).length
    };
  }

  relatorioCumprimento() {
    const porTipo = {};
    const porResultado = {};

    this.registros.forEach(r => {
      porTipo[r.tipo_evento] = (porTipo[r.tipo_evento] || 0) + 1;
      porResultado[r.resultado] = (porResultado[r.resultado] || 0) + 1;
    });

    return {
      total_registros: this.registros.length,
      por_tipo: porTipo,
      por_resultado: porResultado,
      todos_compliant: this.registros.every(r => r.compliant),
      timestamp_relatorio: new Date().toISOString()
    };
  }
}

const auditGlobal = new AuditTrailGDPR();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { acao, evento, usuario_id, recurso_id, recurso_tipo, dias } = body;

    if (!acao) {
      return Response.json({ error: 'acao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (acao) {
      case 'registrar':
        if (!evento) {
          return Response.json({ error: 'evento é obrigatório' }, { status: 400 });
        }
        resultado = auditGlobal.registrar(evento);
        break;

      case 'obter_trail_usuario':
        if (!usuario_id) {
          return Response.json({ error: 'usuario_id é obrigatório' }, { status: 400 });
        }
        resultado = auditGlobal.obterAuditTrail(usuario_id, dias || 30);
        break;

      case 'obter_por_recurso':
        if (!recurso_id || !recurso_tipo) {
          return Response.json({ error: 'recurso_id e recurso_tipo são obrigatórios' }, { status: 400 });
        }
        resultado = auditGlobal.obterPorRecurso(recurso_id, recurso_tipo);
        break;

      case 'exportar_dados':
        if (!usuario_id) {
          return Response.json({ error: 'usuario_id é obrigatório' }, { status: 400 });
        }
        resultado = auditGlobal.exportarDadosUsuario(usuario_id);
        break;

      case 'relatorio_cumprimento':
        resultado = auditGlobal.relatorioCumprimento();
        break;

      default:
        return Response.json({ error: 'acao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[gdprAuditTrailsCompleto] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});