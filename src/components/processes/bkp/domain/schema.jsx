/**
 * ProcessoCEJUSC Domain Schema
 * Define structure, validation, e metadata para ProcessoCEJUSC entity
 */

export const processoSchema = {
  name: 'ProcessoCEJUSC',
  type: 'object',
  properties: {
    id: { type: 'string', description: 'ID único' },
    tipo: { 
      type: 'string', 
      enum: ['cejusc', 'procon', 'judicial_estadual', 'judicial_federal', 'stj', 'stf'],
      default: 'cejusc',
      description: 'Tipo de processo'
    },
    jurisdicao: {
      type: 'string',
      enum: ['extrajudicial', 'estadual', 'federal', 'superior'],
      description: 'Esfera de atuação'
    },
    cliente_id: { type: 'string', description: 'ID do cliente vinculado' },
    cliente_nome: { type: 'string', description: 'Nome do cliente (cache)' },
    consultor_responsavel_email: { type: 'string', description: 'Email do consultor responsável' },
    numero_processo: { type: 'string', pattern: '^[0-9]{7}-[0-9]{2}\\.[0-9]{4}\\.[0-9]{1}\\.[0-9]{2}\\.[0-9]{4}$', description: 'Número CNJ' },
    tribunal: { type: 'string', description: 'Tribunal (TJSP, TRF1, etc)' },
    classe_judicial: { type: 'string', description: 'Classe judicial' },
    status: { 
      type: 'string',
      enum: ['aberto', 'acordo', 'cancelado', 'finalizado', 'em_analise'],
      default: 'aberto',
      description: 'Status do processo'
    },
    data_ajuizamento: { type: 'string', format: 'date', description: 'Data de ajuizamento' },
    data_proxima_audiencia: { type: 'string', format: 'date', description: 'Data próxima audiência' },
    descricao: { type: 'string', description: 'Descrição/reclamação' },
    observacoes: { type: 'string', description: 'Observações internas' },
    ultima_sincronizacao: { type: 'string', format: 'date-time', description: 'Última sincronização' },
    created_date: { type: 'string', format: 'date-time' },
    updated_date: { type: 'string', format: 'date-time' }
  },
  required: ['numero_processo']
};

export const processoSearchFields = ['numero_processo', 'cliente_nome', 'tribunal', 'status'];