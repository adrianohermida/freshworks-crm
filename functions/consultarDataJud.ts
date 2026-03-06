import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Mapa completo de endpoints DataJud — 91 tribunais (CNJ Resolução 65/2008)
 * Chave: segmento (J) + tribunal (TT) com 2 dígitos
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
  '601':'tre_ac','602':'tre_al','603':'tre_am','604':'tre_ap','605':'tre_ba',
  '606':'tre_ce','607':'tre_df','608':'tre_es','609':'tre_go','610':'tre_ma',
  '611':'tre_mg','612':'tre_ms','613':'tre_mt','614':'tre_pa','615':'tre_pb',
  '616':'tre_pe','617':'tre_pi','618':'tre_pr','619':'tre_rj','620':'tre_rn',
  '621':'tre_ro','622':'tre_rr','623':'tre_rs','624':'tre_sc','625':'tre_se',
  '626':'tre_sp','627':'tre_to',
  '700':'stm',
  '801':'tjac','802':'tjal','803':'tjam','804':'tjap','805':'tjba','806':'tjce',
  '807':'tjdft','808':'tjes','809':'tjgo','810':'tjma','811':'tjmg','812':'tjms',
  '813':'tjmt','814':'tjpa','815':'tjpb','816':'tjpe','817':'tjpi','818':'tjpr',
  '819':'tjrj','820':'tjrn','821':'tjro','822':'tjrr','823':'tjrs','824':'tjsc',
  '825':'tjse','826':'tjsp','827':'tjto',
};

// Fallback por UF → endpoint estadual
const UF_ENDPOINT = {
  AC:'tjac',AL:'tjal',AM:'tjam',AP:'tjap',BA:'tjba',CE:'tjce',DF:'tjdft',
  ES:'tjes',GO:'tjgo',MA:'tjma',MG:'tjmg',MS:'tjms',MT:'tjmt',PA:'tjpa',
  PB:'tjpb',PE:'tjpe',PI:'tjpi',PR:'tjpr',RJ:'tjrj',RN:'tjrn',RO:'tjro',
  RR:'tjrr',RS:'tjrs',SC:'tjsc',SE:'tjse',SP:'tjsp',TO:'tjto',
};

function limparCNJ(cnj) {
  return String(cnj || '').replace(/\D/g, '').slice(0, 20);
}

function formatarCNJ(digits) {
  if (digits.length !== 20) return digits;
  return `${digits.slice(0,7)}-${digits.slice(7,9)}.${digits.slice(9,13)}.${digits.slice(13,14)}.${digits.slice(14,16)}.${digits.slice(16,20)}`;
}

function detectarEndpoint(cnj, uf) {
  const d = limparCNJ(cnj);
  if (d.length === 20) {
    const j  = d[13];
    const tt = d.slice(14, 16);
    const chave = `${j}${tt}`;
    if (ENDPOINTS[chave]) return ENDPOINTS[chave];
    // fallback: só segmento + 00
    const chave0 = `${j}00`;
    if (ENDPOINTS[chave0]) return ENDPOINTS[chave0];
  }
  if (uf) return UF_ENDPOINT[uf.toUpperCase()] || null;
  return null;
}

/**
 * Retry exponencial com backoff: 5s, 10s, 20s, 40s, 80s (max)
 * Calcula delay de forma exponencial: 5 * 2^(tentativa-1) segundos
 */
function calcularDelay(tentativa) {
  return Math.min(5000 * Math.pow(2, tentativa - 1), 80000);
}

