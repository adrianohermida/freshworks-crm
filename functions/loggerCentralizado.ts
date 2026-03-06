/**
 * Logger Centralizado - Logging estruturado para toda a aplicação
 * Rastreia pipeline, erros, performance e compliance
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class LoggerCentralizado {
  constructor(contexto = {}) {
    this.contexto = contexto;
    this.logs = [];
  }

  log(nivel, mensagem, dados = {}) {
    const registro = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      nivel, // 'INFO', 'WARN', 'ERROR', 'DEBUG'
      mensagem,
      dados,
      contexto: this.contexto,
      thread: 'main'
    };

    this.logs.push(registro);
    
    // Manter apenas últimos 1000 logs em memória
    if (this.logs.length > 1000) {
      this.logs.shift();
    }

    return registro;
  }

  info(mensagem, dados) {
    return this.log('INFO', mensagem, dados);
  }

  warn(mensagem, dados) {
    return this.log('WARN', mensagem, dados);
  }

  error(mensagem, dados) {
    return this.log('ERROR', mensagem, dados);
  }

  debug(mensagem, dados) {
    return this.log('DEBUG', mensagem, dados);
  }

  filtrar(nivel) {
    return this.logs.filter(log => log.nivel === nivel);
  }

  exportar() {
    return {
      total_logs: this.logs.length,
      por_nivel: {
        INFO: this.filtrar('INFO').length,
        WARN: this.filtrar('WARN').length,
        ERROR: this.filtrar('ERROR').length,
        DEBUG: this.filtrar('DEBUG').length
      },
      logs: this.logs,
      contexto: this.contexto,
      exportado_em: new Date().toISOString()
    };
  }

  limpar() {
    const quantidade = this.logs.length;
    this.logs = [];
    return { logs_removidos: quantidade, timestamp: new Date().toISOString() };
  }
}

// Instância global do logger
const loggerGlobal = new LoggerCentralizado();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { acao, nivel, mensagem, dados, contexto } = body;

    if (!acao) {
      return Response.json({ error: 'acao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (acao) {
      case 'log':
        loggerGlobal.contexto = { ...loggerGlobal.contexto, usuario: user.email, ...contexto };
        resultado = loggerGlobal.log(nivel || 'INFO', mensagem, dados);
        break;

      case 'exportar':
        resultado = loggerGlobal.exportar();
        break;

      case 'filtrar':
        resultado = {
          nivel: nivel || 'INFO',
          logs: loggerGlobal.filtrar(nivel || 'INFO')
        };
        break;

      case 'limpar':
        resultado = loggerGlobal.limpar();
        break;

      default:
        return Response.json({ error: 'acao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[loggerCentralizado] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});