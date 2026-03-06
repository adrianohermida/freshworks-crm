/**
 * maskPII.js - Utilitário para redação de PII em logs (LGPD)
 * 
 * Redaciona dados pessoais sensíveis para conformidade LGPD:
 * - CPF, CNPJ
 * - Email, Telefone
 * - Nomes, Endereços
 * - Mantém integridade de números de processo
 */

const PII_PATTERNS = {
  cpf: /(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/g,
  cnpj: /(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2})/g,
  email: /[\w\.-]+@[\w\.-]+\.\w+/g,
  phone: /\+?\d{1,3}\s?\(?(\d{2,3})\)?[\s-]?(\d{4,5})[-\s]?(\d{4})/g,
  nome: /\b([A-ZÁÉÍÓÚ][a-záéíóú]+)\s+([A-ZÁÉÍÓÚ][a-záéíóú]+)\b/g,
  endereco: /[Rua|Avenida|Avenida|Pça|Praça|Trav|Travessa|Estr|Estrada|Rod|Rodovia][\s\w\d,\.]+/gi,
};

function maskCPF(cpf) {
  return cpf.replace(PII_PATTERNS.cpf, 'XXX.XXX.XXX-$4');
}

function maskCNPJ(cnpj) {
  return cnpj.replace(PII_PATTERNS.cnpj, 'XX.XXX.XXX/0000-$5');
}

function maskEmail(email) {
  return email.replace(PII_PATTERNS.email, (match) => {
    const [user, domain] = match.split('@');
    const maskedUser = user.charAt(0) + '*'.repeat(Math.max(1, user.length - 2)) + user.charAt(user.length - 1);
    return `${maskedUser}@${domain}`;
  });
}

function maskPhone(phone) {
  return phone.replace(PII_PATTERNS.phone, '+55 ($1) ****-$3');
}

function maskNome(nome) {
  return nome.replace(PII_PATTERNS.nome, (match, primeiro, ultimo) => {
    const p = primeiro.charAt(0) + '*'.repeat(primeiro.length - 1);
    const u = ultimo.charAt(0) + '*'.repeat(ultimo.length - 1);
    return `${p} ${u}`;
  });
}

function maskEndereco(text) {
  return text.replace(PII_PATTERNS.endereco, '[REDACTED_ADDRESS]');
}

/**
 * Redaciona recursivamente todos os dados pessoais em um objeto/array
 * Preserva estrutura, tipos e números de processo
 * 
 * @param {any} data - Dados a redacionar
 * @param {Set} visited - Rastreamento de ciclos
 * @returns {any} Dados redacionados
 */
export function maskPII(data, visited = new Set()) {
  if (data === null || data === undefined) return data;
  
  // Evitar ciclos infinitos
  if (typeof data === 'object' && visited.has(data)) return data;
  if (typeof data === 'object') visited.add(data);

  // String: aplicar todas as máscaras
  if (typeof data === 'string') {
    let masked = data;
    masked = maskCPF(masked);
    masked = maskCNPJ(masked);
    masked = maskEmail(masked);
    masked = maskPhone(masked);
    masked = maskNome(masked);
    masked = maskEndereco(masked);
    return masked;
  }

  // Array: mapear recursivo
  if (Array.isArray(data)) {
    return data.map(item => maskPII(item, visited));
  }

  // Objeto: redacionar valores recursivamente
  if (typeof data === 'object') {
    const masked = {};
    for (const [key, value] of Object.entries(data)) {
      // Não redacionar campos de meta-estrutura
      if (['id', 'created_date', 'updated_date', 'numero_processo', 'processo_numero'].includes(key)) {
        masked[key] = value;
      } else {
        masked[key] = maskPII(value, visited);
      }
    }
    return masked;
  }

  return data;
}

/**
 * Redaciona dados de forma superficial (apenas nível 1)
 * Para operações que não precisam redacionar nested objects
 * 
 * @param {object} data - Objeto a redacionar
 * @returns {object} Objeto com PII do nível 1 redacionado
 */
export function maskPIIShallow(data) {
  if (!data || typeof data !== 'object') return data;
  
  const masked = {};
  for (const [key, value] of Object.entries(data)) {
    if (['id', 'created_date', 'updated_date', 'numero_processo'].includes(key)) {
      masked[key] = value;
    } else if (typeof value === 'string') {
      masked[key] = maskPII(value);
    } else {
      masked[key] = value;
    }
  }
  return masked;
}

export default maskPII;