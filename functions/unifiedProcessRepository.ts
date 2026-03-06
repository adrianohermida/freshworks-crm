import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * UNIFIED PROCESS REPOSITORY
 * Base compartilhada de processos entre contas de usuário
 * Isolamento multi-tenant APENAS em: Prazos, Publicações, Clientes, Comunicação
 */

class UnifiedProcessRepository {
  constructor(base44) {
    this.base44 = base44;
  }

  /**
   * Cria ou atualiza processo na base unificada
   * NÃO isolado por usuário - compartilhado entre contas
   */
  async upsertProcess(processData) {
    try {
      const {
        cnj_number,
        title,
        status,
        parsed_tribunal,
        parsed_segment,
        parsed_year,
        parsed_data,
        datajud_data,
        notes
      } = processData;

      // Validar CNJ
      if (!cnj_number || !this.validateCNJ(cnj_number)) {
        return { error: 'Invalid CNJ number', success: false };
      }

      // Procurar processo existente na base unificada
      const existingProcess = await this.base44.asServiceRole.entities.Process.filter({
        cnj_number
      }, null, 1);

      if (existingProcess.length > 0) {
        // Atualizar
        const updated = await this.base44.asServiceRole.entities.Process.update(
          existingProcess[0].id,
          {
            title: title || existingProcess[0].title,
            status: status || existingProcess[0].status,
            parsed_data: parsed_data || existingProcess[0].parsed_data,
            datajud_data: datajud_data || existingProcess[0].datajud_data,
            notes: notes || existingProcess[0].notes,
            synced_at: new Date().toISOString()
          }
        );

        return {
          success: true,
          action: 'updated',
          cnj_number,
          process_id: updated.id,
          message: 'Processo atualizado na base unificada'
        };
      } else {
        // Criar novo
        const created = await this.base44.asServiceRole.entities.Process.create({
          cnj_number,
          title: title || `Processo ${cnj_number}`,
          status: status || 'active',
          parsed_tribunal,
          parsed_segment,
          parsed_year,
          parsed_data,
          datajud_data,
          notes,
          synced_at: new Date().toISOString()
        });

        return {
          success: true,
          action: 'created',
          cnj_number,
          process_id: created.id,
          message: 'Processo criado na base unificada'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Recupera processo da base unificada por CNJ
   * Qualquer usuário pode acessar processos compartilhados
   */
  async getProcessByCNJ(cnj_number) {
    try {
      const processes = await this.base44.asServiceRole.entities.Process.filter({
        cnj_number
      }, '-synced_at', 1);

      if (processes.length === 0) {
        return { error: 'Process not found', success: false };
      }

      return {
        success: true,
        process: processes[0],
        message: 'Processo recuperado da base unificada'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Lista processos acessíveis ao usuário
   * Inclui: processos da base unificada + prazos/publicações isolados do usuário
   */
  async getUserProcesses(user_email, filters = {}) {
    try {
      // 1. Buscar processos da base unificada
      const processQuery = {};
      if (filters.status) processQuery.status = filters.status;
      if (filters.tribunal) processQuery.parsed_tribunal = filters.tribunal;

      const allProcesses = await this.base44.asServiceRole.entities.Process.filter(
        processQuery,
        '-synced_at',
        100
      );

      // 2. Para cada processo, recuperar prazos e publicações do usuário
      const userProcesses = await Promise.all(
        allProcesses.map(async (proc) => {
          const deadlines = await this.base44.entities.Deadline.filter({
            process_id: proc.id,
            user_id: user_email
          });

          const publications = await this.base44.entities.Publication.filter({
            process_id: proc.id,
            user_id: user_email
          });

          return {
            ...proc,
            deadlines,
            publications,
            deadline_count: deadlines.length,
            publication_count: publications.length
          };
        })
      );

      return {
        success: true,
        total: userProcesses.length,
        processes: userProcesses,
        message: 'Processos recuperados com dados isolados do usuário'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Cria prazo para um processo (ISOLADO por usuário)
   */
  async createDeadline(user_email, process_id, deadlineData) {
    try {
      const deadline = await this.base44.entities.Deadline.create({
        user_id: user_email,
        process_id,
        title: deadlineData.title,
        deadline_date: deadlineData.deadline_date,
        priority: deadlineData.priority || 'medium',
        status: 'pending'
      });

      return {
        success: true,
        deadline_id: deadline.id,
        message: 'Prazo criado (isolado por usuário)'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Cria publicação para um processo (ISOLADA por usuário)
   */
  async createPublication(user_email, process_id, publicationData) {
    try {
      const publication = await this.base44.entities.Publication.create({
        user_id: user_email,
        process_id,
        title: publicationData.title,
        publication_date: publicationData.publication_date,
        dj: publicationData.dj,
        content: publicationData.content,
        status: 'pending'
      });

      return {
        success: true,
        publication_id: publication.id,
        message: 'Publicação criada (isolada por usuário)'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Valida formato CNJ
   */
  validateCNJ(cnj) {
    // Formato: NNNNNNN-DD.AAAA.J.TT.OOOO.SSSSSSSS
    const pattern = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}\.\d{8}$/;
    return pattern.test(cnj);
  }

  /**
   * Estatísticas da base unificada
   */
  async getRepositoryStats() {
    try {
      const allProcesses = await this.base44.asServiceRole.entities.Process.list();
      
      const stats = {
        total_processes: allProcesses.length,
        by_status: {
          active: allProcesses.filter(p => p.status === 'active').length,
          archived: allProcesses.filter(p => p.status === 'archived').length,
          paused: allProcesses.filter(p => p.status === 'paused').length,
          synchronized_error: allProcesses.filter(p => p.status === 'synchronized_error').length
        },
        by_segment: {},
        last_sync: allProcesses[0]?.synced_at || null
      };

      // Agrupar por segmento
      allProcesses.forEach(p => {
        if (p.parsed_segment) {
          stats.by_segment[p.parsed_segment] = (stats.by_segment[p.parsed_segment] || 0) + 1;
        }
      });

      return {
        success: true,
        stats,
        message: 'Estatísticas da base unificada'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Deno Server Handler
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, process_data, cnj_number, deadline_data, publication_data } = body;

    const repo = new UnifiedProcessRepository(base44);
    let result;

    switch (action) {
      case 'upsert_process':
        result = await repo.upsertProcess(process_data);
        break;

      case 'get_process':
        result = await repo.getProcessByCNJ(cnj_number);
        break;

      case 'list_user_processes':
        result = await repo.getUserProcesses(user.email);
        break;

      case 'create_deadline':
        result = await repo.createDeadline(user.email, body.process_id, deadline_data);
        break;

      case 'create_publication':
        result = await repo.createPublication(user.email, body.process_id, publication_data);
        break;

      case 'stats':
        result = await repo.getRepositoryStats();
        break;

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});