/**
 * validarConsentimento.js - Validação de consentimento LGPD
 * 
 * Valida que o usuário consentiu com processamento de dados pessoais
 * antes de permitir operações sensíveis (sync, export, etc)
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Validar consentimento do usuário para operação específica
 * 
 * @param {string} userId - ID do usuário (email)
 * @param {string} operacao - Tipo de operação (sync, export, import, delete)
 * @param {object} base44 - Cliente Base44
 * @returns {Promise<{consentido: boolean, motivo?: string}>}
 */
export async function validarConsentimento(userId, operacao, base44) {
  try {
    // Fetch user data
    const user = await base44.entities.User.list();
    const currentUser = user.find(u => u.email === userId);

    if (!currentUser) {
      return {
        consentido: false,
        motivo: 'Usuário não encontrado',
      };
    }

    // Verificar campos de consentimento
    const consentimentoGeral = currentUser.consentimento_lgpd || false;
    const consentimentoProcessamento = currentUser.consentimento_processamento_dados || false;
    const consentimentoExportacao = currentUser.consentimento_exportacao_dados || false;

    // Validar por tipo de operação
    let consentido = false;
    let motivo = '';

    switch (operacao.toLowerCase()) {
      case 'sync':
      case 'import':
        consentido = consentimentoGeral && consentimentoProcessamento;
        if (!consentido) {
          motivo = 'Consentimento para processamento de dados não encontrado';
        }
        break;

      case 'export':
        consentido = consentimentoGeral && consentimentoExportacao;
        if (!consentido) {
          motivo = 'Consentimento para exportação de dados não encontrado';
        }
        break;

      case 'delete':
        // Delete não precisa de consentimento prévio (é direito LGPD)
        consentido = true;
        break;

      default:
        consentido = consentimentoGeral;
        motivo = 'Operação desconhecida — requer consentimento geral';
    }

    return {
      consentido,
      motivo: motivo || undefined,
      timestamp: new Date().toISOString(),
      operacao,
      usuario: userId,
    };
  } catch (error) {
    return {
      consentido: false,
      motivo: `Erro ao validar consentimento: ${error.message}`,
    };
  }
}

/**
 * Hook para usar em página React — valida consentimento antes de operação
 * 
 * @param {string} operacao - Tipo de operação
 * @returns {Promise<boolean>} true se consentimento validado
 */
export async function useLGPDConsent(operacao, base44, user) {
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const resultado = await validarConsentimento(user.email, operacao, base44);

  if (!resultado.consentido) {
    throw new Error(`CONSENT_REQUIRED: ${resultado.motivo || 'Consentimento não encontrado'}`);
  }

  return true;
}

/**
 * Middleware para validar consentimento em função backend
 */
export async function middlewareConsentimento(req, operacao) {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (!user) {
    return { permitido: false, erro: 'Não autenticado' };
  }

  const validacao = await validarConsentimento(user.email, operacao, base44);

  return {
    permitido: validacao.consentido,
    erro: validacao.motivo,
  };
}

export default validarConsentimento;