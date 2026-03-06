/**
 * DataValidator - Utilities for data validation and sanitization
 * Ensures data integrity before display
 */

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[\d\s\-\(\)]+$/;
  return phone.length >= 10 && regex.test(phone);
};

export const validateCNJ = (cnj) => {
  // CNJ format: NNNNNNNDDMMAAAAJTTOOOO
  const regex = /^\d{20}$/;
  return regex.test(cnj?.toString().replace(/\D/g, '') || '');
};

export const sanitizeHTML = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const formatCNJ = (cnj) => {
  const clean = cnj?.toString().replace(/\D/g, '') || '';
  if (!validateCNJ(clean)) return cnj;
  return `${clean.slice(0, 7)}-${clean.slice(7, 9)}.${clean.slice(9, 13)}.${clean.slice(13, 17)}.${clean.slice(17)}`;
};

export const formatDate = (date, locale = 'pt-BR') => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const calculateDaysUntil = (deadline) => {
  if (!isValidDate(new Date(deadline))) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  target.setHours(0, 0, 0, 0);
  return Math.floor((target - today) / (1000 * 60 * 60 * 24));
};

export const getDeadlineStatus = (days) => {
  if (days === null) return 'invalid';
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days <= 3) return 'critical';
  if (days <= 7) return 'warning';
  return 'ok';
};

export const validateProcessData = (process) => {
  const errors = [];
  
  if (!process.title || process.title.trim() === '') {
    errors.push('Título do processo é obrigatório');
  }
  
  if (process.deadline_date && !isValidDate(new Date(process.deadline_date))) {
    errors.push('Data de prazo inválida');
  }
  
  if (process.status && !['active', 'archived', 'paused', 'completed'].includes(process.status)) {
    errors.push('Status inválido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const groupByDate = (items, dateField = 'timestamp') => {
  const grouped = {};
  
  items.forEach(item => {
    const date = new Date(item[dateField]).toLocaleDateString('pt-BR');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });
  
  return grouped;
};