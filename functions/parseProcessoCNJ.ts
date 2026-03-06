/**
 * Parser CNJ Universal - Funciona offline com todos os 76 tribunais
 * Extrai estrutura padrão CNJ sem dependências externas
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Estrutura padrão CNJ: NNNNNNN-DD.AAAA.J.TT.OOOO
const CNJ_REGEX = /^(\d{7})-(\d{2})\.(\d{4})\.(\d)\.(\d{2})\.(\d{4})$/;

const TRIBUNAIS_MAP = {
  '01': 'STF', '02': 'STJ', '03': 'TST', '04': 'TSE', '05': 'TMDFT', '06': 'TMSP', '07': 'TMRS', '08': 'TMRJ', '09': 'TMMG',
  '10': 'TRF1', '11': 'TRF2', '12': 'TRF3', '13': 'TRF4', '14': 'TRF5', '15': 'TRF6',
  '16': 'TJAC', '17': 'TJAL', '18': 'TJAM', '19': 'TJAP', '20': 'TJBA', '21': 'TJCE', '22': 'TJDFT', '23': 'TJES', 
  '24': 'TJGO', '25': 'TJMA', '26': 'TJMG', '27': 'TJMS', '28': 'TJMT', '29': 'TJPA', '30': 'TJPB', '31': 'TJPE', 
  '32': 'TJPI', '33': 'TJPR', '34': 'TJRJ', '35': 'TJRN', '36': 'TJRO', '37': 'TJRR', '38': 'TJRS', '39': 'TJSC', 
  '40': 'TJSE', '41': 'TJSP', '42': 'TJTO',
  '43': 'TRT1', '44': 'TRT2', '45': 'TRT3', '46': 'TRT4', '47': 'TRT5', '48': 'TRT6', '49': 'TRT7', '50': 'TRT8',
  '51': 'TRT9', '52': 'TRT10', '53': 'TRT11', '54': 'TRT12', '55': 'TRT13', '56': 'TRT14', '57': 'TRT15',
  '58': 'TRT16', '59': 'TRT17', '60': 'TRT18', '61': 'TRT19', '62': 'TRT20', '63': 'TRT21', '64': 'TRT22',
  '65': 'TRT23', '66': 'TRT24',
  '67': 'TSE', '68': 'TSE', '69': 'TSE',
  '71': 'TREST_AC', '72': 'TREST_AL', '73': 'TREST_AM', '74': 'TREST_AP', '75': 'TREST_BA', '76': 'TREST_CE',
  '77': 'TREST_DF', '78': 'TREST_ES', '79': 'TREST_GO', '80': 'TREST_MA', '81': 'TREST_MG', '82': 'TREST_MS',
  '83': 'TREST_MT', '84': 'TREST_PA', '85': 'TREST_PB', '86': 'TREST_PE', '87': 'TREST_PI', '88': 'TREST_PR',
  '89': 'TREST_RJ', '90': 'TREST_RN', '91': 'TREST_RO', '92': 'TREST_RR', '93': 'TREST_RS', '94': 'TREST_SC',
  '95': 'TREST_SE', '96': 'TREST_SP', '97': 'TREST_TO'
};

const SEGMENTOS = {
  '1': 'Judiciário Estadual',
  '2': 'Judiciário Federal',
  '3': 'Judiciário do Trabalho',
  '4': 'Judiciário Eleitoral',
  '5': 'Judiciário Militar',
  '6': 'Judiciário Superior',
  '7': 'CNJ',
  '8': 'Ministério Público',
  '9': 'Advocacia'
};

/**
 * Parse CNJ com validação de checksum
 */
function validarChecksum(numero) {
  const match = numero.match(CNJ_REGEX);
  if (!match) return false;

  const [, seq, check, ano, seg, trib, orig] = match;
  const resto = `${orig}${ano}${seg}${trib}${seq}`;
  const dv = resto.split('').reduce((acc, digit, i) => {
    const peso = ((i % 8) + 2);
    return acc + (parseInt(digit) * peso);
  }, 0);

  const calculado = 11 - (dv % 11);
  const checkDigit = calculado === 0 ? 0 : calculado === 1 ? 1 : calculado;

  return parseInt(check.split('')[0]) === Math.floor(checkDigit / 10) &&
         parseInt(check.split('')[1]) === (checkDigit % 10);
}

/**
 * Extrair informações do número CNJ
 */
export function parseProcessoCNJ(cnj) {
  const numero = cnj.replace(/\D/g, '');
  const match = numero.match(/^(\d{7})(\d{2})(\d{4})(\d)(\d{2})(\d{4})$/);

  if (!match) {
    return {
      valido: false,
      erro: 'Formato inválido. Esperado: NNNNNNN-DD.AAAA.J.TT.OOOO'
    };
  }

  const [, seq, check, ano, seg, trib, orig] = match;
  const valido = validarChecksum(numero);

  const tribunal = TRIBUNAIS_MAP[trib];
  const segmento = SEGMENTOS[seg];

  return {
    valido,
    numero: numero,
    numeroFormatado: `${seq}-${check}.${ano}.${seg}.${trib}.${orig}`,
    sequencial: seq,
    digitos_verificadores: check,
    ano_registro: ano,
    segmento: { codigo: seg, nome: segmento },
    tribunal: { codigo: trib, nome: tribunal },
    origem: orig,
    dataRegistro: null, // Preenchido após sincronização
    erro: valido ? null : 'Checksum inválido'
  };
}

/**
 * Função backend para parse offline
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cnj_number } = body;

    if (!cnj_number) {
      return Response.json({ error: 'cnj_number é obrigatório' }, { status: 400 });
    }

    const resultado = parseProcessoCNJ(cnj_number);

    if (!resultado.valido) {
      return Response.json(resultado, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[parseProcessoCNJ] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});