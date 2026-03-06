/**
 * Cliente ComunicaAPI (PJe) para consulta de DJE.
 *
 * Variáveis esperadas:
 * - COMUNICA_API_BASE_URL (ex: https://comunicaapi.pje.jus.br)
 * - COMUNICA_API_LOGIN_PATH (default: /api/v1/login)
 * - COMUNICA_API_PUBLICACOES_PATH (default: /api/v1/publicacoes)
 * - COMUNICA_API_PUBLICACOES_PUBLIC_PATH (opcional; endpoint público)
 * - COMUNICA_API_USER
 * - COMUNICA_API_PASSWORD
 * - COMUNICA_API_TOKEN_HEADER (default: Authorization)
 * - COMUNICA_API_TOKEN_PREFIX (default: Bearer)
 * - COMUNICA_API_MODO (publico|autenticado|auto) default: auto
 */

type HttpMethod = 'GET' | 'POST';
export type ComunicaApiModo = 'publico' | 'autenticado' | 'auto';

interface AuthCache {
  token: string;
  expiresAt: number;
}

let authCache: AuthCache | null = null;

function getEnv(name: string, fallback = ''): string {
  return Deno.env.get(name) || fallback;
}

function toModo(value?: string | null): ComunicaApiModo {
  const modo = String(value || 'auto').toLowerCase();
  if (modo === 'publico' || modo === 'autenticado' || modo === 'auto') return modo;
  return 'auto';
}

