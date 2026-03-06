/**
 * Cliente utilitário para integração com SGT/TPU do CNJ.
 *
 * Fontes:
 * - SOAP/WSDL público: https://www.cnj.jus.br/sgt/sgt_ws.php?wsdl
 * - Gateway TPU (Swagger): https://gateway.cloud.pje.jus.br/tpu/swagger-ui.html#/Consulta
 */

const SGT_ENDPOINT = 'https://www.cnj.jus.br/sgt/sgt_ws.php';
const SGT_NS = 'https://www.cnj.jus.br/sgt/sgt_ws.php';

type TipoTabela = 'A' | 'M' | 'C'; // Assunto, Movimento, Classe
type TipoPesquisa = 'G' | 'N' | 'C'; // Glossário, Nome, Código

export interface SGTItem {
  cod_item: number;
  cod_item_pai: number;
  nome: string;
  dscGlossario?: string;
}

export interface SGTMappedItem {
  codigo: number;
  codigo_pai?: number | null;
  nome: string;
  glossario?: string;
  ativo: boolean;
  origem: 'CNJ_SGT';
  atualizado_em: string;
}

function unwrapTag(xml: string, tag: string): string | null {
  // Aceita com ou sem namespace (ex.: <return> e <ns1:return>)
  const re = new RegExp(`<(?:[\\w-]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[\\w-]+:)?${tag}>`, 'i');
  const m = xml.match(re);
  return m ? m[1] : null;
}

function decodeXmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseItemsFromSoap(xml: string): SGTItem[] {
  // Tenta caminho 1: blocos <item> ... </item>
  const byItemBlocks: SGTItem[] = [];
  const itemRegex = /<(?:[\w-]+:)?item[^>]*>([\s\S]*?)<\\/(?:[\w-]+:)?item>/gi;
  let itemMatch: RegExpExecArray | null;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const chunk = itemMatch[1];
    const cod = unwrapTag(chunk, 'cod_item');
    const pai = unwrapTag(chunk, 'cod_item_pai');
    const nome = unwrapTag(chunk, 'nome');
    const gloss = unwrapTag(chunk, 'dscGlossario');

    if (!cod || !nome) continue;

    byItemBlocks.push({
      cod_item: Number(cod),
      cod_item_pai: pai ? Number(pai) : 0,
      nome: decodeXmlEntities(nome),
      dscGlossario: gloss ? decodeXmlEntities(gloss) : undefined,
    });
  }

  if (byItemBlocks.length > 0) return byItemBlocks;

  // Caminho 2 (fallback): payload sem wrapper <item>, agrupando por ocorrência de cod_item
  const codRegex = /<(?:[\w-]+:)?cod_item[^>]*>(.*?)<\\/(?:[\w-]+:)?cod_item>/gi;
  const pairs: Array<{ start: number; end: number; cod: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = codRegex.exec(xml)) !== null) {
    pairs.push({ start: m.index, end: codRegex.lastIndex, cod: m[1] });
  }

  const fallbackItems: SGTItem[] = [];
  for (let i = 0; i < pairs.length; i += 1) {
    const start = pairs[i].start;
    const end = i + 1 < pairs.length ? pairs[i + 1].start : xml.length;
    const chunk = xml.slice(start, end);
    const cod = unwrapTag(chunk, 'cod_item');
    const pai = unwrapTag(chunk, 'cod_item_pai');
    const nome = unwrapTag(chunk, 'nome');
    const gloss = unwrapTag(chunk, 'dscGlossario');

    if (!cod || !nome) continue;

    fallbackItems.push({
      cod_item: Number(cod),
      cod_item_pai: pai ? Number(pai) : 0,
      nome: decodeXmlEntities(nome),
      dscGlossario: gloss ? decodeXmlEntities(gloss) : undefined,
    });
  }

  return fallbackItems;
}

async function postSoap(operation: string, body: string): Promise<string> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${SGT_NS}">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:${operation}>
      ${body}
    </tns:${operation}>
  </soapenv:Body>
