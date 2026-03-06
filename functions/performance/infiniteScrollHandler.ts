import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Infinite Scroll Handler — 1M+ Publicações
 * Suporta scroll infinito com cursor-based pagination
 */

async function getPublicacoesWithCursor(req) {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);

    const cursor = url.searchParams.get('cursor') || '';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '30'), 100);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    // Construir query
    const query = {};
    if (search) {
      query.numeroProcesso = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.statusSincronizacao = status;
    }

    // Cursor-based pagination (melhor que offset para grandes datasets)
    if (cursor) {
      query.id = { $gt: cursor };
    }

    // Buscar limit + 1 para determinar se há próximo
    const publicacoes = await base44.entities.PublicacaoAdvise.filter(
      query,
      'id',
      limit + 1
    );

    const hasMore = publicacoes.length > limit;
    const data = publicacoes.slice(0, limit);
    const nextCursor = data.length > 0 ? data[data.length - 1].id : null;

    return Response.json({
      success: true,
      data,
      pagination: {
        cursor: nextCursor,
        hasMore,
        count: data.length
      }
    });
  } catch (error) {
    return Response.json(
      { error: `Cursor Query Error: ${error.message}` },
      { status: 500 }
    );
  }
}

async function streamPublicacoes(req) {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);

    const status = url.searchParams.get('status') || '';
    const batchSize = 100;

    // Streaming response para grandes datasets
    let lastId = '';
    const encoder = new TextEncoder();

    const body = new ReadableStream({
      async start(controller) {
        try {
          let hasMore = true;
          let batchCount = 0;

          while (hasMore && batchCount < 10000) {
            const query = status ? { statusSincronizacao: status } : {};
            if (lastId) {
              query.id = { $gt: lastId };
            }

            const batch = await base44.entities.PublicacaoAdvise.filter(
              query,
              'id',
              batchSize
            );

            if (batch.length === 0) {
              hasMore = false;
              break;
            }

            // Enviar cada item como JSON Lines format
            for (const item of batch) {
              controller.enqueue(
                encoder.encode(JSON.stringify(item) + '\n')
              );
              lastId = item.id;
            }

            batchCount++;
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Transfer-Encoding': 'chunked'
      }
    });
  } catch (error) {
    return Response.json(
      { error: `Stream Error: ${error.message}` },
      { status: 500 }
    );
  }
}

async function getVirtualScrollData(req) {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);

    const offset = parseInt(url.searchParams.get('offset') || '0');
    const windowSize = parseInt(url.searchParams.get('windowSize') || '50');
    const bufferSize = 10; // Carregar buffer antes/depois

    const start = Math.max(0, offset - bufferSize);
    const end = offset + windowSize + bufferSize;

    const publicacoes = await base44.entities.PublicacaoAdvise.filter(
      {},
      '-created_date',
      end - start,
      start
    );

    return Response.json({
      success: true,
      offset: start,
      data: publicacoes,
      totalRequested: end - start,
      virtualScrollConfig: {
        bufferSize,
        windowSize,
        estimatedItemHeight: 60
      }
    });
  } catch (error) {
    return Response.json(
      { error: `Virtual Scroll Error: ${error.message}` },
      { status: 500 }
    );
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === '/publicacoes/cursor' && req.method === 'GET') {
    return await getPublicacoesWithCursor(req);
  }
  if (url.pathname === '/publicacoes/stream' && req.method === 'GET') {
    return await streamPublicacoes(req);
  }
  if (url.pathname === '/publicacoes/virtual-scroll' && req.method === 'GET') {
    return await getVirtualScrollData(req);
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
});

export { getPublicacoesWithCursor, streamPublicacoes, getVirtualScrollData };