// Barrel export for utility functions
export { sanitizeText, sanitizeEmail, sanitizeCPF, sanitizePhone, sanitizeHTML, sanitizeURL } from './sanitize';
export { default as maskPII } from './maskPII';
export { auditoriaLog } from './auditoriaLog';
export { validarConsentimento } from './validarConsentimento';
export { default as CNJParser } from '../utils/CNJParser';
export { deduplicadorAndamentos } from './deduplicadorAndamentos';
export { normalizarOrgaoJulgador } from './normalizadorTribunalCompleto';