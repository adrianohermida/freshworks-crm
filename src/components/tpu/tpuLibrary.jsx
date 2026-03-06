/**
 * 📚 TPU Library - Biblioteca Centralizada
 * Consolidação de todas as funções TPU reutilizáveis
 */

export function validateCNJ(cnj_number) {
  const pattern = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{5}\.\d{7}$/;
  return pattern.test(cnj_number);
}

export function parseCNJ(cnj_number) {
  if (!validateCNJ(cnj_number)) return null;
  
  const [num, dd, yyyy, seg, trib, orig, ano] = cnj_number
    .replace(/\D/g, '')
    .match(/(.{7})(.{2})(.{4})(.{1})(.{5})(.{7})/)
    .slice(1);

  return { numero_sequencial: num, digitos_verificadores: dd, ano: yyyy, segmento: seg, tribunal: trib, origem: orig, ano_distribuicao: ano };
}

export function getTribunalInfo(tribunal_code) {
  const tribunals = {
    '0001': { nome: 'STF', sigla: 'STF', nivel: 'superior' },
    '0002': { nome: 'STJ', sigla: 'STJ', nivel: 'superior' },
    '0011': { nome: 'TRF 1ª Região', sigla: 'TRF1', nivel: '2º_grau' },
    '0012': { nome: 'TRF 2ª Região', sigla: 'TRF2', nivel: '2º_grau' }
  };
  return tribunals[tribunal_code] || { nome: 'Desconhecido', nivel: '1º_grau' };
}

export function enrichProcessWithTPU(process_data) {
  if (!process_data.cnj_number) return process_data;
  
  const parsed = parseCNJ(process_data.cnj_number);
  if (!parsed) return process_data;
  
  return {
    ...process_data,
    parsed_cnj: parsed,
    tribunal_info: getTribunalInfo(parsed.tribunal),
    parsed_tribunal: getTribunalInfo(parsed.tribunal).sigla
  };
}

export function classifyMovement(movement_desc) {
  const keywords = {
    sentenca: ['sentença', 'condenado'],
    recurso: ['recurso', 'apelação'],
    audiencia: ['audiência', 'julgamento'],
    intimacao: ['intimação', 'citação'],
    pubicacao: ['publicação', 'diário']
  };
  
  const desc_lower = movement_desc.toLowerCase();
  for (const [type, patterns] of Object.entries(keywords)) {
    if (patterns.some(p => desc_lower.includes(p))) return type;
  }
  return 'outro';
}

export function daysUntilDeadline(deadline_date) {
  const diff = new Date(deadline_date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getDeadlineStatus(deadline_date) {
  const days = daysUntilDeadline(deadline_date);
  if (days < 0) return 'overdue';
  if (days === 0) return 'due_today';
  if (days <= 7) return 'alert';
  return 'pending';
}

export default {
  validateCNJ,
  parseCNJ,
  getTribunalInfo,
  enrichProcessWithTPU,
  classifyMovement,
  daysUntilDeadline,
  getDeadlineStatus
};