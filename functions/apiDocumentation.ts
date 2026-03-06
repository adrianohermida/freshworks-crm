import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * API Documentation Generator
 * - Swagger/OpenAPI spec
 * - Endpoint reference
 * - SDK examples
 * - Authentication guide
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'openapi' } = await req.json();

    // OPENAPI SPEC
    if (action === 'openapi') {
      return Response.json({
        openapi: '3.0.0',
        info: {
          title: 'DataJud Integrador API',
          version: '1.5.0',
          description: 'API para integração com DataJud e gestão de processos judiciais'
        },
        servers: [
          { url: 'https://api.datajud.io', description: 'Production' },
          { url: 'https://staging.datajud.io', description: 'Staging' }
        ],
        paths: {
          '/entities/Process': {
            get: {
              summary: 'Listar processos',
              tags: ['Processes'],
              parameters: [
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
                { name: 'skip', in: 'query', schema: { type: 'integer', default: 0 } }
              ],
              responses: {
                200: { description: 'Lista de processos' }
              }
            },
            post: {
              summary: 'Criar processo',
              tags: ['Processes'],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        cnj_number: { type: 'string' },
                        title: { type: 'string' }
                      }
                    }
                  }
                }
              },
              responses: {
                201: { description: 'Processo criado' }
              }
            }
          },
          '/entities/Deadline': {
            get: {
              summary: 'Listar prazos',
              tags: ['Deadlines'],
              responses: {
                200: { description: 'Lista de prazos' }
              }
            }
          },
          '/functions/datajudFetchProcess': {
            post: {
              summary: 'Sincronizar processo com DataJud',
              tags: ['Integrations'],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        cnj_number: { type: 'string' },
                        title: { type: 'string' }
                      }
                    }
                  }
                }
              },
              responses: {
                200: { description: 'Processo sincronizado' }
              }
            }
          }
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer'
            }
          }
        },
        security: [{ bearerAuth: [] }]
      });
    }

    // ENDPOINTS REFERENCE
    if (action === 'endpoints') {
      return Response.json({
        success: true,
        endpoints: [
          {
            method: 'GET',
            path: '/entities/Process',
            description: 'Listar todos os processos',
            auth: true,
            rate_limit: '100/min'
          },
          {
            method: 'POST',
            path: '/entities/Process',
            description: 'Criar novo processo',
            auth: true,
            rate_limit: '10/min'
          },
          {
            method: 'GET',
            path: '/entities/Deadline',
            description: 'Listar prazos',
            auth: true,
            rate_limit: '100/min'
          },
          {
            method: 'POST',
            path: '/functions/datajudFetchProcess',
            description: 'Sincronizar com DataJud',
            auth: true,
            rate_limit: '5/min'
          },
          {
            method: 'POST',
            path: '/webhooks/datajud',
            description: 'Webhook para atualizações DataJud',
            auth: false,
            rate_limit: 'Unlimited'
          }
        ]
      });
    }

    // SDK EXAMPLES
    if (action === 'sdk_examples') {
      return Response.json({
        success: true,
        examples: {
          javascript: `
import { base44 } from '@/api/base44Client';

// Listar processos
const processes = await base44.entities.Process.list('-synced_at', 50);

// Criar processo
const newProcess = await base44.entities.Process.create({
  cnj_number: '0000001-00.0000.0.00000.0000000',
  title: 'Meu primeiro processo'
});

// Sincronizar com DataJud
const result = await base44.functions.invoke('datajudFetchProcess', {
  cnj_number: '0000001-00.0000.0.00000.0000000'
});
          `.trim(),
          python: `
from datajud_sdk import DataJudClient

client = DataJudClient(api_key='your-api-key')

# Listar processos
processes = client.processes.list(limit=50)

# Criar processo
new_process = client.processes.create(
    cnj_number='0000001-00.0000.0.00000.0000000',
    title='Meu primeiro processo'
)

# Sincronizar
result = client.sync_datajud(
    cnj_number='0000001-00.0000.0.00000.0000000'
)
          `.trim(),
          curl: `
# Listar processos
curl -X GET https://api.datajud.io/entities/Process \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"

# Criar processo
curl -X POST https://api.datajud.io/entities/Process \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "cnj_number": "0000001-00.0000.0.00000.0000000",
    "title": "Meu primeiro processo"
  }'
          `.trim()
        }
      });
    }

    // AUTHENTICATION GUIDE
    if (action === 'auth_guide') {
      return Response.json({
        success: true,
        guide: {
          title: 'Autenticação DataJud API',
          methods: [
            {
              name: 'Bearer Token',
              description: 'Token JWT passado no header Authorization',
              header: 'Authorization: Bearer {token}',
              expiry: '24 horas'
            }
          ],
          steps: [
            'Fazer login via /auth/signin',
            'Obter token no response',
            'Incluir em todos os requests: Authorization: Bearer {token}',
            'Renovar token antes de expirar'
          ],
          best_practices: [
            'Nunca compartilhe tokens',
            'Use HTTPS sempre',
            'Implemente rate limiting no cliente',
            'Valide respostas de erro'
          ]
        }
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[APIDocumentation] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});