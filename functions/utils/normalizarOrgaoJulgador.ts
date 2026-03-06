/**
 * normalizarOrgaoJulgador.ts - Normalização robusta de órgão julgador
 * 
 * Cobertura completa de tribunais brasileiros:
 * - TJ* (Estaduais)
 * - TRF* (Federais)
 * - TRT* (Trabalho)
 * - TRE* (Eleitoral)
 * - STF, STJ, TST, TSE (Superiores)
 */

import { normalizarTribunalPorSigla } from './normalizadorTribunalCompleto.js';

export interface OrgaoNormalizado {
  nome: string;
  codigo?: number;
  tipo?: string;
  tribunal?: string;
  grau?: string;
}

/**
 * Normaliza órgão julgador extraindo tipo, tribunal, grau
 * 
 * Exemplos:
 * - "1ª Vara Cível da Capital" → { tribunal: "TJSP", grau: "G1", tipo: "vara" }
 * - "2ª Câmara de Direito Civil" → { tribunal: "TJSP", grau: "G2", tipo: "camera" }
 * - "Tribunal Regional Federal 2ª Região" → { tribunal: "TRF2", grau: "G1", tipo: "trf" }
 * - "Tribunal Regional Eleitoral de SP" → { tribunal: "TRE-SP", grau: "G1", tipo: "tre" }
 */
export function normalizarOrgaoJulgador(
  orgao: any
): OrgaoNormalizado {
  if (!orgao) {
    return { nome: 'N/A' };
  }

  const nome = typeof orgao === 'string' ? orgao : (orgao.nome || orgao.nomeOrgao || '');
  if (!nome) {
    return { 
      nome: 'N/A',
      codigo: typeof orgao === 'object' ? orgao.codigo : undefined
    };
  }

  const normalizado: OrgaoNormalizado = {
    nome,
    codigo: orgao.codigo,
  };

  // Detectar tipo de órgão
  const nomeUpper = nome.toUpperCase();
  const nomeLower = nome.toLowerCase();

  // ─── Superiores ────────────────────────────────────────────
  if (nomeUpper.includes('SUPREMO TRIBUNAL FEDERAL') || nomeUpper === 'STF') {
    normalizado.tribunal = 'STF';
    normalizado.grau = 'STF';
    normalizado.tipo = 'stf';
  }
  else if (nomeUpper.includes('SUPERIOR TRIBUNAL DE JUSTIÇA') || nomeUpper === 'STJ') {
    normalizado.tribunal = 'STJ';
    normalizado.grau = 'STJ';
    normalizado.tipo = 'stj';
  }
  else if (nomeUpper.includes('TRIBUNAL SUPERIOR DO TRABALHO') || nomeUpper === 'TST') {
    normalizado.tribunal = 'TST';
    normalizado.grau = 'TST';
    normalizado.tipo = 'tst';
  }
  else if (nomeUpper.includes('TRIBUNAL SUPERIOR ELEITORAL') || nomeUpper === 'TSE') {
    normalizado.tribunal = 'TSE';
    normalizado.grau = 'TSE';
    normalizado.tipo = 'tse';
  }
  // ─── Cortes de Justiça / Tribunais de Apelação ─────────────
  else if (nomeUpper.includes('TRIBUNAL DE JUSTIÇA') || nomeUpper.startsWith('TJ')) {
    const match = nome.match(/(?:de|do|da)\s+([A-Z]{2})/i);
    const uf = match ? match[1].toUpperCase() : extrairUFdoNome(nome);
    normalizado.tribunal = `TJ${uf}`;
    normalizado.grau = 'G2';
    normalizado.tipo = 'tribunal_de_justica';
  }
  // ─── Eleitorais ───────────────────────────────────────────
  else if (
    nomeUpper.includes('TRIBUNAL REGIONAL ELEITORAL') ||
    nomeUpper.includes('TRE')
  ) {
    const uf = extrairUFdoNome(nome);
    normalizado.tribunal = `TRE-${uf}`;
    normalizado.grau = 'G1';
    normalizado.tipo = 'tre';
  }
  // ─── Trabalho ──────────────────────────────────────────────
  else if (
    nomeUpper.includes('TRIBUNAL REGIONAL DO TRABALHO') ||
    nomeUpper.includes('TRT')
  ) {
    const match = nome.match(/TRT\s*-?\s*(\d+)/i);
    const numero = match ? match[1] : '1';
    normalizado.tribunal = `TRT${numero}`;
    normalizado.grau = 'G1';
    normalizado.tipo = 'trt';
  }
  // ─── Federal ───────────────────────────────────────────────
  else if (
    nomeUpper.includes('TRIBUNAL REGIONAL FEDERAL') ||
    nomeUpper.includes('TRF')
  ) {
    const match = nome.match(/(?:TRF|TRF)\s*-?\s*(\d+)/i);
    const numero = match ? match[1] : '1';
    normalizado.tribunal = `TRF${numero}`;
    normalizado.grau = 'G1';
    normalizado.tipo = 'trf';
  }
  // ─── Varas (1ª instância) ──────────────────────────────────
  else if (nomeLower.includes('vara')) {
    const uf = extrairUFdoNome(nome);
    normalizado.tribunal = `TJ${uf}`;
    normalizado.grau = 'G1';
    normalizado.tipo = 'vara';
  }
  // ─── Câmaras (2ª instância) ────────────────────────────────
  else if (nomeLower.includes('câmara') || nomeLower.includes('camara')) {
    const uf = extrairUFdoNome(nome);
    normalizado.tribunal = `TJ${uf}`;
    normalizado.grau = 'G2';
    normalizado.tipo = 'camera';
  }
  // ─── Juizados ──────────────────────────────────────────────
  else if (nomeLower.includes('juizado')) {
    const uf = extrairUFdoNome(nome);
    normalizado.tribunal = `TJ${uf}`;
    normalizado.grau = 'JE';
    normalizado.tipo = 'juizado';
  }

  return normalizado;
}

