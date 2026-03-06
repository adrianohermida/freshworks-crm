/**
 * FreshdeskClient - Cliente HTTP para API Freshdesk
 * Handles authentication and basic request/response processing
 */

export class FreshdeskClient {
  constructor(apiKey, domain = 'freshdesk') {
    this.apiKey = apiKey;
    this.baseUrl = `https://${domain}.freshdesk.com/api/v2`;
    this.timeout = 30000; // 30 segundos
  }

  /**
   * Fazer requisição GET
   * @param {string} path - Caminho do endpoint (ex: /tickets)
   * @returns {Promise<Object>} Resposta da API
   */
  async get(path) {
    return this.request('GET', path);
  }

  /**
   * Fazer requisição PUT
   * @param {string} path - Caminho do endpoint
   * @param {Object} body - Corpo da requisição
   * @returns {Promise<Object>} Resposta da API
   */
  async put(path, body) {
    return this.request('PUT', path, body);
  }

  /**
   * Fazer requisição POST
   * @param {string} path - Caminho do endpoint
   * @param {Object} body - Corpo da requisição
   * @returns {Promise<Object>} Resposta da API
   */
  async post(path, body) {
    return this.request('POST', path, body);
  }

  /**
   * Fazer requisição HTTP genérica
   * @private
   */
  async request(method, path, body = null) {
    const url = `${this.baseUrl}${path}`;
    
    const options = {
      method,
      headers: {
        'Authorization': `Basic ${btoa(this.apiKey + ':x')}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(this.timeout)
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      console.log(`[FreshdeskClient] ${method} ${path}`);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`[FreshdeskClient] Erro ${response.status}:`, errorData);
        throw new Error(`Freshdesk API ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log('[FreshdeskClient] Sucesso');
      return data;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('[FreshdeskClient] Timeout na requisição');
        throw new Error('Freshdesk API timeout');
      }
      console.error('[FreshdeskClient] Erro na requisição:', error.message);
      throw error;
    }
  }
}