import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const openAPISchema = {
      openapi: '3.0.0',
      info: {
        title: 'Advise Integration API',
        description: 'API completa para integração com Advise — Publicações, Intimações, Processos',
        version: '1.0.0',
        contact: {
          name: 'Legal Tasks Team',
          url: 'https://legaltasks.app'
        }
      },
      servers: [
        {
          url: process.env.ADVISE_API_URL || 'https://sandbox-api.advise.com.br',
          description: 'Advise API'
        }
      ],
      paths: {
        '/core/v1/publicacoes/consulta-avancada': {
          get: {
            operationId: 'publicacoesConsultaAvancada',
            summary: 'Consultar publicações com filtros avançados',
            tags: ['Publicações'],
            parameters: [
              {
                name: 'campos',
                in: 'query',
                schema: { type: 'string', default: '*' }
              },
              {
                name: 'DataInicioMovimento',
                in: 'query',
                schema: { type: 'string', format: 'date' }
              },
              {
                name: 'DataFimMovimento',
                in: 'query',
                schema: { type: 'string', format: 'date' }
              },
              {
                name: 'RegistrosPorPagina',
                in: 'query',
                schema: { type: 'integer', minimum: 10, maximum: 100 }
              },
              {
                name: 'paginaAtual',
                in: 'query',
                schema: { type: 'integer', minimum: 1 }
              }
            ],
            responses: {
              '200': {
                description: 'Sucesso',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        data: { type: 'object' }
                      }
                    }
                  }
                }
              },
              '401': { description: 'Não autorizado' },
              '400': { description: 'Requisição inválida' }
            }
          }
        },
        '/core/v1/intimacoes-clientes/marcar-lidos': {
          put: {
            operationId: 'intimacoesMarcarLido',
            summary: 'Marcar intimações como lidas',
            tags: ['Intimações'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      idsIntimacoes: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Array de IDs das intimações'
                      },
                      marcar: {
                        type: 'boolean',
                        description: 'true para marcar como lido, false para desmarcar'
                      }
                    },
                    required: ['idsIntimacoes']
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Sucesso' },
              '400': { description: 'Array obrigatório' },
              '401': { description: 'Não autorizado' }
            }
          }
        },
        '/core/v1/intimacoes-clientes': {
          get: {
            operationId: 'consultaIntimacoesClientes',
            summary: 'Consultar intimações de clientes',
            tags: ['Intimações'],
            parameters: [
              {
                name: 'RegistrosPorPagina',
                in: 'query',
                schema: { type: 'integer' }
              },
              {
                name: 'paginaAtual',
                in: 'query',
                schema: { type: 'integer' }
              }
            ],
            responses: {
              '200': { description: 'Sucesso' },
              '401': { description: 'Não autorizado' }
            }
          }
        },
        '/core/v1/processos-clientes': {
          get: {
            operationId: 'consultaProcessos',
            summary: 'Consultar processos de clientes',
            tags: ['Processos'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      numeroProcesso: { type: 'string' },
                      tribunal: { type: 'string' },
                      status: { type: 'string' },
                      dataInicio: { type: 'string', format: 'date' },
                      dataFim: { type: 'string', format: 'date' }
                    },
                    description: 'Ao menos um filtro obrigatório'
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Sucesso' },
              '400': { description: 'Filtro obrigatório' },
              '401': { description: 'Não autorizado' }
            }
          }
        },
        '/core/v1/anexos-processos/download/{idAnexo}': {
          post: {
            operationId: 'downloadAnexoProcesso',
            summary: 'Gerar URL de download de anexo',
            tags: ['Anexos'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      idAnexo: { type: 'string', description: 'ID do anexo' }
                    },
                    required: ['idAnexo']
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Sucesso — URL gerada' },
              '400': { description: 'ID obrigatório' },
              '401': { description: 'Não autorizado' }
            }
          }
        }
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        { BearerAuth: [] }
      ]
    };

    return Response.json(openAPISchema);
  } catch (error) {
    console.error('openAPIDocumentation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});