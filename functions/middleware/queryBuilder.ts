/**
 * Query Builder com RLS integrado
 * Constrói queries seguras com isolamento multitenant
 */

export class QueryBuilder {
  constructor(userId, isAdmin = false) {
    this.userId = userId;
    this.isAdmin = isAdmin;
    this.filters = {};
  }

  // Adiciona RLS automaticamente
  withRLS() {
    if (!this.isAdmin) {
      this.filters.created_by = this.userId;
    }
    return this;
  }

  // Adiciona filtros customizados
  where(field, value) {
    this.filters[field] = value;
    return this;
  }

  // Combina múltiplos filtros
  withFilters(customFilters = {}) {
    this.filters = { ...this.filters, ...customFilters };
    return this;
  }

  // Retorna filtros prontos
  build() {
    return this.filters;
  }

  // Helper: filtro por process_id
  byProcess(processId) {
    this.filters.process_id = processId;
    return this;
  }

  // Helper: filtro por status
  byStatus(status) {
    this.filters.status = status;
    return this;
  }

  // Helper: filtro por data
  byDateRange(startDate, endDate) {
    this.filters.date_from = startDate;
    this.filters.date_to = endDate;
    return this;
  }
}

/**
 * Exemplo de uso:
 * 
 * const query = new QueryBuilder(userEmail, isAdmin)
 *   .withRLS()
 *   .byStatus('active')
 *   .byDateRange('2024-01-01', '2024-12-31')
 *   .build();
 * 
 * // Result: { created_by: 'user@example.com', status: 'active', date_from: '2024-01-01', date_to: '2024-12-31' }
 */