</soapenv:Envelope>`;

  const res = await fetch(SGT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: `${SGT_NS}#${operation}`,
    },
    body: envelope,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`SGT SOAP ${res.status}: ${text.slice(0, 500)}`);
  }
  return text;
}

/** pesquisarItemPublicoWS(A|M|C, G|N|C, valor) */
export async function pesquisarItemPublicoWS(
  tipoTabela: TipoTabela,
  tipoPesquisa: TipoPesquisa,
  valorPesquisa: string,
): Promise<SGTItem[]> {
  const xml = await postSoap(
    'pesquisarItemPublicoWS',
    `<tipoTabela>${tipoTabela}</tipoTabela>
<tipoPesquisa>${tipoPesquisa}</tipoPesquisa>
<valorPesquisa>${valorPesquisa}</valorPesquisa>`,
  );

  return parseItemsFromSoap(xml);
}

/** getArrayDetalhesItemPublicoWS(seqItem, tipoItem) */
export async function getArrayDetalhesItemPublicoWS(
  seqItem: string | number,
  tipoItem: TipoTabela,
): Promise<string> {
  return postSoap(
    'getArrayDetalhesItemPublicoWS',
    `<seqItem>${seqItem}</seqItem>
<tipoItem>${tipoItem}</tipoItem>`,
  );
}

/** getArrayFilhosItemPublicoWS(seqItem, tipoItem) */
export async function getArrayFilhosItemPublicoWS(
  seqItem: number,
  tipoItem: TipoTabela,
): Promise<string> {
  return postSoap(
    'getArrayFilhosItemPublicoWS',
    `<seqItem>${seqItem}</seqItem>
<tipoItem>${tipoItem}</tipoItem>`,
  );
}

/** getStringPaisItemPublicoWS(seqItem, tipoItem) */
export async function getStringPaisItemPublicoWS(
  seqItem: number,
  tipoItem: TipoTabela,
): Promise<string> {
  return postSoap(
    'getStringPaisItemPublicoWS',
    `<seqItem>${seqItem}</seqItem>
<tipoItem>${tipoItem}</tipoItem>`,
  );
}

/** getComplementoMovimentoWS(codMovimento) */
export async function getComplementoMovimentoWS(codMovimento: number): Promise<string> {
  return postSoap('getComplementoMovimentoWS', `<codMovimento>${codMovimento}</codMovimento>`);
}

/** getDataUltimaVersao() */
export async function getDataUltimaVersao(): Promise<string> {
  const xml = await postSoap('getDataUltimaVersao', '');
  return unwrapTag(xml, 'return') || '';
}

/**
 * Mapeia itens SGT para entidades locais TPU.
 * - Classe  -> TPUClasse
 * - Assunto -> TPUAssunto
 * - Movimento -> TPUMovimento
 */
export function toTPUEntityPayload(items: SGTItem[]): SGTMappedItem[] {
  const now = new Date().toISOString();
  return items.map((item) => ({
    codigo: item.cod_item,
    codigo_pai: item.cod_item_pai || null,
    nome: item.nome,
    glossario: item.dscGlossario,
    ativo: true,
    origem: 'CNJ_SGT',
    atualizado_em: now,
  }));
}

/**
 * Cliente para API Gateway TPU (OpenAPI/Swagger).
 *
 * Observação:
 * - rotas e autenticação podem variar por ambiente.
 * - use este helper com endpoint e token vindos de env vars.
 */
export async function consultarTPUGateway<T = unknown>(params: {
  endpoint: string;
  token?: string;
  method?: 'GET' | 'POST';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}): Promise<T> {
  const url = new URL(params.endpoint);

  Object.entries(params.query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  });

  const res = await fetch(url.toString(), {
    method: params.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
    },
    body: params.body ? JSON.stringify(params.body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`TPU Gateway ${res.status}: ${await res.text()}`);
  }

  return (await res.json()) as T;
}
