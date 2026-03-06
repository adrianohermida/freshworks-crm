// Serviço de cálculo de prazos legais (modular, reutilizável)

function isBusinessDay(date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function isPublicHoliday(date) {
  // Feriados nacionais brasileiros (fixos)
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const fixedHolidays = [
    { month: 1, day: 1 },   // Ano Novo
    { month: 4, day: 21 },  // Tiradentes
    { month: 5, day: 1 },   // Dia do Trabalho
    { month: 9, day: 7 },   // Independência
    { month: 10, day: 12 }, // Nossa Senhora Aparecida
    { month: 11, day: 2 },  // Finados
    { month: 11, day: 20 }, // Consciência Negra
    { month: 12, day: 25 }  // Natal
  ];

  return fixedHolidays.some(h => h.month === month && h.day === day);
}

export function calculateLegalDeadline(publicationDate, businessDaysCount = 15) {
  const startDate = new Date(publicationDate);
  startDate.setHours(0, 0, 0, 0);
  
  let currentDate = new Date(startDate);
  let daysCount = 0;

  while (daysCount < businessDaysCount) {
    currentDate.setDate(currentDate.getDate() + 1);
    
    if (isBusinessDay(currentDate) && !isPublicHoliday(currentDate)) {
      daysCount++;
    }
  }

  return currentDate;
}

export function getDaysUntilDeadline(deadlineDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const deadline = new Date(deadlineDate);
  deadline.setHours(0, 0, 0, 0);
  
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function isDeadlineOverdue(deadlineDate) {
  return getDaysUntilDeadline(deadlineDate) < 0;
}

export function formatDeadlineForDisplay(deadlineDate) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(deadlineDate).toLocaleDateString('pt-BR', options);
}

// Tipos de prazos customizáveis
export const PRAZO_TIPOS = {
  QUINZE_DIAS_UTEIS: { dias: 15, nome: '15 dias úteis' },
  CINCO_DIAS_UTEIS: { dias: 5, nome: '5 dias úteis' },
  DEZ_DIAS_UTEIS: { dias: 10, nome: '10 dias úteis' },
  TRINTA_DIAS_UTEIS: { dias: 30, nome: '30 dias úteis' }
};