/**
 * Validação de números CNJ conforme ISO 7064 (módulo 97)
 * Formato: NNNNNNN-DD.AAAA.J.TT.OOOO
 * 
 * N = número do processo (7 dígitos)
 * D = dígito verificador (2 dígitos, base 97)
 * A = ano ajuizamento (4 dígitos)
 * J = segmento judicial (1 dígito: 1-9)
 * T = tribunal (2 dígitos: 00-27)
 * O = código origem/foro (4 dígitos: 0000-9999)
 */

/**
 * Limpa número CNJ removendo pontuação
 */
export function limparCNJ(cnj: string | number): string {
  return String(cnj || '').replace(/\D/g, '').slice(0, 20);
}

/**
 * Formata número CNJ com pontuação padrão
 * Entrada: 20 dígitos
 * Saída: NNNNNNN-DD.AAAA.J.TT.OOOO
 */
export function formatarCNJ(digits: string): string {
  if (digits.length !== 20) return digits;
  return `${digits.slice(0, 7)}-${digits.slice(7, 9)}.${digits.slice(9, 13)}.${digits.slice(13, 14)}.${digits.slice(14, 16)}.${digits.slice(16, 20)}`;
}

/**
 * Calcula dígito verificador CNJ via ISO 7064 (módulo 97)
 * 
 * Fórmula: 98 - ((numero % 97) + (anoSeg % 97)) % 97
 * 
 * @param nnnnnnn Número do processo (7 dígitos)
 * @param aaaa Ano de ajuizamento (4 dígitos)
 * @param j Segmento judicial (1 dígito)
 * @param tt Tribunal (2 dígitos)
 * @param oooo Código origem (4 dígitos)
 * @returns Dígito verificador de 2 dígitos
 */
export function calcularDigitoVerificador(
  nnnnnnn: number,
  aaaa: number,
  j: number,
  tt: number,
  oooo: number
): number {
  const base = `${String(nnnnnnn).padStart(7, '0')}${String(aaaa).padStart(4, '0')}${String(j)}${String(tt).padStart(2, '0')}${String(oooo).padStart(4, '0')}00`;
  const resto = BigInt(base) % 97n;
  const dv = 98 - Number(resto);
  return dv === 0 ? 97 : dv;
}

/**
 * Valida número CNJ completo (20 dígitos)
 * Verifica formato e dígito verificador
 * 
 * @param cnj Número CNJ com ou sem pontuação
 * @returns boolean
 */
export function ehCNJValido(cnj: string | number): boolean {
  const digitos = limparCNJ(cnj);
  
  if (digitos.length !== 20) return false;
  
  // Extrair componentes
  const nnnnnnn = parseInt(digitos.slice(0, 7), 10);
  const dd = parseInt(digitos.slice(7, 9), 10);
  const aaaa = parseInt(digitos.slice(9, 13), 10);
  const j = parseInt(digitos.slice(13, 14), 10);
  const tt = parseInt(digitos.slice(14, 16), 10);
  const oooo = parseInt(digitos.slice(16, 20), 10);
  
  // Validações básicas
  if (j < 1 || j > 9) return false;           // Segmento inválido
  if (tt < 0 || tt > 27) return false;         // Tribunal inválido
  if (aaaa < 1900 || aaaa > 2100) return false; // Ano inválido
  
  // Calcular dígito esperado
  const ddEsperado = calcularDigitoVerificador(nnnnnnn, aaaa, j, tt, oooo);
  
  return dd === ddEsperado;
}

/**
 * Extrai e valida componentes do CNJ
 */
export function extrairCamposCNJ(cnj: string | number) {
  const digitos = limparCNJ(cnj);
  const valido = ehCNJValido(cnj);
  
  if (digitos.length !== 20) {
    return {
      numeroProcesso: digitos,
      digitoVerificador: 0,
      anoAjuizamento: 0,
      segmentoJudicial: 0,
      tribunal: 0,
      codigoOrigem: '0000',
      formatado: digitos,
      ehValido: false,
      erro: `Número CNJ deve ter 20 dígitos, recebido: ${digitos.length}`
    };
  }
  
  return {
    numeroProcesso: digitos.slice(0, 7),
    digitoVerificador: parseInt(digitos.slice(7, 9), 10),
    anoAjuizamento: parseInt(digitos.slice(9, 13), 10),
    segmentoJudicial: parseInt(digitos.slice(13, 14), 10),
    tribunal: parseInt(digitos.slice(14, 16), 10),
    codigoOrigem: digitos.slice(16, 20),
    formatado: formatarCNJ(digitos),
    ehValido: valido,
    erro: valido ? null : 'Dígito verificador inválido',
  };
}