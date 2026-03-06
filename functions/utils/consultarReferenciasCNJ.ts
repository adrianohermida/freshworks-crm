/**
 * Consulta integrada de referências CNJ
 * Combina: ParseCNJ + JuizoCNJ + Serventia + CodigoFotoTJSP + SGT
 */

import { extrairCamposCNJ, ehCNJValido } from './validarCNJ.ts';
import { tribunais, siglasTribunais } from './types/tribunais.ts';

interface ReferenciasCNJ {
  numero: string;
  formatado: string;
  ehValido: boolean;
  tribunal?: { sigla: string; nome: string };
  uf?: string;
  juizoCNJ?: any;
  serventia?: any;
  codigoFoto?: any;
  comarca?: string;
  municipio?: string;
  campos?: {
    numeroProcesso: string;
    digitoVerificador: number;
    anoAjuizamento: number;
    segmentoJudicial: number;
    tribunal: number;
    codigoOrigem: string;
  };
  erros?: string[];
  avisos?: string[];
}

/**
 * Detecta tribunal via ENDPOINTS (J + TT)
 * Mantém compatibilidade com código existente
 */
function detectarTribunalPorCNJ(segmento: number, tribunal: number): string | null {
  const ENDPOINTS: Record<string, string> = {
    '100': 'STF', '200': 'CNJ', '300': 'STJ',
    '400': 'CJF', '401': 'TRF1', '402': 'TRF2', '403': 'TRF3', '404': 'TRF4', '405': 'TRF5', '406': 'TRF6',
    '500': 'TST',
    '501': 'TRT1', '502': 'TRT2', '503': 'TRT3', '504': 'TRT4', '505': 'TRT5', '506': 'TRT6',
    '507': 'TRT7', '508': 'TRT8', '509': 'TRT9', '510': 'TRT10', '511': 'TRT11', '512': 'TRT12',
    '513': 'TRT13', '514': 'TRT14', '515': 'TRT15', '516': 'TRT16', '517': 'TRT17', '518': 'TRT18',
    '519': 'TRT19', '520': 'TRT20', '521': 'TRT21', '522': 'TRT22', '523': 'TRT23', '524': 'TRT24',
    '600': 'TSE',
    '601': 'TREAC', '602': 'TREAL', '603': 'TREAM', '604': 'TREAP', '605': 'TREBA',
    '606': 'TRECE', '607': 'TREDFT', '608': 'TREES', '609': 'TREGO', '610': 'TREMA',
    '611': 'TREMG', '612': 'TREMS', '613': 'TREMT', '614': 'TREPA', '615': 'TREPB',
    '616': 'TREPE', '617': 'TREPI', '618': 'TREPR', '619': 'TRERJ', '620': 'TRERN',
    '621': 'TRERO', '622': 'TRERR', '623': 'TRERS', '624': 'TRESC', '625': 'TRESP', '626': 'TRETO',
    '700': 'STM',
    '801': 'TJAC', '802': 'TJAL', '803': 'TJAM', '804': 'TJAP', '805': 'TJBA', '806': 'TJCE',
    '807': 'TJDFT', '808': 'TJES', '809': 'TJGO', '810': 'TJMA', '811': 'TJMG', '812': 'TJMS',
    '813': 'TJMT', '814': 'TJPA', '815': 'TJPB', '816': 'TJPE', '817': 'TJPI', '818': 'TJPR',
    '819': 'TJRJ', '820': 'TJRN', '821': 'TJRO', '822': 'TJRR', '823': 'TJRS', '824': 'TJSC',
    '825': 'TJSE', '826': 'TJSP', '827': 'TJTO',
  };

  const chave = `${segmento}${String(tribunal).padStart(2, '0')}`;
  return ENDPOINTS[chave] || null;
}

/**
 * Extrai UF do código origem (OOOO) via JuizoCNJ
 * Se não tiver JuizoCNJ, tenta inferir do tribunal
 */
function extrairUFDoTribunal(sigla: string): string | null {
  const ufMap: Record<string, string> = {
    TJAC: 'AC', TJAL: 'AL', TJAM: 'AM', TJAP: 'AP', TJBA: 'BA', TJCE: 'CE',
    TJDFT: 'DF', TJES: 'ES', TJGO: 'GO', TJMA: 'MA', TJMG: 'MG', TJMS: 'MS',
    TJMT: 'MT', TJPA: 'PA', TJPB: 'PB', TJPE: 'PE', TJPI: 'PI', TJPR: 'PR',
    TJRJ: 'RJ', TJRN: 'RN', TJRO: 'RO', TJRR: 'RR', TJRS: 'RS', TJSC: 'SC',
    TJSE: 'SE', TJSP: 'SP', TJTO: 'TO',
  };
  return ufMap[sigla] || null;
}

