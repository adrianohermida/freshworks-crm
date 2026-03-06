import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Sincronizar com Fallback Offline
 * Tenta API DataJud primeiro, se falhar usa JuizoCNJ local para parsing
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cnj_number } = await req.json();

    if (!cnj_number) {
      return Response.json({ error: 'cnj_number obrigatório' }, { status: 400 });
    }

    // TENTAR API DATAJUD PRIMEIRO
    let dados = null;
    let fonte = null;

    const resultadoAPI = await tentarAPIDataJud(cnj_number);
    if (resultadoAPI.sucesso) {
      dados = resultadoAPI.dados;
      fonte = 'datajud_api';
    } else {
      // FALLBACK: Parsing offline com JuizoCNJ
      const resultadoOffline = await tentarParsingOffline(base44, cnj_number);
      if (resultadoOffline.sucesso) {
        dados = resultadoOffline.dados;
        fonte = 'offline_parsing';
      }
    }

    if (!dados) {
      return Response.json({
        error: 'Não foi possível sincronizar. API indisponível e dados offline limitados.',
        tentativas: {
          datajud_api: !resultadoAPI.sucesso,
          offline_parsing: !resultadoAPI.sucesso
        }
      }, { status: 503 });
    }

    // Registrar sincronização via webhook
    try {
      await base44.functions.invoke('sincronizacaoWebhook', {
        processo_id: cnj_number,
        tipo: fonte,
        status: 'sucesso',
        total_movimentos: dados.movimentos?.length || 0,
        total_novos: 0,
        total_duplicatas: 0,
        tempo_ms: 0
      });
    } catch (e) {
      console.warn('Erro ao registrar webhook:', e.message);
    }

    return Response.json({
      success: true,
      cnj_number,
      fonte,
      dados
    });
  } catch (error) {
    console.error('[sincronizarComFallback] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Tentar API DataJud com retry exponencial
 */
async function tentarAPIDataJud(cnj_number) {
  const baseUrl = Deno.env.get('DATAJUD_BASE_URL');
  const apiKey = Deno.env.get('DATAJUD_API_KEY');

  if (!baseUrl || !apiKey) {
    return { sucesso: false, erro: 'Configuração incompleta' };
  }

  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const response = await fetch(`${baseUrl}/processos/${cnj_number}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 15000
      });

      if (response.ok) {
        const dados = await response.json();
        return { sucesso: true, dados };
      }

      if (tentativa < 3) {
        await new Promise(r => setTimeout(r, Math.pow(2, tentativa - 1) * 1000));
      }
    } catch (error) {
      if (tentativa < 3) {
        await new Promise(r => setTimeout(r, Math.pow(2, tentativa - 1) * 1000));
      }
    }
  }

  return { sucesso: false, erro: 'API indisponível' };
}

/**
 * Fallback: Parsing offline com dados locais
 * Usa JuizoCNJ + CodigoForoTJSP para preencher dados básicos
 */
async function tentarParsingOffline(base44, cnj_number) {
  try {
    const cnjLimpo = String(cnj_number).replace(/\D/g, '');
    if (cnjLimpo.length !== 20) {
      return { sucesso: false };
    }

    // Extrair tribunal e foro do CNJ
    const codigoTribunal = cnjLimpo.slice(14, 16);
    const codigoOrigem = cnjLimpo.slice(16, 20);

    // Buscar em JuizoCNJ
    const juizos = await base44.entities.JuizoCNJ.filter(
      { codigo: codigoTribunal },
      null,
      1
    );

    if (!juizos?.length) {
      return { sucesso: false };
    }

    const juizo = juizos[0];

    // Dados estruturados do parsing offline
    const dados = {
      numero: cnj_number,
      tribunal: juizo.tribunal,
      municipio: juizo.municipio,
      tipo_orgao: juizo.tipo,
      grau: juizo.grau,
      assunto: 'Não disponível (parsing offline)',
      classe: 'Não disponível (parsing offline)',
      dataRegistro: new Date().toISOString().split('T')[0],
      movimentos: [],
      origem: juizo.nome || 'Órgão indisponível'
    };

    return { sucesso: true, dados };
  } catch (error) {
    return { sucesso: false, erro: error.message };
  }
}