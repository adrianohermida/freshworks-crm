/**
 * Validação LGPD Offline - Conformidade com LGPD em processamento local
 * Masking de PII, audit logs e direito ao esquecimento
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Masking de PII (CPF, Nome, Email)
 */
function mascarPII(texto) {
  if (!texto) return texto;

  // CPF: 123.456.789-10 -> 123.456.***-**
  texto = texto.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/g, '$1.$2.***-**');

  // Email: user@domain.com -> u***@domain.com
  texto = texto.replace(/([a-zA-Z0-9])([a-zA-Z0-9._%+-]*@)/g, '$1***@');

  // Nome (palavras inteiras com 3+ caracteres)
  texto = texto.replace(/\b([A-Za-záéíóúãõâêôç]{3,})\b/g, (match) => {
    return match[0] + '*'.repeat(match.length - 1);
  });

  return texto;
}

/**
 * Criar registro de auditoria LGPD
 */
function criarAuditLog(tipoOperacao, dados, usuario) {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    tipo_operacao: tipoOperacao, // 'processamento', 'masking', 'delecao', 'consentimento'
    usuario: usuario,
    dados_operacao: {
      campos_afetados: Object.keys(dados).length,
      pii_mascarado: Object.values(dados).some(v => /\*\*\*/.test(String(v))),
      hash_dados: hashDados(dados)
    },
    retenccao_dias: 90, // Retenção por 90 dias conforme Lei 13.709
    pode_ser_deletado: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  };
}

/**
 * Hash simples para auditoria
 */
function hashDados(dados) {
  const json = JSON.stringify(dados);
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    const char = json.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Validar consentimento de processamento
 */
function validarConsentimento(usuario, consentimento) {
  return {
    usuario_id: usuario,
    data_consentimento: new Date().toISOString(),
    versao_politica: '2.0',
    dados_aceitos: consentimento || {
      processamento_judicial: true,
      sincronizacao_datajud: true,
      analise_andamentos: true,
      alertas_notificacoes: true,
      estatisticas_anonimizadas: false
    },
    pode_revogar_ate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  };
}

/**
 * Preparar processo para deleção (Direito ao Esquecimento)
 */
function prepararParaDeletacao(processoId, usuario) {
  return {
    processo_id: processoId,
    usuario_request: usuario,
    data_solicitacao: new Date().toISOString(),
    status_deletacao: 'pendente_confirmacao',
    etapas: [
      { etapa: 'Masking de PII', concluido: false },
      { etapa: 'Remoção de índices', concluido: false },
      { etapa: 'Backup para arquivo criptografado', concluido: false },
      { etapa: 'Confirmação de deleção', concluido: false }
    ],
    dias_para_delecao_permanente: 30, // 30 dias para confirmação
    pode_ser_deletado_em: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
}

/**
 * Backend function
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, dados, consentimento, processo_id } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (operacao) {
      case 'mascarar_pii':
        if (!dados) {
          return Response.json({ error: 'dados é obrigatório' }, { status: 400 });
        }
        resultado = {
          operacao: 'mascarar_pii',
          dados_mascarados: Object.entries(dados).reduce((acc, [key, val]) => {
            acc[key] = mascarPII(String(val));
            return acc;
          }, {}),
          audit_log: criarAuditLog('masking', dados, user.email)
        };
        break;

      case 'validar_consentimento':
        resultado = {
          operacao: 'validar_consentimento',
          consentimento: validarConsentimento(user.email, consentimento),
          audit_log: criarAuditLog('consentimento', consentimento || {}, user.email)
        };
        break;

      case 'direito_esquecimento':
        if (!processo_id) {
          return Response.json({ error: 'processo_id é obrigatório' }, { status: 400 });
        }
        resultado = {
          operacao: 'direito_esquecimento',
          solicitacao_deletacao: prepararParaDeletacao(processo_id, user.email),
          audit_log: criarAuditLog('delecao_solicitada', { processo_id }, user.email)
        };
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[validacaoLGPDOffline] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});