/**
 * Consulta integrada de referências CNJ
 * Recebe um número CNJ e retorna todas as informações associadas
 */
export async function consultarReferenciasCNJ(
  cnj: string | number,
  base44?: any // SDK da Base44 para queries
): Promise<ReferenciasCNJ> {
  const numLimpo = String(cnj).replace(/\D/g, '').slice(0, 20);
  const valido = ehCNJValido(numLimpo);
  const campos = extrairCamposCNJ(numLimpo);

  const resultado: ReferenciasCNJ = {
    numero: numLimpo,
    formatado: campos.formatado,
    ehValido: valido,
    campos: {
      numeroProcesso: campos.numeroProcesso,
      digitoVerificador: campos.digitoVerificador,
      anoAjuizamento: campos.anoAjuizamento,
      segmentoJudicial: campos.segmentoJudicial,
      tribunal: campos.tribunal,
      codigoOrigem: campos.codigoOrigem,
    },
    erros: [],
    avisos: [],
  };

  if (!valido) {
    resultado.erros?.push(campos.erro || 'CNJ inválido');
    return resultado;
  }

  // 1. Detectar tribunal via segmento + tribunal
  const siglaTribunal = detectarTribunalPorCNJ(campos.segmentoJudicial, campos.tribunal);
  if (siglaTribunal) {
    resultado.tribunal = {
      sigla: siglaTribunal,
      nome: tribunais[siglaTribunal as keyof typeof tribunais] || 'Desconhecido',
    };
    resultado.uf = extrairUFDoTribunal(siglaTribunal);
  } else {
    resultado.erros?.push(`Tribunal não identificado para J=${campos.segmentoJudicial} TT=${campos.tribunal}`);
  }

  // 2. Se houver base44, consultar JuizoCNJ + Serventia + CodigoFotoTJSP
  if (base44) {
    try {
      // Buscar JuizoCNJ via codigo_origem (OOOO)
      const juizos = await base44.asServiceRole.entities.JuizoCNJ.filter(
        { codigo_origem: campos.codigoOrigem },
        null,
        1
      );

      if (juizos.length > 0) {
        resultado.juizoCNJ = juizos[0];
        resultado.comarca = juizos[0].comarca;
        resultado.municipio = juizos[0].foro;

        // Buscar serventia vinculada
        const serventias = await base44.asServiceRole.entities.Serventia.filter(
          { numero_serventia: juizos[0].numero_serventia },
          null,
          1
        );

        if (serventias.length > 0) {
          resultado.serventia = serventias[0];
        }
      } else {
        resultado.avisos?.push(`JuizoCNJ não encontrado para OOOO=${campos.codigoOrigem}`);
      }

      // Se for TJSP, buscar CodigoFotoTJSP
      if (siglaTribunal === 'TJSP') {
        const codigoFoto = await base44.asServiceRole.entities.CodigoFotoTJSP.filter(
          { codigo_foro: campos.codigoOrigem },
          null,
          1
        );

        if (codigoFoto.length > 0) {
          resultado.codigoFoto = codigoFoto[0];
          resultado.comarca = codigoFoto[0].comarca;
          resultado.municipio = codigoFoto[0].municipio;
        }
      }
    } catch (e) {
      resultado.avisos?.push(`Erro ao consultar referências: ${(e as Error).message}`);
    }
  }

  return resultado;
}

/**
 * Valida dados antes de criar ProcessoCEJUSC
 * Retorna lista de campos faltando e validações
 */
export async function validarProcessoData(
  dados: Record<string, any>
): Promise<{ valido: boolean; erros: string[]; avisos: string[] }> {
  const erros: string[] = [];
  const avisos: string[] = [];

  // Campos obrigatórios
  if (!dados.numero_processo) erros.push('numero_processo obrigatório');
  if (!dados.cliente_id) erros.push('cliente_id obrigatório');
  if (!dados.consultor_responsavel_email) avisos.push('consultor_responsavel_email recomendado');

  // CNJ válido?
  if (dados.numero_processo && !ehCNJValido(dados.numero_processo)) {
    erros.push('numero_processo: CNJ inválido');
  }

  // Processo já existe?
  // Esta verificação seria feita em nível de backend function com acesso ao base44

  return {
    valido: erros.length === 0,
    erros,
    avisos,
  };
}