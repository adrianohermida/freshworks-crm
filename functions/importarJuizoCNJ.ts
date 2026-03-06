import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Importa Juízos CNJ de CSV em batches
 * Formato esperado: tribunal,uf,numero_serventia,nome_serventia,juizo_100_digital,data_adesao,codigo_origem,tipo_unidade,classificacao,unidade
 */

const BATCH_SIZE = 100;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { csv_content, batch_number, total_batches } = await req.json();
    if (!csv_content) {
      return Response.json({ error: 'csv_content obrigatório' }, { status: 400 });
    }

    const linhas = csv_content.trim().split('\n');
    const header = linhas[0].split(',').map(h => h.trim());
    const rows = linhas.slice(1).filter(l => l.trim());

    const juizos = rows.map(linha => {
      const valores = linha.split(',').map(v => v.trim());
      const obj = {};
      header.forEach((col, i) => {
        if (valores[i]) {
          obj[col] = valores[i];
        }
      });

      // Converter juizo_100_digital
      if (obj.juizo_100_digital) {
        obj.juizo_100_digital = obj.juizo_100_digital.toLowerCase() === 'true' || obj.juizo_100_digital === '1';
      }

      return obj;
    }).filter(j => j.tribunal && j.codigo_origem);

    let importados = 0;
    let erros = 0;

    // Importar em batches
    for (let i = 0; i < juizos.length; i += BATCH_SIZE) {
      const batch = juizos.slice(i, i + BATCH_SIZE);
      try {
        await base44.asServiceRole.entities.JuizoCNJ.bulkCreate(batch);
        importados += batch.length;
        // Pequeno delay entre batches
        await new Promise(r => setTimeout(r, 200));
      } catch (e) {
        console.warn(`Erro batch ${i}-${i + BATCH_SIZE}:`, e.message);
        erros += batch.length;
      }
    }

    console.log(`[importarJuizoCNJ] Batch ${batch_number}/${total_batches}: ${importados} ok, ${erros} erros`);

    return Response.json({
      success: true,
      batch: batch_number,
      total_batches,
      importados,
      erros,
      total_processado: juizos.length,
    });

  } catch (error) {
    console.error('[importarJuizoCNJ]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});