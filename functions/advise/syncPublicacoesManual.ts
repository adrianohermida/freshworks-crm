import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const ADVISE_PATH = '/core/v1/publicacoes-clientes/consulta-paginada';

Deno.serve(async (req) => {
  const t0 = Date.now();
  let totalNovas = 0, totalDuplicatas = 0, totalErros = 0, paginasProcessadas = 0;

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const {
      dataInicio,
      dataFim = new Date().toISOString().split('T')[0],
      tamanhoLote = 20,
      maxPublicacoes = 200
    } = body;

    const ADVISE_TOKEN = Deno.env.get('ADVISE_TOKEN');
    const ADVISE_API_URL = (Deno.env.get('ADVISE_API_URL') || 'https://sandbox-api.advise.com.br').replace(/\/$/, '');

    if (!ADVISE_TOKEN) {
      return Response.json({ error: 'ADVISE_TOKEN não configurado' }, { status: 500 });
    }

    const dataInicioPadrao = dataInicio || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log(`[SYNC] Iniciando: ${dataInicioPadrao} → ${dataFim}, lote=${tamanhoLote}, max=${maxPublicacoes}`);

    // Carregar IDs existentes com limit para não estourar memória
    const existentes = await base44.asServiceRole.entities.PublicacaoAdvise.list('-updated_date', 2000);
    const idsExistentes = new Set(existentes.map(r => String(r.idPublicacaoAdvise)));
    console.log(`[SYNC] ${idsExistentes.size} registros já existem no BD`);

    let paginaAtual = 1;
    let hasMore = true;

    while (hasMore && totalNovas + totalDuplicatas < maxPublicacoes) {
      const url = `${ADVISE_API_URL}${ADVISE_PATH}?Campos=*&Lido=false&DataInicioMovimento=${dataInicioPadrao}&DataFimMovimento=${dataFim}&RegistrosPorPagina=${tamanhoLote}&paginaAtual=${paginaAtual}`;

      console.log(`[SYNC] Buscando página ${paginaAtual}...`);

      let response;
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 25000);
        response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${ADVISE_TOKEN}`, 'Accept': 'application/json' },
          signal: controller.signal
        });
        clearTimeout(tid);
      } catch (fetchErr) {
        console.error(`[SYNC] Fetch falhou na página ${paginaAtual}: ${fetchErr.message}`);
        break;
      }

      if (response.status === 429) {
        const wait = parseInt(response.headers.get('retry-after') || '3') * 1000;
        console.warn(`[SYNC] Rate limit, aguardando ${wait}ms`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }

      if (!response.ok) {
        console.error(`[SYNC] HTTP ${response.status} na página ${paginaAtual}`);
        break;
      }

      let data;
      try {
        data = await response.json();
      } catch {
        console.error('[SYNC] JSON parse error');
        break;
      }

      // API Advise retorna { itens: [...], totalRegistros, ... }
      const itens = data.itens || data.items || data.publicacoes || data.result || [];

      if (!Array.isArray(itens) || itens.length === 0) {
        console.log(`[SYNC] Página ${paginaAtual} vazia — fim da paginação`);
        hasMore = false;
        break;
      }

      paginasProcessadas++;

      // Filtrar apenas novas (deduplicação em memória)
      const novasBatch = [];
      for (const item of itens) {
        const idAdvise = String(item.id || item.idPublicacaoCliente || item.idMovProcessoCliente || '');
        if (!idAdvise || idsExistentes.has(idAdvise)) {
          totalDuplicatas++;
          continue;
        }

        // Extrair número do processo corretamente
        let numeroProcesso = item.numeroProcesso
          || item.processos?.[0]?.numeroProcesso
          || item.numero
          || 'N/A';

        novasBatch.push({
          idPublicacaoAdvise: idAdvise,
          numeroProcesso,
          numeroCNJ: item.numeroCNJ ?? true,
          palavrasChave: Array.isArray(item.palavrasChave)
            ? item.palavrasChave.map(p => typeof p === 'string' ? p : p.palavraChave || '')
            : [],
          dataHoraMovimento: item.dataHoraMovimento || new Date().toISOString(),
          dataPublicacao: item.dataPublicacao || new Date().toISOString(),
          conteudo: (item.conteudo || '').substring(0, 5000),
          municipio: item.cidadeComarcaDescricao || item.municipio || '',
          vara: item.varaDescricao || item.vara || '',
          diario: item.nomeDiario || item.diario || '',
          lido: false,
          statusSincronizacao: 'importado',
          dataSincronizacao: new Date().toISOString(),
          idMovProcessoClienteAdvise: String(item.idMovProcessoCliente || '')
        });

        idsExistentes.add(idAdvise); // previne duplicata dentro do mesmo lote
      }

      // Bulk insert do batch
      if (novasBatch.length > 0) {
        try {
          await base44.asServiceRole.entities.PublicacaoAdvise.bulkCreate(novasBatch);
          totalNovas += novasBatch.length;
          console.log(`[SYNC] Página ${paginaAtual}: +${novasBatch.length} novas (total=${totalNovas})`);
        } catch (bulkErr) {
          console.error(`[SYNC] bulkCreate falhou: ${bulkErr.message}`);
          // fallback: inserir uma a uma
          for (const pub of novasBatch) {
            try {
              await base44.asServiceRole.entities.PublicacaoAdvise.create(pub);
              totalNovas++;
            } catch {
              totalErros++;
            }
          }
        }
      }

      // Próxima página ou fim
      if (itens.length < tamanhoLote) {
        hasMore = false;
      } else {
        paginaAtual++;
      }
    }

    const tempoTotal = ((Date.now() - t0) / 1000).toFixed(2);

    // Registrar auditoria
    await base44.asServiceRole.entities.AuditSincPublicacoes.create({
      tipoEvento: totalErros > totalNovas ? 'aviso' : 'sucesso',
      dataEvento: new Date().toISOString(),
      novasImportadas: totalNovas,
      duplicatasIgnoradas: totalDuplicatas,
      errosEncontrados: totalErros,
      tempoSegundos: parseFloat(tempoTotal),
      paginasProcessadas,
      mensagem: `Sync manual: ${totalNovas} novas, ${totalDuplicatas} duplicatas, ${totalErros} erros`,
      usuarioExecucao: user.email,
      tipoExecucao: 'manual'
    });

    console.log(`[SYNC] Concluído em ${tempoTotal}s — novas=${totalNovas}, dupl=${totalDuplicatas}, erros=${totalErros}`);

    return Response.json({
      success: true,
      totalProcessados: totalNovas,
      totalPulados: totalDuplicatas,
      totalErros,
      paginasProcessadas,
      periodo: { dataInicio: dataInicioPadrao, dataFim },
      tamanhoLote,
      timestamp: new Date().toISOString(),
      tempoTotalSegundos: parseFloat(tempoTotal)
    });

  } catch (error) {
    console.error(`[SYNC] ERRO CRÍTICO: ${error.message}`);

    // Tentar registrar falha
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.AuditSincPublicacoes.create({
        tipoEvento: 'erro',
        dataEvento: new Date().toISOString(),
        novasImportadas: totalNovas,
        errosEncontrados: totalErros + 1,
        mensagem: `Erro crítico: ${error.message}`,
        tipoExecucao: 'manual'
      });
    } catch { /* silencioso */ }

    return Response.json({ error: error.message, success: false }, { status: 500 });
  }
});