import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Consulta DataJud com paginação usando search_after
 * Baseado em: https://github.com/joaotextor/busca-processos-judiciais
 * Permite: busca por número, classe+órgão, assunto, data range
 * Paginação eficiente via @timestamp com search_after
 */

const ENDPOINTS = {
  '100':'stf','200':'cnj','300':'stj',
  '400':'cjf','401':'trf1','402':'trf2','403':'trf3','404':'trf4','405':'trf5','406':'trf6',
  '500':'tst',
  '501':'trt1','502':'trt2','503':'trt3','504':'trt4','505':'trt5','506':'trt6',
  '507':'trt7','508':'trt8','509':'trt9','510':'trt10','511':'trt11','512':'trt12',
  '513':'trt13','514':'trt14','515':'trt15','516':'trt16','517':'trt17','518':'trt18',
  '519':'trt19','520':'trt20','521':'trt21','522':'trt22','523':'trt23','524':'trt24',
  '600':'tse',
  '601':'tre_ac','602':'tre_al','603':'tre_am','604':'tre_ap','605':'tre_ba','606':'tre_ce',
  '607':'tre_df','608':'tre_es','609':'tre_go','610':'tre_ma','611':'tre_mg','612':'tre_ms',
  '613':'tre_mt','614':'tre_pa','615':'tre_pb','616':'tre_pe','617':'tre_pi','618':'tre_pr',
  '619':'tre_rj','620':'tre_rn','621':'tre_ro','622':'tre_rr','623':'tre_rs','624':'tre_sc',
  '625':'tre_se','626':'tre_sp','627':'tre_to',
  '700':'stm',
  '801':'tjac','802':'tjal','803':'tjam','804':'tjap','805':'tjba','806':'tjce',
  '807':'tjdft','808':'tjes','809':'tjgo','810':'tjma','811':'tjmg','812':'tjms',
  '813':'tjmt','814':'tjpa','815':'tjpb','816':'tjpe','817':'tjpi','818':'tjpr',
  '819':'tjrj','820':'tjrn','821':'tjro','822':'tjrr','823':'tjrs','824':'tjsc',
  '825':'tjse','826':'tjsp','827':'tjto',
};

const UF_TR = {
  AC:'01',AL:'02',AM:'03',AP:'04',BA:'05',CE:'06',DF:'07',ES:'08',
  GO:'09',MA:'10',MG:'11',MS:'12',MT:'13',PA:'14',PB:'15',PE:'16',
  PI:'17',PR:'18',RJ:'19',RN:'20',RO:'21',RR:'22',RS:'23',SC:'24',
  SE:'25',SP:'26',TO:'27',
};

function detectarTribunal(numeroCNJ, ufFallback) {
  const d = String(numeroCNJ || '').replace(/\D/g, '');
  if (d.length === 20) {
    const j = d[13];
    const tt = d.slice(14, 16);
    const chave = `${j}${tt}`;
    if (ENDPOINTS[chave]) return ENDPOINTS[chave];
    const chave0 = `${j}00`;
    if (ENDPOINTS[chave0]) return ENDPOINTS[chave0];
  }
  if (ufFallback) {
    const uf = ufFallback.toUpperCase().slice(0, 2);
    const tr = UF_TR[uf];
    if (tr) return ENDPOINTS[`8${tr}`] || null;
  }
  return null;
}

/**
 * Constrói query DSL bool com match para filtros
 * Inspirado em: getProceduralClassAndJudgingBodyWithPagination
 */
function construirQuery(filtros) {
  const must = [];

  // match: número processo
  if (filtros.numero_processo) {
    const digits = String(filtros.numero_processo).replace(/\D/g, '');
    must.push({ match: { numeroProcesso: digits } });
  }

  // match: classe processual código
  if (filtros.classe_codigo) {
    must.push({ match: { 'classe.codigo': parseInt(filtros.classe_codigo) } });
  }

  // match: órgão julgador código
  if (filtros.orgao_codigo) {
    must.push({ match: { 'orgaoJulgador.codigo': parseInt(filtros.orgao_codigo) } });
  }

  // match: assunto código
  if (filtros.assunto_codigo) {
    must.push({ match: { 'assuntos.codigo': parseInt(filtros.assunto_codigo) } });
  }

  // range: data ajuizamento
  if (filtros.data_inicio || filtros.data_fim) {
    const range = { dataAjuizamento: {} };
    if (filtros.data_inicio) range.dataAjuizamento.gte = `${filtros.data_inicio}T00:00:00Z`;
    if (filtros.data_fim) range.dataAjuizamento.lte = `${filtros.data_fim}T23:59:59Z`;
    must.push({ range });
  }

  return {
    bool: {
      must: must.length > 0 ? must : [{ match_all: {} }]
    }
  };
}

/**
 * Fetch com retry exponencial para rate limit
 * Máximo 5 tentativas com delay 2^n segundos
 */
async function fetchComRetry(url, headers, body, tentativa = 0) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (res.status === 429) {
      if (tentativa < 5) {
        const delay = Math.pow(2, tentativa) * 1000;
        console.warn(`[DataJud] Rate limit. Tentativa ${tentativa + 1}/5. Aguardando ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
        return fetchComRetry(url, headers, body, tentativa + 1);
      }
      throw new Error('Rate limit: máximo de tentativas excedido');
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (tentativa < 3 && err.name === 'AbortError') {
      await new Promise(r => setTimeout(r, (tentativa + 1) * 1000));
      return fetchComRetry(url, headers, body, tentativa + 1);
    }
    throw err;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { tribunal, filtros = {}, size = 100, search_after = null } = await req.json();

    if (!tribunal) {
      return Response.json({ error: 'tribunal obrigatório' }, { status: 400 });
    }

    const apiKey = Deno.env.get('DATAJUD_API_KEY');
    if (!apiKey) return Response.json({ error: 'DATAJUD_API_KEY não configurada' }, { status: 500 });

    // Validar size (max 10000)
    const sizeValidado = Math.min(parseInt(size) || 100, 10000);

    // Construir query DSL bool
    const query = construirQuery(filtros);

    // Body com paginação search_after (como na lib)
    const body = {
      size: sizeValidado,
      query,
      sort: [{ '@timestamp': { order: 'asc' } }],
    };

    if (search_after) {
      body.search_after = search_after;
    }

    const url = `https://api-publica.datajud.cnj.jus.br/api_publica_${tribunal}/_search`;
    const headers = {
      'Authorization': `APIKey ${apiKey}`,
      'Content-Type': 'application/json'
    };

    const data = await fetchComRetry(url, headers, body);

    // Mapear hits com _id e _sort
    const processos = (data.hits?.hits || []).map(hit => ({
      ...hit._source,
      _id: hit._id,
      _sort: hit.sort,
    }));

    // Próxima página: sort do último resultado
    const proximaSort = processos.length > 0 ? processos[processos.length - 1]._sort : null;
    const totalResultados = data.hits?.total?.value || 0;

    return Response.json({
      success: true,
      tribunal,
      filtros,
      size: sizeValidado,
      total: totalResultados,
      processos,
      proximaSort,
      temProxima: processos.length === sizeValidado,
      tempoMs: data.took || 0,
    });

  } catch (error) {
    console.error('[consultarDataJudPaginado]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});