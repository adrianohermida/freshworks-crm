/**
 * IntimacaoService - Gerencia operações com Intimações via API Advise
 * Endpoints: ConsultaFonteIntimacoes, Listar, Registrar, Ativar/Inativar, Marcar Lido
 */

class IntimacaoService {
  constructor(client) {
    this.client = client;
  }

  /**
   * Consulta fontes de intimação disponíveis (TJSP, STF, CNJ, etc)
   * GET /core/v1/intimacao/ConsultaFonteIntimacoes
   */
  async consultarFontes(params = {}) {
    const queryParams = new URLSearchParams({
      registrosPorPagina: params.registrosPorPagina || 100,
      paginaAtual: params.paginaAtual || 1,
      ...params
    });

    console.log('[IntimacaoService] Consultando fontes com params:', queryParams.toString());

    try {
      const response = await this.client.request(
        'GET',
        `core/v1/intimacao/ConsultaFonteIntimacoes?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('[IntimacaoService] Erro ao consultar fontes:', error);
      throw error;
    }
  }

  /**
   * Lista intimações do cliente
   * GET /core/v1/intimacoes-clientes
   */
  async listarIntimacoes(params = {}) {
    const queryParams = new URLSearchParams({
      lido: params.lido !== undefined ? String(params.lido) : 'false',
      registrosPorPagina: params.registrosPorPagina || 50,
      paginaAtual: params.paginaAtual || 1,
      ...params
    });

    console.log('[IntimacaoService] Listando intimações com params:', queryParams.toString());

    try {
      const response = await this.client.request(
        'GET',
        `core/v1/intimacoes-clientes?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('[IntimacaoService] Erro ao listar intimações:', error);
      throw error;
    }
  }

  /**
   * Registra credenciais para uma fonte de intimação
   * POST /core/v1/intimacao
   */
  async registrarCredenciais(dados) {
    if (!dados.idFonteXTipoPesquisa || !dados.dadoAcesso) {
      throw new Error('idFonteXTipoPesquisa e dadoAcesso são obrigatórios');
    }

    console.log('[IntimacaoService] Registrando credenciais para fonte:', dados.idFonteXTipoPesquisa);

    try {
      const response = await this.client.request('POST', 'core/v1/intimacao', {
        idFonteXTipoPesquisa: dados.idFonteXTipoPesquisa,
        dadoAcesso: dados.dadoAcesso,
        nomeResponsavel: dados.nomeResponsavel || 'Sistema',
        ...dados
      });
      return response;
    } catch (error) {
      console.error('[IntimacaoService] Erro ao registrar credenciais:', error);
      throw error;
    }
  }

  /**
   * Ativa pesquisa de uma fonte de intimação
   * PUT /core/v1/intimacao/ativar-pesquisa
   */
  async ativarPesquisa(idFonteXTipoPesquisa) {
    if (!idFonteXTipoPesquisa) {
      throw new Error('idFonteXTipoPesquisa é obrigatório');
    }

    console.log('[IntimacaoService] Ativando pesquisa:', idFonteXTipoPesquisa);

    try {
      const response = await this.client.request(
        'PUT',
        'core/v1/intimacao/ativar-pesquisa',
        { idFonteXTipoPesquisa }
      );
      return response;
    } catch (error) {
      console.error('[IntimacaoService] Erro ao ativar pesquisa:', error);
      throw error;
    }
  }

  /**
   * Inativa pesquisa de uma fonte de intimação
   * PUT /core/v1/intimacao/inativar-pesquisa
   */
  async inativarPesquisa(idFonteXTipoPesquisa) {
    if (!idFonteXTipoPesquisa) {
      throw new Error('idFonteXTipoPesquisa é obrigatório');
    }

    console.log('[IntimacaoService] Inativando pesquisa:', idFonteXTipoPesquisa);

    try {
      const response = await this.client.request(
        'PUT',
        'core/v1/intimacao/inativar-pesquisa',
        { idFonteXTipoPesquisa }
      );
      return response;
    } catch (error) {
      console.error('[IntimacaoService] Erro ao inativar pesquisa:', error);
      throw error;
    }
  }

  /**
   * Marca intimação como lida
   * PUT /core/v1/movimento-processo-cliente-lido/marcar
   */
  async marcarComoLida(idMovimento) {
    if (!idMovimento) {
      throw new Error('idMovimento é obrigatório');
    }

    console.log('[IntimacaoService] Marcando intimação como lida:', idMovimento);

    try {
      const response = await this.client.request(
        'PUT',
        'core/v1/movimento-processo-cliente-lido/marcar',
        { idMovimento }
      );
      return response;
    } catch (error) {
      console.error('[IntimacaoService] Erro ao marcar como lida:', error);
      throw error;
    }
  }

  /**
   * Marca múltiplas intimações como lidas em bulk
   */
  async marcarComoBulk(idMovimentos = []) {
    if (!Array.isArray(idMovimentos) || idMovimentos.length === 0) {
      throw new Error('idMovimentos deve ser um array não vazio');
    }

    console.log('[IntimacaoService] Marcando bulk:', idMovimentos.length, 'intimações');

    try {
      const promises = idMovimentos.map(id => this.marcarComoLida(id));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      console.log('[IntimacaoService] Bulk result:', { successful, failed });

      return { successful, failed, results };
    } catch (error) {
      console.error('[IntimacaoService] Erro no bulk mark:', error);
      throw error;
    }
  }
}

export { IntimacaoService };