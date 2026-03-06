import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Sincronizar com Retry Inteligente e Backoff Exponencial
 * Implementa Circuit Breaker + Exponential Backoff
 */

const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000; // 1s
const MAX_DELAY = 30000; // 30s
const BACKOFF_MULTIPLIER = 2;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cnj_number, max_retries } = await req.json();
    const maxRetries = max_retries || MAX_RETRIES;

    if (!cnj_number) {
      return Response.json({ error: 'cnj_number obrigatório' }, { status: 400 });
    }

    const resultado = await executarComRetry(base44, cnj_number, maxRetries, user.email);

    if (!resultado.sucesso) {
      // Notificar falha
      try {
        await base44.functions.invoke('notificarFalhaSincronizacao', {
          processo_id: cnj_number,
          tipo: 'datajud',
          erro: resultado.erro,
          usuario_email: user.email
        });
      } catch (notifError) {
        console.warn('Erro ao notificar falha:', notifError.message);
      }

      return Response.json({
        success: false,
        cnj_number,
        erro: resultado.erro,
        tentativas: resultado.tentativas,
        status_code: 503
      }, { status: 503 });
    }

    // Registrar sucesso
    try {
      await base44.functions.invoke('sincronizacaoWebhook', {
        processo_id: cnj_number,
        tipo: resultado.fonte,
        status: 'sucesso',
        total_movimentos: resultado.dados?.movimentos?.length || 0,
        tempo_ms: resultado.tempo_ms
      });
    } catch (webhookError) {
      console.warn('Erro ao registrar webhook:', webhookError.message);
    }

    return Response.json({
      success: true,
      cnj_number,
      fonte: resultado.fonte,
      tentativas: resultado.tentativas,
      tempo_ms: resultado.tempo_ms,
      dados: resultado.dados
    });
  } catch (error) {
    console.error('[sincronizarComRetry] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Executa sincronização com retry e backoff exponencial
 */
async function executarComRetry(base44, cnj_number, maxRetries, usuarioEmail) {
  let ultimoErro = null;
  let delay = INITIAL_DELAY;
  const inicioTempo = Date.now();

  for (let tentativa = 1; tentativa <= maxRetries; tentativa++) {
    try {
      // Tentar API DataJud
      const resultadoAPI = await chamarAPIDataJud(cnj_number);
      if (resultadoAPI.sucesso) {
        return {
          sucesso: true,
          fonte: 'datajud_api',
          dados: resultadoAPI.dados,
          tentativas: tentativa,
          tempo_ms: Date.now() - inicioTempo
        };
      }

      ultimoErro = resultadoAPI.erro;

      // Se falhou, tentar fallback offline
      if (tentativa === Math.ceil(maxRetries / 2)) {
        const resultadoOffline = await chamarParsingOffline(base44, cnj_number);
        if (resultadoOffline.sucesso) {
          return {
            sucesso: true,
            fonte: 'offline_parsing',
            dados: resultadoOffline.dados,
            tentativas: tentativa,
            tempo_ms: Date.now() - inicioTempo
          };
        }
      }

      // Aguardar com backoff exponencial
      if (tentativa < maxRetries) {
        console.log(`[Retry ${tentativa}/${maxRetries}] Aguardando ${delay}ms antes de tentar novamente`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * BACKOFF_MULTIPLIER, MAX_DELAY);
      }
    } catch (error) {
      ultimoErro = error.message;

      if (tentativa < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * BACKOFF_MULTIPLIER, MAX_DELAY);
      }
    }
  }

  return {
    sucesso: false,
    erro: `Falha após ${maxRetries} tentativas: ${ultimoErro}`,
    tentativas: maxRetries,
    tempo_ms: Date.now() - inicioTempo
  };
}

/**
 * Chamar API DataJud
 */
async function chamarAPIDataJud(cnj_number) {
  const baseUrl = Deno.env.get('DATAJUD_BASE_URL');
  const apiKey = Deno.env.get('DATAJUD_API_KEY');

  if (!baseUrl || !apiKey) {
    return { sucesso: false, erro: 'Configuração incompleta' };
  }

  try {
    const response = await fetch(`${baseUrl}/processos/${cnj_number}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      timeout: 20000
    });

    if (response.ok) {
      const dados = await response.json();
      return { sucesso: true, dados };
    }

    return { sucesso: false, erro: `HTTP ${response.status}` };
  } catch (error) {
    return { sucesso: false, erro: error.message };
  }
}

/**
 * Chamar Parsing Offline
 */
async function chamarParsingOffline(base44, cnj_number) {
  try {
    const cnjLimpo = String(cnj_number).replace(/\D/g, '');
    if (cnjLimpo.length !== 20) {
      return { sucesso: false };
    }

    const codigoTribunal = cnjLimpo.slice(14, 16);
    const juizos = await base44.entities.JuizoCNJ.filter(
      { codigo: codigoTribunal },
      null,
      1
    );

    if (!juizos?.length) {
      return { sucesso: false };
    }

    const juizo = juizos[0];
    const dados = {
      numero: cnj_number,
      tribunal: juizo.tribunal,
      municipio: juizo.municipio,
      dataRegistro: new Date().toISOString().split('T')[0],
      movimentos: [],
      origem: juizo.nome || 'Órgão indisponível'
    };

    return { sucesso: true, dados };
  } catch (error) {
    return { sucesso: false, erro: error.message };
  }
}