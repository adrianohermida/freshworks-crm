/**
 * Processos Service
 * Serviço consolidado para operações CRUD + queries de ProcessoCEJUSC
 */

import { base44 } from '@/api/base44Client';
import { processoSearchFields } from '../domain/schema';

class ProcessosService {
  /**
   * Listar processos com filtros
   */
  async listProcessos(filters = {}, limit = 500) {
    try {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.tipo) query.tipo = filters.tipo;
      if (filters.cliente_id) query.cliente_id = filters.cliente_id;
      
      return await base44.entities.ProcessoCEJUSC.filter(query, '-created_date', limit);
    } catch (error) {
      console.error('Erro ao listar processos:', error);
      throw error;
    }
  }

  /**
   * Listar processos por cliente
   */
  async listProcessosByCliente(clienteId, limit = 100) {
    try {
      return await base44.entities.ProcessoCEJUSC.filter(
        { cliente_id: clienteId },
        '-created_date',
        limit
      );
    } catch (error) {
      console.error('Erro ao listar processos por cliente:', error);
      throw error;
    }
  }

  /**
   * Listar processos por consultor
   */
  async listProcessosByConsultor(consultorEmail, limit = 100) {
    try {
      return await base44.entities.ProcessoCEJUSC.filter(
        { consultor_responsavel_email: consultorEmail },
        '-created_date',
        limit
      );
    } catch (error) {
      console.error('Erro ao listar processos por consultor:', error);
      throw error;
    }
  }

  /**
   * Filtrar processos por termo de busca
   */
  filterBySearchTerm(processos, searchTerm) {
    if (!searchTerm) return processos;
    
    const term = searchTerm.toLowerCase();
    return processos.filter(processo =>
      processoSearchFields.some(field => 
        String(processo[field] || '').toLowerCase().includes(term)
      )
    );
  }

  /**
   * Filtrar processos por múltiplos critérios
   */
  filterByCriteria(processos, searchTerm, filters) {
    let filtered = this.filterBySearchTerm(processos, searchTerm);

    if (filters?.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters?.tipo) {
      filtered = filtered.filter(p => p.tipo === filters.tipo);
    }

    if (filters?.tribunal) {
      filtered = filtered.filter(p => p.tribunal === filters.tribunal);
    }

    return filtered;
  }

  /**
   * Criar novo processo
   */
  async createProcesso(data) {
    try {
      return await base44.entities.ProcessoCEJUSC.create(data);
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      throw error;
    }
  }

  /**
   * Atualizar processo
   */
  async updateProcesso(id, data) {
    try {
      return await base44.entities.ProcessoCEJUSC.update(id, data);
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
      throw error;
    }
  }

  /**
   * Deletar processo
   */
  async deleteProcesso(id) {
    try {
      return await base44.entities.ProcessoCEJUSC.delete(id);
    } catch (error) {
      console.error('Erro ao deletar processo:', error);
      throw error;
    }
  }

  /**
   * Obter processo por ID
   */
  async getProcessoById(id) {
    try {
      const processos = await base44.entities.ProcessoCEJUSC.list();
      return processos.find(p => p.id === id);
    } catch (error) {
      console.error('Erro ao obter processo:', error);
      throw error;
    }
  }

  /**
   * Obter processo por número CNJ
   */
  async getProcessoByNumero(numeroCNJ) {
    try {
      const processos = await base44.entities.ProcessoCEJUSC.filter({ numero_processo: numeroCNJ });
      return processos?.[0] || null;
    } catch (error) {
      console.error('Erro ao obter processo por número:', error);
      throw error;
    }
  }

  /**
   * Deletar múltiplos processos (bulk)
   */
  async deleteMultiple(ids) {
    try {
      return await Promise.all(ids.map(id => this.deleteProcesso(id)));
    } catch (error) {
      console.error('Erro ao deletar múltiplos processos:', error);
      throw error;
    }
  }

  /**
   * Sincronizar processo com DataJud
   */
  async syncProcessoDataJud(numeroCNJ) {
    try {
      const response = await base44.functions.invoke('consultarDataJud', {
        numero_processo: numeroCNJ
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao sincronizar com DataJud:', error);
      throw error;
    }
  }
}

export const processosService = new ProcessosService();