/**
 * ProcessoCEJUSC Domain Constants
 * Valores constantes e enumerações para ProcessoCEJUSC
 */

export const PROCESSO_TIPOS = {
  CEJUSC: 'cejusc',
  PROCON: 'procon',
  JUDICIAL_ESTADUAL: 'judicial_estadual',
  JUDICIAL_FEDERAL: 'judicial_federal',
  STJ: 'stj',
  STF: 'stf'
};

export const PROCESSO_JURISDICAO = {
  EXTRAJUDICIAL: 'extrajudicial',
  ESTADUAL: 'estadual',
  FEDERAL: 'federal',
  SUPERIOR: 'superior'
};

export const PROCESSO_STATUS = {
  ABERTO: 'aberto',
  ACORDO: 'acordo',
  CANCELADO: 'cancelado',
  FINALIZADO: 'finalizado',
  EM_ANALISE: 'em_analise'
};

export const TRIBUNAIS_PRINCIPAIS = [
  { value: 'TJSP', label: 'TJSP - São Paulo' },
  { value: 'TJRJ', label: 'TJRJ - Rio de Janeiro' },
  { value: 'TJMG', label: 'TJMG - Minas Gerais' },
  { value: 'TJBA', label: 'TJBA - Bahia' },
  { value: 'TJPE', label: 'TJPE - Pernambuco' },
  { value: 'TRF1', label: 'TRF1 - Justiça Federal 1ª Região' },
  { value: 'TRF2', label: 'TRF2 - Justiça Federal 2ª Região' },
  { value: 'TRF3', label: 'TRF3 - Justiça Federal 3ª Região' },
  { value: 'TRF4', label: 'TRF4 - Justiça Federal 4ª Região' },
  { value: 'TRF5', label: 'TRF5 - Justiça Federal 5ª Região' },
  { value: 'STJ', label: 'STJ - Superior Tribunal de Justiça' },
  { value: 'STF', label: 'STF - Supremo Tribunal Federal' }
];

export const PROCESSO_TIPOS_LABEL = {
  [PROCESSO_TIPOS.CEJUSC]: 'CEJUSC',
  [PROCESSO_TIPOS.PROCON]: 'Procon',
  [PROCESSO_TIPOS.JUDICIAL_ESTADUAL]: 'Judicial Estadual',
  [PROCESSO_TIPOS.JUDICIAL_FEDERAL]: 'Judicial Federal',
  [PROCESSO_TIPOS.STJ]: 'STJ',
  [PROCESSO_TIPOS.STF]: 'STF'
};

export const PROCESSO_STATUS_LABEL = {
  [PROCESSO_STATUS.ABERTO]: 'Aberto',
  [PROCESSO_STATUS.ACORDO]: 'Acordo',
  [PROCESSO_STATUS.CANCELADO]: 'Cancelado',
  [PROCESSO_STATUS.FINALIZADO]: 'Finalizado',
  [PROCESSO_STATUS.EM_ANALISE]: 'Em Análise'
};