function baseUrl(): string {
  const v = getEnv('COMUNICA_API_BASE_URL');
  if (!v) throw new Error('COMUNICA_API_BASE_URL não configurada');
  return v.replace(/\/$/, '');
}

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${baseUrl()}${p}`);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  });
  return url.toString();
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(status: number): boolean {
  return status === 429 || status >= 500;
}

export class ComunicaApiHttpError extends Error {
  status: number;
  payload?: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = 'ComunicaApiHttpError';
    this.status = status;
    this.payload = payload;
  }
}

export async function requestComunicaApi<T>(opts: {
  method?: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  token?: string;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}): Promise<T> {
  const tokenHeaderName = getEnv('COMUNICA_API_TOKEN_HEADER', 'Authorization');
  const tokenPrefix = getEnv('COMUNICA_API_TOKEN_PREFIX', 'Bearer');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (opts.token) {
    headers[tokenHeaderName] = tokenPrefix ? `${tokenPrefix} ${opts.token}` : opts.token;
  }

  const timeoutMs = opts.timeoutMs ?? 15_000;
  const retries = opts.retries ?? 2;
  const retryDelayMs = opts.retryDelayMs ?? 400;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(buildUrl(opts.path, opts.query), {
        method: opts.method || 'GET',
        headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: controller.signal,
      });

      const text = await res.text();
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const payload = isJson && text ? JSON.parse(text) : text;

      if (!res.ok) {
        const err = new ComunicaApiHttpError(
          res.status,
          `ComunicaAPI ${res.status}: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}`,
          payload,
        );

        if (attempt < retries && shouldRetry(res.status)) {
          await wait(retryDelayMs * (attempt + 1));
          continue;
        }

        throw err;
      }

      return payload as T;
    } catch (e) {
      lastError = e as Error;
      const message = (e as Error).message || '';
      const isTimeout = message.includes('aborted') || message.includes('AbortError');
      if (attempt < retries && isTimeout) {
        await wait(retryDelayMs * (attempt + 1));
        continue;
      }
      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error('Falha desconhecida em request ComunicaAPI');
}

export async function loginComunicaApi(): Promise<{ token: string; expiresInSec?: number }> {
  const user = getEnv('COMUNICA_API_USER');
  const password = getEnv('COMUNICA_API_PASSWORD');
  if (!user || !password) {
    throw new Error('COMUNICA_API_USER/COMUNICA_API_PASSWORD não configuradas');
  }

  const loginPath = getEnv('COMUNICA_API_LOGIN_PATH', '/api/v1/login');
  const resp = await requestComunicaApi<any>({
    method: 'POST',
    path: loginPath,
    body: { username: user, password },
  });

  const token = resp?.token || resp?.access_token || resp?.jwt || resp?.data?.token;
  const expiresInSec = Number(resp?.expires_in || resp?.expiresIn || 900);

  if (!token) {
    throw new Error('Token não encontrado na resposta de login da ComunicaAPI');
  }

  return { token, expiresInSec };
}

export async function getComunicaApiToken(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (!forceRefresh && authCache && authCache.expiresAt > now + 15_000) {
    return authCache.token;
  }

  const { token, expiresInSec = 900 } = await loginComunicaApi();
  authCache = {
    token,
    expiresAt: now + expiresInSec * 1000,
  };

  return token;
}

function normalizeArrayResponse(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.resultados)) return data.resultados;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function consultaPublicacoesDjePublico(params: {
  numeroProcesso: string;
  tribunal?: string;
  dataInicio?: string;
  dataFim?: string;
  pagina?: number;
  tamanho?: number;
}): Promise<any[]> {
  const path = getEnv('COMUNICA_API_PUBLICACOES_PUBLIC_PATH');
  if (!path) {
    throw new Error('COMUNICA_API_PUBLICACOES_PUBLIC_PATH não configurado para modo público');
  }

  const data = await requestComunicaApi<any>({
    method: 'GET',
    path,
    query: {
      numeroProcesso: params.numeroProcesso,
      tribunal: params.tribunal,
      dataInicio: params.dataInicio,
      dataFim: params.dataFim,
      page: params.pagina ?? 0,
      size: params.tamanho ?? 50,
    },
  });

  return normalizeArrayResponse(data);
}

export async function consultaPublicacoesDjeAutenticado(params: {
  numeroProcesso: string;
  tribunal?: string;
  dataInicio?: string;
  dataFim?: string;
  pagina?: number;
  tamanho?: number;
}): Promise<any[]> {
  const token = await getComunicaApiToken();
  const path = getEnv('COMUNICA_API_PUBLICACOES_PATH', '/api/v1/publicacoes');

  const data = await requestComunicaApi<any>({
    method: 'GET',
    path,
    token,
    query: {
      numeroProcesso: params.numeroProcesso,
      tribunal: params.tribunal,
      dataInicio: params.dataInicio,
      dataFim: params.dataFim,
      page: params.pagina ?? 0,
      size: params.tamanho ?? 50,
    },
  });

  return normalizeArrayResponse(data);
}

export async function consultaPublicacoesDje(params: {
  numeroProcesso: string;
  tribunal?: string;
  dataInicio?: string;
  dataFim?: string;
  pagina?: number;
  tamanho?: number;
  modo?: ComunicaApiModo;
}): Promise<{ itens: any[]; modoUtilizado: 'publico' | 'autenticado' }> {
  const modo = params.modo || toModo(getEnv('COMUNICA_API_MODO', 'auto'));

  if (modo === 'publico') {
    const itens = await consultaPublicacoesDjePublico(params);
    return { itens, modoUtilizado: 'publico' };
  }

  if (modo === 'autenticado') {
    const itens = await consultaPublicacoesDjeAutenticado(params);
    return { itens, modoUtilizado: 'autenticado' };
  }

  try {
    const itens = await consultaPublicacoesDjePublico(params);
    return { itens, modoUtilizado: 'publico' };
  } catch (e) {
    const err = e as Error;
    if (!String(err.message || '').includes('403') &&
        !String(err.message || '').includes('401') &&
        !String(err.message || '').includes('não configurado')) {
      throw e;
    }
  }

  const itens = await consultaPublicacoesDjeAutenticado(params);
  return { itens, modoUtilizado: 'autenticado' };
}

export async function testarConectividadeComunicaApi(): Promise<Record<string, unknown>> {
  const loginPath = getEnv('COMUNICA_API_LOGIN_PATH', '/api/v1/login');
  const publicPath = getEnv('COMUNICA_API_PUBLICACOES_PUBLIC_PATH');
  const authPath = getEnv('COMUNICA_API_PUBLICACOES_PATH', '/api/v1/publicacoes');

  const checks: Record<string, unknown> = {
    baseUrl: baseUrl(),
    loginPath,
    publicPath: publicPath || null,
    authPath,
    login: { ok: false },
    publico: { ok: false },
    autenticado: { ok: false },
  };

  if (publicPath) {
    try {
      await requestComunicaApi<any>({ method: 'GET', path: publicPath, query: { size: 1 } });
      checks.publico = { ok: true };
    } catch (e) {
      checks.publico = { ok: false, erro: (e as Error).message };
    }
  }

  try {
    const token = await getComunicaApiToken(true);
    checks.login = { ok: true };
    try {
      await requestComunicaApi<any>({ method: 'GET', path: authPath, token, query: { size: 1 } });
      checks.autenticado = { ok: true };
    } catch (e) {
      checks.autenticado = { ok: false, erro: (e as Error).message };
    }
  } catch (e) {
    checks.login = { ok: false, erro: (e as Error).message };
  }

  return checks;
}
