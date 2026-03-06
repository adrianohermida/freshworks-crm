import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Importa Códigos de Foro TJSP de CSV
 * Formato: codigo_foro,nome_foro,municipio,comarca,circunscricao,tipo_comarca
 */

const BATCH_SIZE = 100;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { csv_content } = await req.json();
    if (!csv_content) {
      return Response.json({ error: 'csv_content obrigatório' }, { status: 400 });
    }

    const linhas = csv_content.trim().split('\n');
    const header = linhas[0].split(',').map(h => h.trim());
    const rows = linhas.slice(1).filter(l => l.trim());

    const codigos = rows.map(linha => {
      const valores = linha.split(',').map(v => v.trim());
      const obj = {};
      header.forEach((col, i) => {
        if (valores[i]) {
          obj[col] = valores[i];
        }
      });
      return obj;
    }).filter(c => c.codigo_foro && c.nome_foro);

    let importados = 0;
    let erros = 0;

    for (let i = 0; i < codigos.length; i += BATCH_SIZE) {
      const batch = codigos.slice(i, i + BATCH_SIZE);
      try {
        await base44.asServiceRole.entities.CodigoFotoTJSP.bulkCreate(batch);
        importados += batch.length;
        await new Promise(r => setTimeout(r, 200));
      } catch (e) {
        console.warn(`Erro batch:`, e.message);
        erros += batch.length;
      }
    }

    return Response.json({
      success: true,
      importados,
      erros,
      total: codigos.length,
    });

  } catch (error) {
    console.error('[importarCodigoFotoTJSP]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});