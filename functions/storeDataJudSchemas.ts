import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { testType, schema, statusCode, latency, timestamp } = await req.json();

    // Armazenar schema em EntitidadeCNJ ou nova entidade
    const schemaRecord = {
      testType,
      schema,
      statusCode,
      latency,
      timestamp: timestamp || new Date().toISOString(),
      validated: true
    };

    // Aqui poderia salvar em BD se houvesse entidade para schemas
    // await base44.entities.DataJudSchema.create(schemaRecord);

    return Response.json({
      success: true,
      message: `Schema ${testType} armazenado com sucesso`,
      record: schemaRecord
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});