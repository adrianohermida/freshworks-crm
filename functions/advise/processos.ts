/**
 * ProcessoService - Gerencia operações com Processos via API Advise
 * Endpoints: Consultar, Registrar, Movimentos, Anexos, Apensos, etc
 */

class ProcessoService {
  constructor(client) {
    this.client = client;
  }

  /**
   * Consulta processos registrados do cliente
   * GET /core/v1/processo-cliente
   */
  async consultarProcessos(params = {}) {
    const queryParams = new URLSearchParams({
      registrosPorPagina: params.registrosPorPagina || 50,
      paginaAtual: params.paginaAtual || 1,
      ...params
    });

    console.log('[ProcessoService] Consultando processos:', queryParams.toString());

    try {
      const response = await this.client.request(
        'GET',
        `core/v1/processo-cliente?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('[ProcessoService] Erro ao consultar processos:', error);
      throw error;
    }
  }

  /**
   * Registra novo processo
   * POST /core/v1/processo-cliente
   */
  async registrarProcesso(dados) {
    if (!dados.numeroProcesso) {
      throw new Error('numeroProcesso é obrigatório');
    }

    console.log('[ProcessoService] Registrando processo:', dados.numeroProcesso);

    try {
      const response = await this.client.request(
        'POST',
        'core/v1/processo-cliente',
        dados
      );
      return response;
    } catch (error) {
      console.error('[ProcessoService] Erro ao registrar processo:', error);
      throw error;
    }
  }

  /**
   * Consulta movimentos de um processo
   * GET /core/v1/movimento-processo-cliente
   */
  async consultarMovimentos(numeroProcesso, params = {}) {
    if (!numeroProcesso) {
      throw new Error('numeroProcesso é obrigatório');
    }

    const queryParams = new URLSearchParams({
      numeroProcesso,
      registrosPorPagina: params.registrosPorPagina || 50,
      paginaAtual: params.paginaAtual || 1,
      ...params
    });

    console.log('[ProcessoService] Consultando movimentos:', numeroProcesso);

    try {
      const response = await this.client.request(
        'GET',
        `core/v1/movimento-processo-cliente?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('[ProcessoService] Erro ao consultar movimentos:', error);
      throw error;
    }
  }

  /**
   * Marca movimento como lido
   * PUT /core/v1/movimento-processo-cliente-lido/marcar
   */
  async marcarMovimentoLido(idMovimento) {
    if (!idMovimento) {
      throw new Error('idMovimento é obrigatório');
    }

    console.log('[ProcessoService] Marcando movimento como lido:', idMovimento);

    try {
      const response = await this.client.request(
        'PUT',
        'core/v1/movimento-processo-cliente-lido/marcar',
        { idMovimento }
      );
      return response;
    } catch (error) {
      console.error('[ProcessoService] Erro ao marcar movimento como lido:', error);
      throw error;
    }
  }

  /**
   * Consulta anexos de um processo
   * GET /core/v1/anexo-processo
   */
  async consultarAnexos(numeroProcesso, params = {}) {
    if (!numeroProcesso) {
      throw new Error('numeroProcesso é obrigatório');
    }

    const queryParams = new URLSearchParams({
      numeroProcesso,
      registrosPorPagina: params.registrosPorPagina || 100,
      paginaAtual: params.paginaAtual || 1,
      ...params
    });

    console.log('[ProcessoService] Consultando anexos:', numeroProcesso);

    try {
      const response = await this.client.request(
        'GET',
        `core/v1/anexo-processo?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('[ProcessoService] Erro ao consultar anexos:', error);
      throw error;
    }
  }

  /**
   * Gera URL de download para anexo
   * POST /core/v1/anexo-processo/gerar-url-download
   */
  async gerarUrlDownloadAnexo(idAnexo) {
    if (!idAnexo) {
      throw new Error('idAnexo é obrigatório');
    }

    console.log('[ProcessoService] Gerando URL de download:', idAnexo);

    try {
      const response = await this.client.request(
        'POST',
        'core/v1/anexo-processo/gerar-url-download',
        { idAnexo }
      );
      return response;
    } catch (error) {
      console.error('[ProcessoService] Erro ao gerar URL:', error);
      throw error;
    }
  }

  /**
   * Consulta apensos de um processo
   * GET /core/v1/apensamento
   */
  async consultarApensos(numeroProcesso, params = {}) {
    if (!numeroProcesso) {
      throw new Error('numeroProcesso é obrigatório');
    }

    const queryParams = new URLSearchParams({
      numeroProcesso,
      registrosPorPagina: params.registrosPorPagina || 50,
      paginaAtual: params.paginaAtual || 1,
      ...params
    });

    console.log('[ProcessoService] Consultando apensos:', numeroProcesso);

    try {
      const response = await this.client.request(
        'GET',
        `core/v1/apensamento?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('[ProcessoService] Erro ao consultar apensos:', error);
      throw error;
    }
  }

  /**
   * Consulta cabecalho (header) do processo
   * GET /core/v1/cabecalho-processo
   */
  async consultarCabecalho(numeroProcesso) {
    if (!numeroProcesso) {
      throw new Error('numeroProcesso é obrigatório');
    }

    console.log('[ProcessoService] Consultando cabecalho:', numeroProcesso);

    try {
      const response = await this.client.request(
        'GET',
        `core/v1/cabecalho-processo?numeroProcesso=${numeroProcesso}`
      );
      return response;
    } catch (error) {
      console.error('[ProcessoService] Erro ao consultar cabecalho:', error);
      throw error;
    }
  }

  /**
   * Marca múltiplos movimentos como lidos em bulk
   */
  async marcarMovimentosBulk(idMovimentos = []) {
    if (!Array.isArray(idMovimentos) || idMovimentos.length === 0) {
      throw new Error('idMovimentos deve ser um array não vazio');
    }

    console.log('[ProcessoService] Marcando bulk:', idMovimentos.length, 'movimentos');

    try {
      const promises = idMovimentos.map(id => this.marcarMovimentoLido(id));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      console.log('[ProcessoService] Bulk result:', { successful, failed });

      return { successful, failed, results };
    } catch (error) {
      console.error('[ProcessoService] Erro no bulk mark:', error);
      throw error;
    }
  }
}

export { ProcessoService };