import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * SDK Generator - Python & JavaScript
 * - Gera SDKs prontos para usar
 * - Documentação automática
 * - Exemplos de código
 * - Type definitions (TS)
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'list', language, format = 'inline' } = await req.json();

    // LIST AVAILABLE SDKs
    if (action === 'list') {
      return Response.json({
        success: true,
        sdks: [
          {
            language: 'javascript',
            version: '1.0.0',
            package: '@datajud/sdk',
            registry: 'npm',
            downloads: 12500,
            documentation: 'https://docs.datajud.io/js'
          },
          {
            language: 'python',
            version: '1.0.0',
            package: 'datajud-sdk',
            registry: 'pypi',
            downloads: 8300,
            documentation: 'https://docs.datajud.io/python'
          },
          {
            language: 'typescript',
            version: '1.0.0',
            package: '@datajud/sdk',
            registry: 'npm',
            types: 'included',
            documentation: 'https://docs.datajud.io/ts'
          }
        ]
      });
    }

    // GENERATE JAVASCRIPT SDK
    if (action === 'generate' && language === 'javascript') {
      const sdk_code = `
// @datajud/sdk - v1.0.0
// Installation: npm install @datajud/sdk

export class DataJudClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.datajud.io';
  }

  // Processos
  async getProcesses(filters = {}) {
    return this.request('GET', '/sdk/processes', { params: filters });
  }

  async getProcess(id) {
    return this.request('GET', \`/sdk/processes/\${id}\`);
  }

  async createProcess(data) {
    return this.request('POST', '/sdk/processes', { data });
  }

  async updateProcess(id, data) {
    return this.request('PUT', \`/sdk/processes/\${id}\`, { data });
  }

  // Prazos
  async getDeadlines(filters = {}) {
    return this.request('GET', '/sdk/deadlines', { params: filters });
  }

  async createDeadline(data) {
    return this.request('POST', '/sdk/deadlines', { data });
  }

  // Publicações
  async getPublications(filters = {}) {
    return this.request('GET', '/sdk/publications', { params: filters });
  }

  // Interno
  async request(method, path, options = {}) {
    const response = await fetch(\`\${this.baseURL}\${path}\`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      },
      body: options.data ? JSON.stringify(options.data) : undefined
    });

    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return response.json();
  }
}

// Exemplo de uso
const client = new DataJudClient('your-api-key');
const processes = await client.getProcesses({ tribunal: 'tjsp' });
`;

      return Response.json({
        success: true,
        language: 'javascript',
        format,
        code: format === 'file' ? { filename: 'index.js', content: sdk_code } : sdk_code,
        installation: 'npm install @datajud/sdk',
        quick_start: {
          setup: 'const client = new DataJudClient("your-api-key");',
          example: 'const processes = await client.getProcesses();'
        }
      });
    }

    // GENERATE PYTHON SDK
    if (action === 'generate' && language === 'python') {
      const sdk_code = `
# datajud-sdk - v1.0.0
# Installation: pip install datajud-sdk

import requests
from typing import Dict, List, Optional

class DataJudClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.datajud.io"
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key
        }

    # Processos
    def get_processes(self, filters: Dict = None) -> Dict:
        """Lista processos com filtros opcionais"""
        return self._request("GET", "/sdk/processes", params=filters)

    def get_process(self, process_id: str) -> Dict:
        """Obtém detalhes de um processo"""
        return self._request("GET", f"/sdk/processes/{process_id}")

    def create_process(self, data: Dict) -> Dict:
        """Cria novo processo"""
        return self._request("POST", "/sdk/processes", json=data)

    def update_process(self, process_id: str, data: Dict) -> Dict:
        """Atualiza processo"""
        return self._request("PUT", f"/sdk/processes/{process_id}", json=data)

    # Prazos
    def get_deadlines(self, filters: Dict = None) -> Dict:
        """Lista prazos"""
        return self._request("GET", "/sdk/deadlines", params=filters)

    def create_deadline(self, data: Dict) -> Dict:
        """Cria novo prazo"""
        return self._request("POST", "/sdk/deadlines", json=data)

    # Publicações
    def get_publications(self, filters: Dict = None) -> Dict:
        """Lista publicações"""
        return self._request("GET", "/sdk/publications", params=filters)

    # Interno
    def _request(self, method: str, path: str, **kwargs) -> Dict:
        url = f"{self.base_url}{path}"
        response = requests.request(
            method,
            url,
            headers=self.headers,
            **kwargs
        )
        response.raise_for_status()
        return response.json()

# Exemplo de uso
client = DataJudClient("your-api-key")
processes = client.get_processes({"tribunal": "tjsp"})
`;

      return Response.json({
        success: true,
        language: 'python',
        format,
        code: format === 'file' ? { filename: 'datajud_sdk.py', content: sdk_code } : sdk_code,
        installation: 'pip install datajud-sdk',
        quick_start: {
          setup: 'client = DataJudClient("your-api-key")',
          example: 'processes = client.get_processes()'
        }
      });
    }

    // GENERATE TYPESCRIPT TYPES
    if (action === 'generate' && language === 'typescript') {
      const types = `
// @datajud/sdk - TypeScript Definitions

export interface Process {
  id: string;
  cnj_number: string;
  title: string;
  status: 'active' | 'archived' | 'paused';
  tribunal: string;
  created_date: string;
  updated_date: string;
}

export interface Deadline {
  id: string;
  process_id: string;
  title: string;
  deadline_date: string;
  status: 'pending' | 'alert' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface Publication {
  id: string;
  process_id: string;
  title: string;
  publication_date: string;
  dj: string;
}

export interface DataJudClientOptions {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export class DataJudClient {
  constructor(options: DataJudClientOptions);
  getProcesses(filters?: Record<string, any>): Promise<Process[]>;
  getProcess(id: string): Promise<Process>;
  createProcess(data: Omit<Process, 'id' | 'created_date'>): Promise<Process>;
  updateProcess(id: string, data: Partial<Process>): Promise<Process>;
  getDeadlines(filters?: Record<string, any>): Promise<Deadline[]>;
  createDeadline(data: Omit<Deadline, 'id'>): Promise<Deadline>;
  getPublications(filters?: Record<string, any>): Promise<Publication[]>;
}
`;

      return Response.json({
        success: true,
        language: 'typescript',
        format,
        code: format === 'file' ? { filename: 'index.d.ts', content: types } : types,
        installation: 'npm install @datajud/sdk',
        note: 'Tipos inclusos automaticamente'
      });
    }

    // GENERATE DOCS
    if (action === 'docs') {
      return Response.json({
        success: true,
        documentation: {
          getting_started: 'https://docs.datajud.io/getting-started',
          api_reference: 'https://docs.datajud.io/api-reference',
          examples: 'https://docs.datajud.io/examples',
          best_practices: 'https://docs.datajud.io/best-practices',
          troubleshooting: 'https://docs.datajud.io/troubleshooting',
          github: 'https://github.com/datajud/sdk'
        }
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[SDKGenerator] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});