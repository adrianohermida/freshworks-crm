/**
 * AlertaService
 * 
 * Gerencia operações relacionadas a alertas e notificações
 * - Criar alertas automáticos por prazos
 * - Listar alertas pendentes
 * - Marcar como lido
 * - Resolver/Fechar
 * - Sincronizar inteligentemente
 */

class AlertaService {
  constructor(adviseClient) {
    this.adviseClient = adviseClient;
  }

  /**
   * Consultar Alertas Pendentes
   * Lista todos os alertas que ainda não foram resolvidos
   */
  async consultarAlertasPendentes() {
    try {
      const response = await this.adviseClient.get('/alertas/pendentes');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao consultar alertas:', error);
      return [];
    }
  }

  /**
   * Criar Alerta
   * Cria um novo alerta para um processo
   */
  async criarAlerta(dadosAlerta) {
    const {
      numeroProcesso,
      tipo,
      descricao,
      dataVencimento,
      severidade = 'media',
      acoesSugeridas = []
    } = dadosAlerta;

    try {
      const response = await this.adviseClient.post('/alertas', {
        numeroProcesso,
        tipo,
        descricao,
        dataVencimento,
        severidade,
        acoesSugeridas
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      throw error;
    }
  }

  /**
   * Marcar Alerta como Lido
   * Marca um alerta específico como lido
   */
  async marcarAlertaLido(idAlerta) {
    try {
      const response = await this.adviseClient.patch(`/alertas/${idAlerta}/lido`, {
        lido: true
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error);
      throw error;
    }
  }

  /**
   * Marcar Alertas em Lote
   * Marca múltiplos alertas como lidos
   */
  async marcarAlertasLido(idsAlertas) {
    try {
      const response = await this.adviseClient.post('/alertas/lote/lido', {
        ids: idsAlertas
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar alertas em lote:', error);
      throw error;
    }
  }

  /**
   * Resolver Alerta
   * Marca um alerta como resolvido/finalizado
   */
  async resolverAlerta(idAlerta, motivoResolucao) {
    try {
      const response = await this.adviseClient.patch(`/alertas/${idAlerta}/resolver`, {
        resolvido: true,
        motivo: motivoResolucao
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao resolver alerta:', error);
      throw error;
    }
  }

  /**
   * Listar Alertas por Processo
   * Retorna todos os alertas de um processo específico
   */
  async listarAlertasProcesso(numeroProcesso) {
    try {
      const response = await this.adviseClient.get(`/alertas/processo/${numeroProcesso}`);
      return response.data || [];
    } catch (error) {
      console.error('Erro ao listar alertas do processo:', error);
      return [];
    }
  }

  /**
   * Consultar Alertas Críticos
   * Retorna apenas alertas com severidade alta ou crítica
   */
  async consultarAlertasCriticos() {
    try {
      const response = await this.adviseClient.get('/alertas/criticos');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao consultar alertas críticos:', error);
      return [];
    }
  }

  /**
   * Sincronizar Alertas
   * Sincroniza alertas do Advise com a base local
   */
  async sincronizarAlertas() {
    try {
      const pendentes = await this.consultarAlertasPendentes();
      const criticos = await this.consultarAlertasCriticos();
      
      return {
        pendentes: pendentes.length,
        criticos: criticos.length,
        total: pendentes.length + criticos.length,
        dados: {
          pendentes,
          criticos
        }
      };
    } catch (error) {
      console.error('Erro na sincronização de alertas:', error);
      throw error;
    }
  }
}

export { AlertaService };