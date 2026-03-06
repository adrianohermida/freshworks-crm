import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * API Documentation Generator
 * Gera OpenAPI 3.0 spec e Postman collection
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // OpenAPI 3.0 Schema
    const openapi = {
      openapi: '3.0.0',
      info: {
        title: 'LegalPush API',
        description: 'Plataforma de gestão de publicações jurídicas e integração Advise',
        version: '1.0.0',
        contact: { name: 'Support', email: 'support@legalpush.com' },
        license: { name: 'Proprietary' }
      },
      servers: [
        { url: 'https://api.legalpush.com/v1', description: 'Production' },
        { url: 'https://sandbox-api.legalpush.com/v1', description: 'Sandbox' }
      ],
      paths: {
        '/publicacoes': {
          get: {
            summary: 'List all publications',
            tags: ['Publications'],
            parameters: [
              { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
              { name: 'sort', in: 'query', schema: { type: 'string', default: '-created_date' } }
            ],
            responses: {
              200: {
                description: 'List of publications',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          numeroProcesso: { type: 'string' },
                          conteudo: { type: 'string' },
                          dataPublicacao: { type: 'string', format: 'date-time' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            summary: 'Create publication',
            tags: ['Publications'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['idPublicacaoAdvise', 'numeroProcesso'],
                    properties: {
                      idPublicacaoAdvise: { type: 'string' },
                      numeroProcesso: { type: 'string' },
                      conteudo: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              201: { description: 'Publication created' },
              400: { description: 'Invalid request' }
            }
          }
        },
        '/processos': {
          get: {
            summary: 'List processes',
            tags: ['Processes'],
            responses: {
              200: { description: 'List of processes' }
            }
          }
        },
        '/search': {
          post: {
            summary: 'Global search',
            tags: ['Search'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['query'],
                    properties: {
                      query: { type: 'string' },
                      entities: { type: 'array', items: { type: 'string' } },
                      limit: { type: 'integer', default: 10 }
                    }
                  }
                }
              }
            },
            responses: {
              200: { description: 'Search results' }
            }
          }
        },
        '/sync/publicacoes': {
          post: {
            summary: 'Synchronize publications from Advise',
            tags: ['Sync'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      dataInicio: { type: 'string', format: 'date' },
                      dataFim: { type: 'string', format: 'date' }
                    }
                  }
                }
              }
            },
            responses: {
              200: { description: 'Sync completed' }
            }
          }
        }
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          PublicacaoAdvise: {
            type: 'object',
            required: ['idPublicacaoAdvise', 'numeroProcesso'],
            properties: {
              id: { type: 'string' },
              idPublicacaoAdvise: { type: 'string' },
              numeroProcesso: { type: 'string' },
              conteudo: { type: 'string' },
              dataPublicacao: { type: 'string', format: 'date-time' },
              lido: { type: 'boolean' }
            }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    };

    // Postman Collection
    const postmanCollection = {
      info: {
        name: 'LegalPush API',
        description: 'Postman collection for LegalPush API',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      auth: {
        type: 'bearer',
        bearer: [{ key: 'token', value: '{{API_TOKEN}}', type: 'string' }]
      },
      item: [
        {
          name: 'Publications',
          item: [
            {
              name: 'List Publications',
              request: {
                method: 'GET',
                url: { raw: '{{BASE_URL}}/publicacoes?limit=50', variables: [] }
              }
            },
            {
              name: 'Create Publication',
              request: {
                method: 'POST',
                url: { raw: '{{BASE_URL}}/publicacoes', variables: [] },
                body: {
                  mode: 'raw',
                  raw: JSON.stringify({
                    idPublicacaoAdvise: 'test-123',
                    numeroProcesso: '0012345-67.2024.8.26.0100',
                    conteudo: 'Test'
                  }, null, 2)
                }
              }
            }
          ]
        },
        {
          name: 'Search',
          item: [
            {
              name: 'Global Search',
              request: {
                method: 'POST',
                url: { raw: '{{BASE_URL}}/search', variables: [] },
                body: {
                  mode: 'raw',
                  raw: JSON.stringify({ query: 'processo', limit: 10 }, null, 2)
                }
              }
            }
          ]
        }
      ],
      variable: [
        { key: 'BASE_URL', value: 'https://api.legalpush.com/v1' },
        { key: 'API_TOKEN', value: '' }
      ]
    };

    // Log documentation generation
    await base44.asServiceRole.entities.AuditLog.create({
      eventType: 'ADMIN_ACTION',
      timestamp: new Date().toISOString(),
      userId: user.email,
      userRole: user.role,
      entityName: 'APIDocumentation',
      details: { openapi, postman: 'generated' },
      status: 'success'
    });

    console.log('[DOCS] OpenAPI spec and Postman collection generated');

    return Response.json({
      success: true,
      openapi,
      postman: postmanCollection,
      formats: ['OpenAPI 3.0', 'Postman v2.1'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[DOCS] ERRO:', error.message);
    return Response.json({ error: error.message, success: false }, { status: 500 });
  }
});