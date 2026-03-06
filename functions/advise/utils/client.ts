/**
 * Cliente HTTP para API Advise com tratamento de erros e logging
 */

const API_BASE = {
  production: 'https://api.advise.com.br',
  sandbox: 'https://sandbox-api.advise.com.br'
};

export class AdviseClient {
  constructor(token, environment = 'production') {
    this.token = token;
    this.baseURL = API_BASE[environment] || API_BASE.production;
    this.headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async request(method, path, body = null) {
    const url = `${this.baseURL}${path}`;
    const options = {
      method,
      headers: this.headers
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    console.log(`[AdviseClient] ${method} ${url}`);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);

      console.log(`[AdviseClient] Response: ${response.status}`);

      if (!response.ok) {
        const error = await response.text();
        throw {
          status: response.status,
          message: `[${response.status}] ${error}`,
          url
        };
      }

      const data = await response.json();
      console.log(`[AdviseClient] Data received:`, typeof data, Array.isArray(data) ? `Array(${data.length})` : 'Object');
      return data;
    } catch (err) {
      console.error(`[AdviseClient] Erro na requisição ${method} ${url}:`, err);
      throw err;
    }
  }

  get(path) {
    return this.request('GET', path);
  }

  post(path, body) {
    return this.request('POST', path, body);
  }

  put(path, body) {
    return this.request('PUT', path, body);
  }
}