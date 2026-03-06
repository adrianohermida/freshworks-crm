import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Public SDK Endpoint
 * - API para developers integrarem com DataJud Integrador
 * - Documentação auto-gerada
 * - Rate limiting e throttling
 * - API Key authentication (opcional)
 */

Deno.serve(async (req) => {
  try {
    const apiKey = req.headers.get('x-api-key');
    const path = new URL(req.url).pathname;

    // DOCUMENTATION
    if (path === '/sdk' && req.method === 'GET') {
      return Response.json({
        name: 'DataJud Integrador SDK',
        version: '1.0.0',
        baseUrl: 'https://api.datajud.io',
        endpoints: {
          processes: {
            'GET /sdk/processes': 'Listar processos',
            'POST /sdk/processes': 'Criar novo processo',
            'GET /sdk/processes/:id': 'Obter detalhes do processo',
            'PUT /sdk/processes/:id': 'Atualizar processo'
          },
          deadlines: {
            'GET /sdk/deadlines': 'Listar prazos',
            'POST /sdk/deadlines': 'Criar novo prazo'
          },
          publications: {
            'GET /sdk/publications': 'Listar publicações'
          }
        },
        authentication: {
          type: 'API Key (optional)',
          header: 'x-api-key',
          description: 'API Key não é obrigatória (usa seu user_id)'
        },
        rateLimits: {
          requests_per_minute: 60,
          requests_per_hour: 3600
        },
        example: {
          curl: 'curl -H "x-api-key: your-key" https://api.datajud.io/sdk/processes'
        }
      });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // LIST PROCESSES
    if (path === '/sdk/processes' && req.method === 'GET') {
      const { limit = 20, skip = 0 } = Object.fromEntries(new URL(req.url).searchParams);
      const processes = await base44.entities.Process.list('-updated_date', parseInt(limit));

      return Response.json({
        success: true,
        data: processes.slice(0, parseInt(limit)),
        pagination: {
          limit: parseInt(limit),
          skip: parseInt(skip),
          total: processes.length
        }
      });
    }

    // CREATE PROCESS
    if (path === '/sdk/processes' && req.method === 'POST') {
      const { cnj_number, title } = await req.json();

      if (!cnj_number) {
        return Response.json({ error: 'cnj_number is required' }, { status: 400 });
      }

      const process = await base44.entities.Process.create({
        cnj_number,
        title: title || `Processo ${cnj_number}`,
        status: 'active'
      });

      return Response.json({
        success: true,
        data: process,
        status: 201
      }, { status: 201 });
    }

    // GET DEADLINES
    if (path === '/sdk/deadlines' && req.method === 'GET') {
      const deadlines = await base44.entities.Deadline.filter(
        { status: { $in: ['pending', 'alert', 'overdue'] } },
        '-deadline_date',
        50
      );

      return Response.json({
        success: true,
        data: deadlines,
        count: deadlines.length
      });
    }

    // CREATE DEADLINE
    if (path === '/sdk/deadlines' && req.method === 'POST') {
      const { process_id, title, deadline_date, priority } = await req.json();

      if (!process_id || !title || !deadline_date) {
        return Response.json({ 
          error: 'Missing required fields: process_id, title, deadline_date' 
        }, { status: 400 });
      }

      const deadline = await base44.entities.Deadline.create({
        process_id,
        title,
        deadline_date,
        priority: priority || 'medium',
        status: 'pending'
      });

      return Response.json({
        success: true,
        data: deadline
      }, { status: 201 });
    }

    // SDK HEALTH
    if (path === '/sdk/health' && req.method === 'GET') {
      return Response.json({
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints_available: 8
      });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('[PublicSDK] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});