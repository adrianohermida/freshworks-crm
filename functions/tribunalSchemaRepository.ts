import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * TRIBUNAL SCHEMA REPOSITORY
 * Armazena e recupera schemas de resposta de cada tribunal
 * Permite enriquecimento unificado de dados
 */

class TribunalSchemaRepository {
  constructor() {
    this.schemas = new Map();
  }

  /**
   * Armazena schema de resposta de um tribunal
   */
  async storeSchema(tribunal, grau, schema) {
    const key = `${tribunal}_${grau}`;
    
    const enrichedSchema = {
      tribunal,
      grau,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      fields: schema.fields || {},
      mappings: schema.mappings || {},
      validators: schema.validators || {},
      hash: this.generateHash(schema)
    };

    this.schemas.set(key, enrichedSchema);
    
    return {
      success: true,
      tribunal,
      grau,
      fieldsCount: Object.keys(enrichedSchema.fields).length,
      hash: enrichedSchema.hash,
      stored_at: enrichedSchema.timestamp
    };
  }

  /**
   * Recupera schema de um tribunal
   */
  async retrieveSchema(tribunal, grau) {
    const key = `${tribunal}_${grau}`;
    const schema = this.schemas.get(key);
    
    if (!schema) {
      return {
        error: `Schema not found for ${tribunal}/${grau}`,
        tribunal,
        grau
      };
    }

    return schema;
  }

  /**
   * Normaliza dados usando schema do tribunal
   */
  async normalizeProcessData(tribunal, grau, rawData) {
    const schema = await this.retrieveSchema(tribunal, grau);
    
    if (schema.error) {
      return { error: schema.error, data: rawData };
    }

    const normalized = {};

    // Mapear campos de acordo com o schema
    for (const [key, field] of Object.entries(schema.fields)) {
      if (rawData[key] !== undefined) {
        normalized[key] = this.validateAndCast(rawData[key], field);
      }
    }

    // Aplicar mapeamentos customizados se existirem
    if (schema.mappings) {
      for (const [sourceKey, mapping] of Object.entries(schema.mappings)) {
        if (rawData[sourceKey] !== undefined) {
          normalized[mapping.targetKey] = this.applyMapping(rawData[sourceKey], mapping);
        }
      }
    }

    return {
      success: true,
      tribunal,
      grau,
      originalFields: Object.keys(rawData).length,
      normalizedFields: Object.keys(normalized).length,
      data: normalized
    };
  }

  /**
   * Gera lista de todos os schemas armazenados
   */
  async listSchemas() {
    const schemas = [];
    for (const [key, schema] of this.schemas) {
      schemas.push({
        tribunal: schema.tribunal,
        grau: schema.grau,
        fieldsCount: Object.keys(schema.fields).length,
        hash: schema.hash,
        stored_at: schema.timestamp,
        version: schema.version
      });
    }
    return {
      total: schemas.length,
      schemas
    };
  }

  /**
   * Valida e converte dados para o tipo esperado
   */
  validateAndCast(value, fieldDef) {
    if (!fieldDef) return value;

    switch (fieldDef.type) {
      case 'string':
        return String(value);
      case 'number':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      case 'date':
        return new Date(value).toISOString().split('T')[0];
      case 'object':
        return typeof value === 'object' ? value : {};
      case 'array':
        return Array.isArray(value) ? value : [];
      default:
        return value;
    }
  }

  /**
   * Aplica mapeamento customizado
   */
  applyMapping(value, mapping) {
    if (mapping.transform) {
      return mapping.transform(value);
    }
    return value;
  }

  /**
   * Gera hash do schema para verificar mudanças
   */
  generateHash(schema) {
    const str = JSON.stringify(schema);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// Instância global
const repository = new TribunalSchemaRepository();

// Deno Server Handler
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, tribunal, grau, schema, data } = body;

    let result;

    switch (action) {
      case 'store':
        result = await repository.storeSchema(tribunal, grau, schema);
        break;

      case 'retrieve':
        result = await repository.retrieveSchema(tribunal, grau);
        break;

      case 'normalize':
        result = await repository.normalizeProcessData(tribunal, grau, data);
        break;

      case 'list':
        result = await repository.listSchemas();
        break;

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});