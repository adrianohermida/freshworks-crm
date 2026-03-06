import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const ADVISE_PATH = '/core/v1/publicacoes-clientes/consulta-paginada';

/**
 * Background sync leve — executado via automação agendada.
 * Busca apenas os últimos 7 dias, lote de 50, sem auth de usuário.
 */
Deno.serve(async (req) => {
  const t0 = Date.now();

  try {
    const base44 = createClientFromRequest(req);

    const ADVISE_TOKEN = Deno.env.get('ADVISE_TOKEN');
    const ADVISE_API_URL = (Deno.env.get('ADVISE_API_URL') || 'https://sandbox-api.advise.com.br').replace(/\/$/, '');

    if (!ADVISE_TOKEN) {
      console.error('[BG-SYNC] ADVISE_TOKEN não configurado');
      return Response.json({ success: false, error: 'Token não configurado' }, { status: 500 });
    }

    const hoje = new Date().toISOString().split('T')[0];
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Carregar IDs existentes recentes (últimos 500) para deduplicar
    const existentes = await base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 500);
    const idsExistentes = new Set(existentes.map(r => String(r.idPublicacaoAdvise)));

    const url = `${ADVISE_API_URL}${ADVISE_PATH}?Campos=*&Lido=false&DataInicioMovimento=${seteDiasAtras}&DataFimMovimento=${hoje}&RegistrosPorPagina=50&paginaAtual=1`;

    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${ADVISE_TOKEN}`, 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(tid);

    if (!response.ok) {
      const msg = `API retornou ${response.status}`;
      console.error(`[BG-SYNC] ${msg}`);
      await base44.asServiceRole.entities.AuditSincPublicacoes.create({
        tipoEvento: 'erro', dataEvento: new Date().toISOString(),
        novasImportadas: 0, errosEncontrados: 1,
        mensagem: msg, tipoExecucao: 'automatica'
      });
      return Response.json({ success: false, error: msg }, { status: 500 });
    }

    const data = await response.json();
    const itens = data.itens || data.items || data.publicacoes || [];

    const novasBatch = itens
      .filter(item => {
        const id = String(item.id || item.idPublicacaoCliente || item.idMovProcessoCliente || '');
        return id && !idsExistentes.has(id);
      })
      .map(item => {
        const id = String(item.id || item.idPublicacaoCliente || item.idMovProcessoCliente || '');
        return {
          idPublicacaoAdvise: id,
          numeroProcesso: item.processos?.[0]?.numeroProcesso || item.numeroProcesso || item.numero || 'N/A',
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
        };
      });

    let novas = 0, erros = 0;
    if (novasBatch.length > 0) {
      try {
        await base44.asServiceRole.entities.PublicacaoAdvise.bulkCreate(novasBatch);
        novas = novasBatch.length;
      } catch (e) {
        console.error(`[BG-SYNC] bulkCreate falhou: ${e.message}`);
        // fallback
        for (const pub of novasBatch) {
          try {
            await base44.asServiceRole.entities.PublicacaoAdvise.create(pub);
            novas++;
          } catch { erros++; }
        }
      }
    }

    const tempo = ((Date.now() - t0) / 1000).toFixed(2);
    console.log(`[BG-SYNC] ${novas} novas, ${itens.length - novasBatch.length} dupl, ${erros} erros — ${tempo}s`);

    await base44.asServiceRole.entities.AuditSincPublicacoes.create({
      tipoEvento: 'sucesso',
      dataEvento: new Date().toISOString(),
      novasImportadas: novas,
      duplicatasIgnoradas: itens.length - novasBatch.length,
      errosEncontrados: erros,
      tempoSegundos: parseFloat(tempo),
      paginasProcessadas: 1,
      mensagem: `Background sync: ${novas} novas`,
      tipoExecucao: 'automatica'
    });

    return Response.json({ success: true, novas, duplicatas: itens.length - novasBatch.length, erros });

  } catch (error) {
    console.error(`[BG-SYNC] ERRO: ${error.message}`);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});