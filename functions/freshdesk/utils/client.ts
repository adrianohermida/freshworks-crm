/**
 * Cliente HTTP para Freshdesk API
 * Handles authentication, requests, and error handling
 */
export class FreshdeskClient {
  constructor(apiKey, domain = 'supportlegaltech') {
    this.apiKey = apiKey;
    this.domain = domain;
    this.baseURL = `https://${domain}.freshdesk.com/api/v2`;
    this.timeout = 30000; // 30s timeout
  }

  /**
   * Make a GET request
   */
  async get(endpoint) {
    return this.request('GET', endpoint);
  }

  /**
   * Make a POST request
   */
  async post(endpoint, body) {
    return this.request('POST', endpoint, body);
  }

  /**
   * Make a PUT request
   */
  async put(endpoint, body) {
    return this.request('PUT', endpoint, body);
  }

  /**
   * Make a PATCH request
   */
  async patch(endpoint, body) {
    return this.request('PATCH', endpoint, body);
  }

  /**
   * Generic request handler with auth and error handling
   */
  private async request(method, endpoint, body = null) {
    const url = `${this.baseURL}${endpoint}`;
    const auth = btoa(`${this.apiKey}:X`); // Freshdesk uses Basic Auth

    const options = {
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      timeout: this.timeout,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      console.log(`[FreshdeskClient] ${method} ${endpoint}`);
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Freshdesk API Error: ${response.status} - ${errorData.description || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`[FreshdeskClient] Error: ${error.message}`);
      throw error;
    }
  }
}