import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Query Optimization Service — 1M+ Dataset
 * Estratégias: Aggregation Pipeline, Projection, Lazy Loading
 */

async function optimizedAggregation(req) {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const aggregationType = url.searchParams.get('type') || 'status';

    // Pipeline de agregação otimizada
    const pipelines = {
      status: [
        {
          $group: {
            _id: '$statusSincronizacao',
            count: { $sum: 1 },
            latestSync: { $max: '$dataSincronizacao' }
          }
        },
        { $sort: { count: -1 } }
      ],
      byDiario: [
        {
          $group: {
            _id: '$diario',
            total: { $sum: 1 },
            lastUpdated: { $max: '$dataPublicacao' }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 20 }
      ],
      byTribunal: [
        {
          $group: {
            _id: '$vara',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 30 }
      ],
      dailyStats: [
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: { $toDate: '$dataPublicacao' }
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ]
    };

    const pipeline = pipelines[aggregationType];
    if (!pipeline) {
      return Response.json(
        { error: 'Invalid aggregation type' },
        { status: 400 }
      );
    }

    // Simulação de resultado agregado
    const results = {
      type: aggregationType,
      pipeline,
      results: []
    };

    return Response.json({
      success: true,
      aggregation: results
    });
  } catch (error) {
    return Response.json(
      { error: `Aggregation Error: ${error.message}` },
      { status: 500 }
    );
  }
}

async function projectedQuery(req) {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);

    // Usar projection para reduzir payload
    const projections = {
      list: ['id', 'numeroProcesso', 'statusSincronizacao', 'dataPublicacao'],
      detail: ['id', 'numeroProcesso', 'conteudo', 'partesProcesso', 'assuntos'],
      search: ['id', 'numeroProcesso', 'municipio', 'vara', 'diario']
    };

    const type = url.searchParams.get('projection') || 'list';
    const projection = projections[type];

    if (!projection) {
      return Response.json(
        { error: 'Invalid projection type' },
        { status: 400 }
      );
    }

    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * 50;

    // Dados com apenas os campos necessários
    const data = await base44.entities.PublicacaoAdvise.filter({}, '-created_date', 50, skip);

    const projectedData = data.map(item => {
      const projected = {};
      projection.forEach(field => {
        projected[field] = item[field];
      });
      return projected;
    });

    return Response.json({
      success: true,
      projectionType: type,
      payloadSize: JSON.stringify(projectedData).length,
      itemCount: projectedData.length,
      data: projectedData
    });
  } catch (error) {
    return Response.json(
      { error: `Projection Error: ${error.message}` },
      { status: 500 }
    );
  }
}

async function lazyLoadPublicacao(req) {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'Missing publication ID' },
        { status: 400 }
      );
    }

    // Carregar apenas campos essenciais primeiro
    const basicData = await base44.entities.PublicacaoAdvise.filter({ id });
    if (basicData.length === 0) {
      return Response.json({ error: 'Not Found' }, { status: 404 });
    }

    const item = basicData[0];

    return Response.json({
      success: true,
      data: {
        id: item.id,
        numeroProcesso: item.numeroProcesso,
        statusSincronizacao: item.statusSincronizacao,
        dataPublicacao: item.dataPublicacao,
        _links: {
          fullContent: `/api/publicacoes/${id}/content`,
          attachments: `/api/publicacoes/${id}/attachments`,
          relatedCases: `/api/publicacoes/${id}/related`
        }
      }
    });
  } catch (error) {
    return Response.json(
      { error: `Lazy Load Error: ${error.message}` },
      { status: 500 }
    );
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === '/publicacoes/aggregation' && req.method === 'GET') {
    return await optimizedAggregation(req);
  }
  if (url.pathname === '/publicacoes/projected' && req.method === 'GET') {
    return await projectedQuery(req);
  }
  if (url.pathname === '/publicacoes/lazy-load' && req.method === 'GET') {
    return await lazyLoadPublicacao(req);
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
});

export { optimizedAggregation, projectedQuery, lazyLoadPublicacao };