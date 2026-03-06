import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, entityType } = await req.json();

    const validation = validateTPUSchema(data, entityType);

    return Response.json({
      success: validation.isValid,
      validation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function validateTPUSchema(data, entityType) {
  const schemas = {
    juizos: {
      required: ['codigo', 'nome', 'tribunal', 'tipo'],
      validate: (row) => ({
        codigo: row.codigo?.toString().length > 0,
        nome: row.nome?.toString().length > 2,
        tribunal: row.tribunal?.toString().length > 0,
        tipo: ['vara', 'juizado', 'tribunal'].includes(row.tipo?.toLowerCase())
      })
    },
    serventias: {
      required: ['codigo', 'nome', 'tribunal', 'municipio'],
      validate: (row) => ({
        codigo: row.codigo?.toString().length > 0,
        nome: row.nome?.toString().length > 2,
        tribunal: row.tribunal?.toString().length > 0,
        municipio: row.municipio?.toString().length > 0
      })
    },
    movimentos: {
      required: ['cod_movimento', 'nome', 'categoria'],
      validate: (row) => ({
        cod_movimento: Number.isInteger(parseInt(row.cod_movimento)),
        nome: row.nome?.toString().length > 2,
        categoria: ['Magistrado', 'Serventuário'].includes(row.categoria)
      })
    }
  };

  const schema = schemas[entityType];
  if (!schema) {
    return { isValid: false, errors: ['Entity type não suportado'] };
  }

  const rows = Array.isArray(data) ? data : [data];
  const errors = [];
  const validRows = [];
  let rowIndex = 0;

  for (const row of rows) {
    rowIndex++;
    
    // Validar campos obrigatórios
    const missingFields = schema.required.filter(field => !row[field]);
    if (missingFields.length > 0) {
      errors.push(`Linha ${rowIndex}: Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      continue;
    }

    // Validar tipo de dados
    const validationResults = schema.validate(row);
    const invalidFields = Object.entries(validationResults)
      .filter(([_, valid]) => !valid)
      .map(([field]) => field);

    if (invalidFields.length > 0) {
      errors.push(`Linha ${rowIndex}: Campos inválidos: ${invalidFields.join(', ')}`);
    } else {
      validRows.push(row);
    }
  }

  return {
    isValid: errors.length === 0,
    totalRows: rows.length,
    validRows: validRows.length,
    invalidRows: rows.length - validRows.length,
    errors,
    validData: validRows
  };
}