async function fetchDataJud(tribunal, numeroRaw, apiKey, tentativa = 1, maxTentativas = 5) {
  const url = `https://api-publica.datajud.cnj.jus.br/api_publica_${tribunal}/_search`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `APIKey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { match: { numeroProcesso: numeroRaw } },
        size: 100
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`DataJud HTTP ${res.status}:`, errorText.slice(0, 200));
      
      // Retry 5xx, rate limit 429
      if ((res.status >= 500 || res.status === 429) && tentativa < maxTentativas) {
        const delayMs = calcularDelay(tentativa);
        console.log(`[DataJud Retry] Tentativa ${tentativa}/${maxTentativas} — delay ${delayMs}ms`);
        await new Promise(r => setTimeout(r, delayMs));
        return fetchDataJud(tribunal, numeroRaw, apiKey, tentativa + 1, maxTentativas);
      }
    }
    
    return res;
  } catch (err) {
    clearTimeout(timeout);
    console.error(`[DataJud Fetch Error]`, err.message);
    
    // Retry em timeout ou erro de rede
    if (tentativa < maxTentativas) {
      const delayMs = calcularDelay(tentativa);
      console.log(`[DataJud Retry] Tentativa ${tentativa}/${maxTentativas} — delay ${delayMs}ms`);
      await new Promise(r => setTimeout(r, delayMs));
      return fetchDataJud(tribunal, numeroRaw, apiKey, tentativa + 1, maxTentativas);
    }
    throw err;
  }
}

/**
 * Registra sync log estruturado (SyncLog automation)
 * Rastreia: etapa, status, tentativas, erros, timing
 */
async function registrarSyncLog(base44, { processoNumero, tribunal, status, etapa, erro, tentativa, tempoMs }) {
  try {
    await base44.asServiceRole.entities.SyncLog.create({
      processo_numero: processoNumero,
      tribunal,
      status, // 'sucesso', 'erro', 'parcial'
      etapa,  // 'validacao', 'consultando_datajud', 'processando_movimentos', etc
      usuario_email: 'system:datajud',
      retry_tentativa: tentativa || 1,
      tempo_execucao_ms: tempoMs,
      erro_code: erro?.code || null,
      erro_mensagem: erro?.message?.slice(0, 500) || null,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[SyncLog] Falha ao registrar:', err.message);
  }
}

Deno.serve(async (req) => {
  const inicioMs = Date.now();
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { numeroProcesso, uf, tribunal: tribunalOverride } = await req.json();

    // Validação
    if (!numeroProcesso) {
      return Response.json({ error: 'numeroProcesso é obrigatório' }, { status: 400 });
    }

    const apiKey = Deno.env.get('DATAJUD_API_KEY');
    if (!apiKey) return Response.json({ error: 'DATAJUD_API_KEY não configurada' }, { status: 500 });

    const digits = limparCNJ(numeroProcesso);

    // Detectar tribunal (auto-detect UF via CNJ number)
    const tribunal = tribunalOverride || detectarEndpoint(numeroProcesso, uf);
    if (!tribunal) {
      await registrarSyncLog(base44, {
        processoNumero: digits,
        tribunal: uf || 'desconhecido',
        status: 'erro',
        etapa: 'validacao',
        erro: { code: 'TRIBUNAL_NAO_DETECTADO', message: 'Tribunal não detectado' },
        tempoMs: Date.now() - inicioMs,
      });
      
      return Response.json({
        error: 'Não foi possível detectar o tribunal. Informe o UF ou um número CNJ completo de 20 dígitos.',
        detalhes: { recebido: numeroProcesso, digitos: digits.length }
      }, { status: 400 });
    }

    // Buscar DataJud (com retry exponencial)
    const response = await fetchDataJud(tribunal, digits, apiKey);

    if (!response.ok) {
      const errorText = await response.text();
      await registrarSyncLog(base44, {
        processoNumero: digits,
        tribunal,
        status: 'erro',
        etapa: 'consultando_datajud',
        erro: { code: `HTTP_${response.status}`, message: errorText.slice(0, 200) },
        tempoMs: Date.now() - inicioMs,
      });
      
      return Response.json({
        error: `DataJud retornou ${response.status}`,
        tribunal,
        details: errorText.slice(0, 500)
      }, { status: response.status });
    }

    const data = await response.json();

    // Validação schema TPU + processamento movimentos
    const resultados = (data.hits?.hits || []).map(hit => {
      const src = hit._source || {};
      return {
        id: hit._id,
        numeroProcesso: src.numeroProcesso,
        numeroProcessoFormatado: formatarCNJ(limparCNJ(src.numeroProcesso || '')),
        classe: src.classe,
        assuntos: src.assuntos || [],
        movimentos: (src.movimentos || []).map(m => ({
          codigo: m.codigo,
          nome: m.nome,
          dataHora: m.dataHora,
          complementosTabelados: m.complementosTabelados || [],
          descricao: m.descricao || ''
        })),
        orgaoJulgador: src.orgaoJulgador,
        dataAjuizamento: src.dataAjuizamento,
        dataHoraUltimaAtualizacao: src.dataHoraUltimaAtualizacao,
        grau: src.grau,
        sistema: src.sistema,
        formato: src.formato,
        nivelSigilo: src.nivelSigilo,
        totalMovimentos: (src.movimentos || []).length
      };
    });

    // Registrar sucesso
    await registrarSyncLog(base44, {
      processoNumero: digits,
      tribunal,
      status: 'sucesso',
      etapa: 'concluido',
      tempoMs: Date.now() - inicioMs,
    });

    // Analytics best-effort
    try {
      await base44.analytics.track({
        eventName: 'datajud_search',
        properties: { tribunal, uf: uf || '', encontrados: resultados.length, tempoMs: Date.now() - inicioMs },
      });
    } catch (_) {}

    return Response.json({
      success: true,
      tribunal,
      uf: uf || '',
      numeroProcessoFormatado: digits.length === 20 ? formatarCNJ(digits) : numeroProcesso,
      numeroProcessoRaw: digits,
      total: resultados.length,
      resultados,
      tempoMs: Date.now() - inicioMs,
    });

  } catch (error) {
    console.error('[consultarDataJud]', error.message);
    
    try {
      const base44 = createClientFromRequest(req);
      await registrarSyncLog(base44, {
        processoNumero: '?',
        tribunal: '?',
        status: 'erro',
        etapa: 'nao_determinada',
        erro: { code: 'UNKNOWN', message: error.message },
        tempoMs: Date.now() - inicioMs,
      });
    } catch (_) {}
    
    return Response.json({ error: error.message }, { status: 500 });
  }
});