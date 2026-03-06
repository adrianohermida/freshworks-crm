/**
 * Validação de Schema ProcessoCEJUSC
 * Valida campos obrigatórios e formatos antes de persist
 */

export function validarProcessoCEJUSC(processo) {
  const erros = [];

  // Campos obrigatórios
  if (!processo.numero_processo) {
    erros.push({
      campo: 'numero_processo',
      mensagem: 'Número do processo é obrigatório',
    });
  } else if (!validarCNJ(processo.numero_processo)) {
    erros.push({
      campo: 'numero_processo',
      mensagem: 'Formato CNJ inválido: deve ser NNNNNNN-DD.AAAA.J.TT.OOOO',
    });
  }

  if (!processo.tipo) {
    erros.push({
      campo: 'tipo',
      mensagem: 'Tipo do processo é obrigatório',
    });
  } else {
    const tiposValidos = [
      'cejusc', 'procon', 'reclamacao_pre_processual', 'denuncia_bacen', 'denuncia_cvm',
      'judicial_estadual', 'judicial_federal', 'judicial_trabalho', 'judicial_eleitoral',
      'judicial_militar', 'stj', 'stf', 'tst', 'tse'
    ];
    if (!tiposValidos.includes(processo.tipo)) {
      erros.push({
        campo: 'tipo',
        mensagem: `Tipo inválido. Válidos: ${tiposValidos.join(', ')}`,
      });
    }
  }

  // Campo data_ajuizamento (obrigatório para alguns tipos)
  if (['judicial_estadual', 'judicial_federal', 'judicial_trabalho'].includes(processo.tipo)) {
    if (!processo.data_ajuizamento) {
      erros.push({
        campo: 'data_ajuizamento',
        mensagem: 'Data de ajuizamento obrigatória para processos judiciais',
      });
    } else if (!isValidDate(processo.data_ajuizamento)) {
      erros.push({
        campo: 'data_ajuizamento',
        mensagem: 'Data inválida (formato: YYYY-MM-DD)',
      });
    }
  }

  // Campos opcionais com validação
  if (processo.status && !isValidStatus(processo.status)) {
    erros.push({
      campo: 'status',
      mensagem: 'Status inválido',
    });
  }

  if (processo.data_proxima_audiencia && !isValidDate(processo.data_proxima_audiencia)) {
    erros.push({
      campo: 'data_proxima_audiencia',
      mensagem: 'Data inválida',
    });
  }

  return {
    valido: erros.length === 0,
    erros,
    warnings: validarWarnings(processo),
  };
}

/**
 * Valida CNJ format: NNNNNNN-DD.AAAA.J.TT.OOOO
 */
export function validarCNJ(numero) {
  if (!numero || typeof numero !== 'string') return false;
  const regex = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/;
  return regex.test(numero);
}

/**
 * Valida formato de data
 */
function isValidDate(dateStr) {
  if (!dateStr) return true; // opcional
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

/**
 * Valida status
 */
function isValidStatus(status) {
  const statusValidos = [
    'aberto', 'em_audiencia', 'acordo', 'cancelado', 
    'finalizado', 'em_analise', 'pendente'
  ];
  return statusValidos.includes(status);
}

/**
 * Validações não-bloqueantes (warnings)
 */
function validarWarnings(processo) {
  const warnings = [];

  if (!processo.cliente_id) {
    warnings.push('Cliente não associado (recomendado)');
  }

  if (!processo.consultor_responsavel_email) {
    warnings.push('Consultor responsável não atribuído (recomendado)');
  }

  if (!processo.partes || processo.partes.length === 0) {
    warnings.push('Nenhuma parte adicionada ao processo');
  }

  if (processo.data_ajuizamento && new Date(processo.data_ajuizamento) > new Date()) {
    warnings.push('Data de ajuizamento é no futuro');
  }

  return warnings;
}