/**
 * Extrai UF do nome do órgão
 * 
 * Estratégias:
 * 1. "de SP", "do Rio de Janeiro", "da Bahia"
 * 2. Siglas de estados conhecidos
 * 3. Nomes de cidades/capitais conhecidas
 */
function extrairUFdoNome(nome: string): string {
  if (!nome) return 'SP'; // fallback

  const nomeUpper = nome.toUpperCase();

  // Padrão 1: "de SP", "de SÃO PAULO", etc
  const matches = [
    /de\s+([A-Z]{2})(?:\s|$)/,
    /do\s+([A-Z]{2})(?:\s|$)/,
    /da\s+([A-Z]{2})(?:\s|$)/,
  ];

  for (const pattern of matches) {
    const match = nome.match(pattern);
    if (match && match[1] && match[1].length === 2) {
      return match[1];
    }
  }

  // Padrão 2: Siglas de 2 letras
  const siglasEmbutidas = [
    'SP', 'RJ', 'MG', 'BA', 'SC', 'PR', 'RS', 'PE', 'CE', 'PA',
    'GO', 'PB', 'ES', 'PI', 'RN', 'AL', 'AC', 'AM', 'AP', 'DF',
    'MA', 'MS', 'MT', 'RO', 'RR', 'TO', 'SE'
  ];

  for (const sigla of siglasEmbutidas) {
    if (nomeUpper.includes(sigla) && 
        (nomeUpper.includes(`DE ${sigla}`) || 
         nomeUpper.includes(`DO ${sigla}`) ||
         nomeUpper.includes(`DA ${sigla}`) ||
         nomeUpper.endsWith(sigla))) {
      return sigla;
    }
  }

  // Padrão 3: Nomes de capitais
  const capitaisMap: Record<string, string> = {
    'SÃO PAULO': 'SP',
    'SAO PAULO': 'SP',
    'RIO DE JANEIRO': 'RJ',
    'BELO HORIZONTE': 'MG',
    'SALVADOR': 'BA',
    'BRASÍLIA': 'DF',
    'BRASILIA': 'DF',
    'CURITIBA': 'PR',
    'PORTO ALEGRE': 'RS',
    'RECIFE': 'PE',
    'FORTALEZA': 'CE',
    'BELÉM': 'PA',
    'BELEM': 'PA',
    'GOIÂNIA': 'GO',
    'GOIANIA': 'GO',
    'JOÃO PESSOA': 'PB',
    'JOAO PESSOA': 'PB',
    'VITÓRIA': 'ES',
    'VITORIA': 'ES',
    'TERESINA': 'PI',
    'NATAL': 'RN',
    'MACEIÓ': 'AL',
    'MACEIO': 'AL',
  };

  for (const [capital, uf] of Object.entries(capitaisMap)) {
    if (nomeUpper.includes(capital)) {
      return uf;
    }
  }

  // Fallback final
  return 'SP';
}

/**
 * Valida se órgão foi normalizado corretamente
 */
export function validarOrgaoNormalizado(normalizado: OrgaoNormalizado): {
  valido: boolean;
  erros: string[];
} {
  const erros: string[] = [];

  if (!normalizado.nome) {
    erros.push('nome obrigatório');
  }

  if (normalizado.tribunal && !validarSiglaTribunal(normalizado.tribunal)) {
    erros.push(`tribunal inválido: ${normalizado.tribunal}`);
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

/**
 * Valida se sigla de tribunal é conhecida
 */
function validarSiglaTribunal(tribunal: string): boolean {
  const siglas = [
    'STF', 'STJ', 'TST', 'TSE',
    'TJSP', 'TJRJ', 'TJMG', 'TJBA', 'TJRS', 'TJSC', 'TJPR', 'TJPE',
    'TJCE', 'TJPA', 'TJGO', 'TJPB', 'TJES', 'TJPI', 'TJRN', 'TJAL',
    'TJAC', 'TJAM', 'TJAP', 'TJDF', 'TJMA', 'TJMS', 'TJMT', 'TJRO', 'TJRR', 'TJTO',
    'TRF1', 'TRF2', 'TRF3', 'TRF4', 'TRF5', 'JFRJ', 'JFSP', 'JFMG', 'JFBA', 'JFRS',
    'TRT1', 'TRT2', 'TRT3', 'TRT4', 'TRT5', 'TRT6', 'TRT7', 'TRT8', 'TRT9', 'TRT10', 'TRT11', 'TRT12', 'TRT13', 'TRT14', 'TRT15',
    'TRE-SP', 'TRE-RJ', 'TRE-MG', 'TRE-BA', 'TRE-SC', 'TRE-PR', 'TRE-RS', 'TRE-PE', 'TRE-CE',
  ];
  return siglas.includes(tribunal);
}