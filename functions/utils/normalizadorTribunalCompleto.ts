/**
 * normalizadorTribunalCompleto.ts - Cobertura completa de tribunais
 * 
 * Cobre:
 * - TJSP, TJRJ, TJMG, TJRS, TJBA, TJPR, TJSC, TJPE, TJCE, TJGO, TJMT, TJMS, TJDISTRITO
 * - TRF1, TRF2, TRF3, TRF4, TRF5
 * - TRT1-27 (Tribunais do Trabalho)
 * - TRE por UF (Tribunais Regionais Eleitorais)
 * - STF, STJ, TST, TSE (Cortes Superiores)
 */

export interface TribunalNormalizado {
  sigla: string;
  nome: string;
  tipo: 'estadual' | 'federal' | 'trabalho' | 'eleitoral' | 'superior';
  uf?: string;
  grau?: string;
  juizo_principal?: string;
}

const TRIBUNAIS_DB: Record<string, TribunalNormalizado> = {
  // ─── Tribunais Estaduais ───────────────────────────────────
  'TJSP': { sigla: 'TJSP', nome: 'Tribunal de Justiça do Estado de São Paulo', tipo: 'estadual', uf: 'SP', juizo_principal: 'São Paulo' },
  'TJRJ': { sigla: 'TJRJ', nome: 'Tribunal de Justiça do Estado do Rio de Janeiro', tipo: 'estadual', uf: 'RJ', juizo_principal: 'Rio de Janeiro' },
  'TJMG': { sigla: 'TJMG', nome: 'Tribunal de Justiça do Estado de Minas Gerais', tipo: 'estadual', uf: 'MG', juizo_principal: 'Belo Horizonte' },
  'TJRS': { sigla: 'TJRS', nome: 'Tribunal de Justiça do Estado do Rio Grande do Sul', tipo: 'estadual', uf: 'RS', juizo_principal: 'Porto Alegre' },
  'TJBA': { sigla: 'TJBA', nome: 'Tribunal de Justiça do Estado da Bahia', tipo: 'estadual', uf: 'BA', juizo_principal: 'Salvador' },
  'TJPR': { sigla: 'TJPR', nome: 'Tribunal de Justiça do Estado do Paraná', tipo: 'estadual', uf: 'PR', juizo_principal: 'Curitiba' },
  'TJSC': { sigla: 'TJSC', nome: 'Tribunal de Justiça do Estado de Santa Catarina', tipo: 'estadual', uf: 'SC', juizo_principal: 'Florianópolis' },
  'TJPE': { sigla: 'TJPE', nome: 'Tribunal de Justiça do Estado de Pernambuco', tipo: 'estadual', uf: 'PE', juizo_principal: 'Recife' },
  'TJCE': { sigla: 'TJCE', nome: 'Tribunal de Justiça do Estado do Ceará', tipo: 'estadual', uf: 'CE', juizo_principal: 'Fortaleza' },
  'TJGO': { sigla: 'TJGO', nome: 'Tribunal de Justiça do Estado de Goiás', tipo: 'estadual', uf: 'GO', juizo_principal: 'Goiânia' },
  'TJMT': { sigla: 'TJMT', nome: 'Tribunal de Justiça do Estado de Mato Grosso', tipo: 'estadual', uf: 'MT', juizo_principal: 'Cuiabá' },
  'TJMS': { sigla: 'TJMS', nome: 'Tribunal de Justiça do Estado de Mato Grosso do Sul', tipo: 'estadual', uf: 'MS', juizo_principal: 'Campo Grande' },
  'TJDF': { sigla: 'TJDF', nome: 'Tribunal de Justiça do Distrito Federal', tipo: 'estadual', uf: 'DF', juizo_principal: 'Brasília' },
  'TJPB': { sigla: 'TJPB', nome: 'Tribunal de Justiça do Estado da Paraíba', tipo: 'estadual', uf: 'PB', juizo_principal: 'João Pessoa' },
  'TJPI': { sigla: 'TJPI', nome: 'Tribunal de Justiça do Estado do Piauí', tipo: 'estadual', uf: 'PI', juizo_principal: 'Teresina' },
  'TJRN': { sigla: 'TJRN', nome: 'Tribunal de Justiça do Estado do Rio Grande do Norte', tipo: 'estadual', uf: 'RN', juizo_principal: 'Natal' },
  'TJES': { sigla: 'TJES', nome: 'Tribunal de Justiça do Estado do Espírito Santo', tipo: 'estadual', uf: 'ES', juizo_principal: 'Vitória' },
  'TJMA': { sigla: 'TJMA', nome: 'Tribunal de Justiça do Estado do Maranhão', tipo: 'estadual', uf: 'MA', juizo_principal: 'São Luís' },
  'TJAM': { sigla: 'TJAM', nome: 'Tribunal de Justiça do Estado do Amazonas', tipo: 'estadual', uf: 'AM', juizo_principal: 'Manaus' },
  'TJPA': { sigla: 'TJPA', nome: 'Tribunal de Justiça do Estado do Pará', tipo: 'estadual', uf: 'PA', juizo_principal: 'Belém' },
  'TJACC': { sigla: 'TJACC', nome: 'Tribunal de Justiça do Estado do Acre', tipo: 'estadual', uf: 'AC', juizo_principal: 'Rio Branco' },
  'TJAP': { sigla: 'TJAP', nome: 'Tribunal de Justiça do Estado do Amapá', tipo: 'estadual', uf: 'AP', juizo_principal: 'Macapá' },
  'TJRO': { sigla: 'TJRO', nome: 'Tribunal de Justiça do Estado de Rondônia', tipo: 'estadual', uf: 'RO', juizo_principal: 'Porto Velho' },
  'TJRR': { sigla: 'TJRR', nome: 'Tribunal de Justiça do Estado de Roraima', tipo: 'estadual', uf: 'RR', juizo_principal: 'Boa Vista' },
  'TJTO': { sigla: 'TJTO', nome: 'Tribunal de Justiça do Estado de Tocantins', tipo: 'estadual', uf: 'TO', juizo_principal: 'Palmas' },
  'TJSE': { sigla: 'TJSE', nome: 'Tribunal de Justiça do Estado de Sergipe', tipo: 'estadual', uf: 'SE', juizo_principal: 'Aracaju' },
  'TJOAB': { sigla: 'TJOAB', nome: 'Tribunal de Justiça do Estado de Alagoas', tipo: 'estadual', uf: 'AL', juizo_principal: 'Maceió' },

  // ─── Tribunais Federais ────────────────────────────────────
  'TRF1': { sigla: 'TRF1', nome: '1ª Turma Recursal Federal', tipo: 'federal', juizo_principal: 'Brasília' },
  'TRF2': { sigla: 'TRF2', nome: '2ª Turma Recursal Federal', tipo: 'federal', juizo_principal: 'Rio de Janeiro' },
  'TRF3': { sigla: 'TRF3', nome: '3ª Turma Recursal Federal', tipo: 'federal', juizo_principal: 'São Paulo' },
  'TRF4': { sigla: 'TRF4', nome: '4ª Turma Recursal Federal', tipo: 'federal', juizo_principal: 'Porto Alegre' },
  'TRF5': { sigla: 'TRF5', nome: '5ª Turma Recursal Federal', tipo: 'federal', juizo_principal: 'Recife' },

  // ─── Tribunais do Trabalho ─────────────────────────────────
  'TRT1': { sigla: 'TRT1', nome: '1º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'RJ', juizo_principal: 'Rio de Janeiro' },
  'TRT2': { sigla: 'TRT2', nome: '2º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'SP', juizo_principal: 'São Paulo' },
  'TRT3': { sigla: 'TRT3', nome: '3º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'MG', juizo_principal: 'Belo Horizonte' },
  'TRT4': { sigla: 'TRT4', nome: '4º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'RS', juizo_principal: 'Porto Alegre' },
  'TRT5': { sigla: 'TRT5', nome: '5º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'BA', juizo_principal: 'Salvador' },
  'TRT6': { sigla: 'TRT6', nome: '6º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'PE', juizo_principal: 'Recife' },
  'TRT7': { sigla: 'TRT7', nome: '7º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'CE', juizo_principal: 'Fortaleza' },
  'TRT8': { sigla: 'TRT8', nome: '8º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'PA', juizo_principal: 'Belém' },
  'TRT9': { sigla: 'TRT9', nome: '9º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'PR', juizo_principal: 'Curitiba' },
  'TRT10': { sigla: 'TRT10', nome: '10º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'DF', juizo_principal: 'Brasília' },
  'TRT11': { sigla: 'TRT11', nome: '11º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'AM', juizo_principal: 'Manaus' },
  'TRT12': { sigla: 'TRT12', nome: '12º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'SC', juizo_principal: 'Florianópolis' },
  'TRT13': { sigla: 'TRT13', nome: '13º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'PB', juizo_principal: 'João Pessoa' },
  'TRT14': { sigla: 'TRT14', nome: '14º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'RO', juizo_principal: 'Porto Velho' },
  'TRT15': { sigla: 'TRT15', nome: '15º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'SP', juizo_principal: 'Campinas' },
  'TRT16': { sigla: 'TRT16', nome: '16º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'MA', juizo_principal: 'São Luís' },
  'TRT17': { sigla: 'TRT17', nome: '17º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'ES', juizo_principal: 'Vitória' },
  'TRT18': { sigla: 'TRT18', nome: '18º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'GO', juizo_principal: 'Goiânia' },
  'TRT19': { sigla: 'TRT19', nome: '19º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'AL', juizo_principal: 'Maceió' },
  'TRT20': { sigla: 'TRT20', nome: '20º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'SE', juizo_principal: 'Aracaju' },
  'TRT21': { sigla: 'TRT21', nome: '21º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'RN', juizo_principal: 'Natal' },
  'TRT22': { sigla: 'TRT22', nome: '22º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'PI', juizo_principal: 'Teresina' },
  'TRT23': { sigla: 'TRT23', nome: '23º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'MT', juizo_principal: 'Cuiabá' },
  'TRT24': { sigla: 'TRT24', nome: '24º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'MS', juizo_principal: 'Campo Grande' },
  'TRT25': { sigla: 'TRT25', nome: '25º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'DF', juizo_principal: 'Brasília' },
  'TRT26': { sigla: 'TRT26', nome: '26º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'AP', juizo_principal: 'Macapá' },
  'TRT27': { sigla: 'TRT27', nome: '27º Tribunal Regional do Trabalho', tipo: 'trabalho', uf: 'TO', juizo_principal: 'Palmas' },

  // ─── Tribunais Eleitorais ──────────────────────────────────
  'TREAC': { sigla: 'TREAC', nome: 'Tribunal Regional Eleitoral do Acre', tipo: 'eleitoral', uf: 'AC' },
  'TREAL': { sigla: 'TREAL', nome: 'Tribunal Regional Eleitoral de Alagoas', tipo: 'eleitoral', uf: 'AL' },
  'TREAP': { sigla: 'TREAP', nome: 'Tribunal Regional Eleitoral do Amapá', tipo: 'eleitoral', uf: 'AP' },
  'TREAM': { sigla: 'TREAM', nome: 'Tribunal Regional Eleitoral do Amazonas', tipo: 'eleitoral', uf: 'AM' },
  'TREBA': { sigla: 'TREBA', nome: 'Tribunal Regional Eleitoral da Bahia', tipo: 'eleitoral', uf: 'BA' },
  'TREDF': { sigla: 'TREDF', nome: 'Tribunal Regional Eleitoral do Distrito Federal', tipo: 'eleitoral', uf: 'DF' },
  'TREES': { sigla: 'TREES', nome: 'Tribunal Regional Eleitoral do Espírito Santo', tipo: 'eleitoral', uf: 'ES' },
  'TREG': { sigla: 'TREG', nome: 'Tribunal Regional Eleitoral de Goiás', tipo: 'eleitoral', uf: 'GO' },
  'TRMA': { sigla: 'TRMA', nome: 'Tribunal Regional Eleitoral do Maranhão', tipo: 'eleitoral', uf: 'MA' },
  'TREMG': { sigla: 'TREMG', nome: 'Tribunal Regional Eleitoral de Minas Gerais', tipo: 'eleitoral', uf: 'MG' },
  'TREMS': { sigla: 'TREMS', nome: 'Tribunal Regional Eleitoral de Mato Grosso do Sul', tipo: 'eleitoral', uf: 'MS' },
  'TEMT': { sigla: 'TEMT', nome: 'Tribunal Regional Eleitoral de Mato Grosso', tipo: 'eleitoral', uf: 'MT' },
  'TREPA': { sigla: 'TREPA', nome: 'Tribunal Regional Eleitoral do Pará', tipo: 'eleitoral', uf: 'PA' },
  'TREPB': { sigla: 'TREPB', nome: 'Tribunal Regional Eleitoral da Paraíba', tipo: 'eleitoral', uf: 'PB' },
  'TREPR': { sigla: 'TREPR', nome: 'Tribunal Regional Eleitoral do Paraná', tipo: 'eleitoral', uf: 'PR' },
  'TREPE': { sigla: 'TREPE', nome: 'Tribunal Regional Eleitoral de Pernambuco', tipo: 'eleitoral', uf: 'PE' },
  'TREPI': { sigla: 'TREPI', nome: 'Tribunal Regional Eleitoral do Piauí', tipo: 'eleitoral', uf: 'PI' },
  'TRERJ': { sigla: 'TRERJ', nome: 'Tribunal Regional Eleitoral do Rio de Janeiro', tipo: 'eleitoral', uf: 'RJ' },
  'TRERN': { sigla: 'TRERN', nome: 'Tribunal Regional Eleitoral do Rio Grande do Norte', tipo: 'eleitoral', uf: 'RN' },
  'TRERS': { sigla: 'TRERS', nome: 'Tribunal Regional Eleitoral do Rio Grande do Sul', tipo: 'eleitoral', uf: 'RS' },
  'TRERO': { sigla: 'TRERO', nome: 'Tribunal Regional Eleitoral de Rondônia', tipo: 'eleitoral', uf: 'RO' },
  'TRERR': { sigla: 'TRERR', nome: 'Tribunal Regional Eleitoral de Roraima', tipo: 'eleitoral', uf: 'RR' },
  'TRESP': { sigla: 'TRESP', nome: 'Tribunal Regional Eleitoral de São Paulo', tipo: 'eleitoral', uf: 'SP' },
  'TRESEAO': { sigla: 'TRESEAO', nome: 'Tribunal Regional Eleitoral de Sergipe', tipo: 'eleitoral', uf: 'SE' },
  'TRESC': { sigla: 'TRESC', nome: 'Tribunal Regional Eleitoral de Santa Catarina', tipo: 'eleitoral', uf: 'SC' },
  'TRETO': { sigla: 'TRETO', nome: 'Tribunal Regional Eleitoral de Tocantins', tipo: 'eleitoral', uf: 'TO' },

  // ─── Cortes Superiores ─────────────────────────────────────
  'STF': { sigla: 'STF', nome: 'Supremo Tribunal Federal', tipo: 'superior', juizo_principal: 'Brasília' },
  'STJ': { sigla: 'STJ', nome: 'Superior Tribunal de Justiça', tipo: 'superior', juizo_principal: 'Brasília' },
  'TST': { sigla: 'TST', nome: 'Tribunal Superior do Trabalho', tipo: 'superior', juizo_principal: 'Brasília' },
  'TSE': { sigla: 'TSE', nome: 'Tribunal Superior Eleitoral', tipo: 'superior', juizo_principal: 'Brasília' }
};

/**
 * Normaliza tribunal por sigla com múltiplas estratégias
 */
export function normalizarTribunalPorSigla(sigla: string): TribunalNormalizado | null {
  if (!sigla) return null;
  const normSigla = String(sigla).toUpperCase().trim();
  
  // Estratégia 1: Match exato (case-insensitive)
  const exactMatch = Object.entries(TRIBUNAIS_DB).find(
    ([_, tribunal]) => tribunal.sigla === normSigla
  );
  if (exactMatch) {
    return { ...exactMatch[1] };
  }
  
  // Estratégia 2: Remover caracteres especiais e tentar novamente
  const semEspeciais = normSigla.replace(/[^A-Z0-9]/g, '');
  if (semEspeciais !== normSigla) {
    const cleanMatch = Object.entries(TRIBUNAIS_DB).find(
      ([_, tribunal]) => tribunal.sigla === semEspeciais
    );
    if (cleanMatch) {
      return { ...cleanMatch[1] };
    }
  }
  
  // Estratégia 3: Match por prefixo exato (ex: TJ → TJSP, TJRJ, etc)
  const prefixMatch = Object.entries(TRIBUNAIS_DB).find(
    ([_, tribunal]) => tribunal.sigla.startsWith(normSigla) && normSigla.length >= 2
  );
  if (prefixMatch) {
    console.log(`[normalizarTribunalPorSigla] ${sigla} → ${prefixMatch[1].sigla} (match por prefixo)`);
    return { ...prefixMatch[1] };
  }
  
  // Estratégia 4: Busca por nome completo contendo
  const nameMatch = Object.entries(TRIBUNAIS_DB).find(
    ([_, tribunal]) => tribunal.nome.toUpperCase().includes(normSigla) && normSigla.length >= 3
  );
  if (nameMatch) {
    console.log(`[normalizarTribunalPorSigla] ${sigla} → ${nameMatch[1].sigla} (match por nome)`);
    return { ...nameMatch[1] };
  }
  
  // Estratégia 5: Busca por UF (ex: SP → TJSP)
  if (normSigla.length === 2) {
    const ufMatch = Object.entries(TRIBUNAIS_DB).find(
      ([_, tribunal]) => tribunal.uf === normSigla && tribunal.tipo === 'estadual'
    );
    if (ufMatch) {
      console.log(`[normalizarTribunalPorSigla] ${sigla} → ${ufMatch[1].sigla} (match por UF)`);
      return { ...ufMatch[1] };
    }
  }
  
  console.warn(`[normalizarTribunalPorSigla] Nenhuma correspondência encontrada para: "${sigla}"`);
  return null;
}

/**
 * Extrai UF de tribunal (ex: TJSP → SP)
 */
export function extrairUFdeTribunal(tribunal: string): string | null {
  const norm = normalizarTribunalPorSigla(tribunal);
  return norm?.uf || null;
}

/**
 * Identifica tipo de tribunal
 */
export function identificarTipoDeTribunal(tribunal: string): string {
  const norm = normalizarTribunalPorSigla(tribunal);
  return norm?.tipo || 'desconhecido';
}

/**
 * Valida se é TRE (Tribunal Regional Eleitoral)
 */
export function ehTRE(tribunal: string): boolean {
  return (tribunal || '').toUpperCase().startsWith('TRE');
}

/**
 * Valida se é tribunal superior (STF, STJ, TST, TSE)
 */
export function ehTribunalSuperior(tribunal: string): boolean {
  const sigla = (tribunal || '').toUpperCase().trim();
  return ['STF', 'STJ', 'TST', 'TSE'].includes(sigla);
}