/**
 * Biblioteca de mensagens de erro do Autentique
 * Traduz e formata erros da API para mensagens amigáveis
 */

const ERROR_MESSAGES = {
  "unauthorized": "Você não está mais autenticado",
  "document_not_found": "Documento não encontrado",
  "folder_not_found": "Pasta não encontrada",
  "document_signed": "O documento já foi assinado",
  "not_your_turn": "Não é a sua vez de assinar o documento",
  "must_be_a_string": "É somente permitido texto",
  "must_be_an_array": "Não é uma lista",
  "not_a_valid_date": "Não é uma data válida",
  "must_be_a_valid_email_address": "Não é um email válido",
  "must_be_a_file": "Não é um arquivo",
  "failed_to_upload": "Erro ao enviar o arquivo",
  "could_not_upload_file": "Não foi possível enviar o arquivo",
  "field_required": "Este campo é obrigatório",
  "unavailable_credits": "Os seus documentos acabaram, você já criou todos os documentos disponíveis no seu plano.",
  "unavailable_verifications_credits": "Créditos de verificação adicional insuficientes.",
  "may_not_be_greater_than": "Não pode ter mais que {{max}} caracteres",
  "must_be_at_least": "Não pode ter menos que {{min}} caracteres",
  "must_be_at_least_characters": "Não pode ter menos que {{count}} caracteres",
  "format_is_invalid": "O formato do campo está incorreto",
  "invalid_date": "Não é uma data válida",
  "without_permission": "Você precisa ser um administrador da organização para executar esta ação.",
  "must_be_a_valid_file": "Somente são permitidos arquivos com as extensões {{extensions}}",
  "not_a_member_of_organization": "Você precisa ser um membro da mesma organização para executar esta ação."
};

/**
 * Processa e formata erros da API Autentique
 * @param {Object} errorResponse - Resposta de erro da API
 * @returns {Object} { message: string, details: Array, type: string }
 */
export function processAutentiqueError(errorResponse) {
  // Rate limit (HTTP 429)
  if (errorResponse.message === "Too Many Attempts.") {
    return {
      type: 'rate_limit',
      message: 'Muitas requisições. Aguarde um momento antes de tentar novamente.',
      details: []
    };
  }

  // Sem erros
  if (!errorResponse.errors || !Array.isArray(errorResponse.errors)) {
    return {
      type: 'unknown',
      message: 'Erro desconhecido na API do Autentique',
      details: []
    };
  }

  const errors = errorResponse.errors;
  const processedErrors = [];

  for (const error of errors) {
    // Erro de validação GraphQL
    if (error.message === 'validation' && error.extensions?.validation) {
      const validationErrors = processValidationErrors(error.extensions.validation);
      processedErrors.push(...validationErrors);
    }
    // Erro GraphQL genérico (campo obrigatório, tipo inválido, etc)
    else if (error.message && error.message.includes('Variable')) {
      processedErrors.push({
        field: null,
        message: formatGraphQLError(error.message),
        code: 'graphql_error'
      });
    }
    // Erros conhecidos (document_not_found, folder_not_found, etc)
    else if (ERROR_MESSAGES[error.message]) {
      processedErrors.push({
        field: error.path ? error.path.join('.') : null,
        message: ERROR_MESSAGES[error.message],
        code: error.message
      });
    }
    // Erro desconhecido
    else {
      processedErrors.push({
        field: error.path ? error.path.join('.') : null,
        message: error.message || 'Erro desconhecido',
        code: 'unknown'
      });
    }
  }

  return {
    type: errors[0]?.extensions?.category || 'error',
    message: processedErrors.length > 0 
      ? processedErrors[0].message 
      : 'Erro ao processar requisição',
    details: processedErrors
  };
}

/**
 * Processa erros de validação
 * @param {Object} validation - Objeto de validação do Autentique
 * @returns {Array} Lista de erros formatados
 */
function processValidationErrors(validation) {
  const errors = [];

  for (const [field, rules] of Object.entries(validation)) {
    for (const rule of rules) {
      // Regra com variáveis (ex: "must_be_at_least_characters:3")
      if (rule.includes(':')) {
        const [ruleKey, ...params] = rule.split(':');
        const message = formatErrorMessage(ruleKey, params);
        errors.push({
          field,
          message,
          code: ruleKey
        });
      }
      // Regra simples (ex: "field_required")
      else {
        errors.push({
          field,
          message: ERROR_MESSAGES[rule] || rule,
          code: rule
        });
      }
    }
  }

  return errors;
}

/**
 * Formata mensagem de erro com variáveis
 * @param {string} messageKey - Chave da mensagem
 * @param {Array} params - Parâmetros para substituir nas variáveis
 * @returns {string} Mensagem formatada
 */
function formatErrorMessage(messageKey, params) {
  let message = ERROR_MESSAGES[messageKey];
  
  if (!message) {
    return messageKey;
  }

  // Substituir variáveis do tipo {{min}}, {{max}}, {{count}}, etc
  const variables = message.match(/\{\{(\w+)\}\}/g);
  
  if (variables && params.length > 0) {
    // Para regras como "must_be_at_least_characters:3"
    if (messageKey.includes('must_be_at_least')) {
      message = message.replace(/\{\{(min|count)\}\}/, params[0]);
    }
    // Para regras como "may_not_be_greater_than:255"
    else if (messageKey.includes('may_not_be_greater')) {
      message = message.replace(/\{\{max\}\}/, params[0]);
    }
    // Para regras como "must_be_a_valid_file:pdf,doc"
    else if (messageKey.includes('must_be_a_valid_file')) {
      message = message.replace(/\{\{extensions\}\}/, params.join(', '));
    }
  }

  return message;
}

/**
 * Formata erro GraphQL para mensagem amigável
 * @param {string} graphqlError - Mensagem de erro GraphQL
 * @returns {string} Mensagem formatada
 */
function formatGraphQLError(graphqlError) {
  if (graphqlError.includes('Expected non-nullable type') && graphqlError.includes('not to be null')) {
    return 'Um campo obrigatório não foi preenchido';
  }
  
  if (graphqlError.includes('got invalid value')) {
    return 'Valor inválido enviado para a API';
  }

  return 'Erro na estrutura da requisição';
}

/**
 * Formata erros para log
 * @param {Object} processedError - Erro processado
 * @returns {string} Erro formatado para log
 */
export function formatErrorForLog(processedError) {
  let log = `[Autentique Error] ${processedError.type}: ${processedError.message}`;
  
  if (processedError.details.length > 0) {
    log += '\nDetalhes:\n';
    processedError.details.forEach(detail => {
      log += `  - ${detail.field ? `${detail.field}: ` : ''}${detail.message} (${detail.code})\n`;
    });
  }
  
  return log;
}

/**
 * Extrai mensagem principal de erro
 * @param {Object} errorResponse - Resposta de erro da API
 * @returns {string} Mensagem principal
 */
export function getMainErrorMessage(errorResponse) {
  const processed = processAutentiqueError(errorResponse);
  return processed.message;
}

/**
 * Verifica se é erro de rate limit
 * @param {Object} errorResponse - Resposta de erro
 * @returns {boolean}
 */
export function isRateLimitError(errorResponse) {
  return errorResponse.message === "Too Many Attempts." || 
         errorResponse.status === 429;
}

/**
 * Verifica se é erro de autenticação
 * @param {Object} errorResponse - Resposta de erro
 * @returns {boolean}
 */
export function isAuthError(errorResponse) {
  return errorResponse.errors?.some(e => e.message === 'unauthorized');
}