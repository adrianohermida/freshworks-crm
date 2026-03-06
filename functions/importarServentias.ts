import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Importa Serventias de CSV com deduplicação e recuperação individual
 * Formato: tribunal,uf,municipio,numero_serventia,nome_serventia,telefone,email,endereco,cep,comarca,foro,tipo
 */

const BATCH_SIZE = 50; // Reduzido para melhor controle de erros

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

    // Parser CSV com suporte a quoted fields
    function parseCsvLine(linha) {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < linha.length; i++) {
        const char = linha[i];
        const nextChar = linha[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }

      result.push(current.trim());
      return result;
    }

    const serventias = rows.map(linha => {
      const valores = parseCsvLine(linha);
      const obj = {};

      header.forEach((col, i) => {
        let valor = valores[i];
        if (!valor) return;

        // Remover aspas se presentes
        if (valor.startsWith('"') && valor.endsWith('"')) {
          valor = valor.slice(1, -1);
        }

        valor = valor.trim();

        // Filtrar valores inválidos
        if (!valor || valor.toLowerCase() === 'nd' || valor.toLowerCase() === 'n/a') {
          return;
        }

        // Remover latitude/longitude misturados
        if (col === 'endereco') {
          valor = valor.split(/Lat\.|Long\.|latitude|longitude/i)[0].trim();
          if (!valor) return;
        }

        obj[col] = valor;
      });

      // Converter ativa
      if (obj.ativa !== undefined) {
        obj.ativa = obj.ativa.toLowerCase() === 'true' || obj.ativa === '1';
      } else {
        obj.ativa = true;
      }

      // Normalizar telefone
      if (obj.telefone !== undefined) {
        const tel = obj.telefone.toString().trim();
        obj.telefone = tel && tel.length > 0 ? tel : null;
      }

      return obj;
    }).filter(s => s.tribunal && s.numero_serventia);

    // Deduplicar por tribunal + numero_serventia (chave única)
    const deduplicado = [];
    const chaves_vistas = new Set();

    for (const s of serventias) {
      const chave = `${s.tribunal}|${s.numero_serventia}`;
      if (!chaves_vistas.has(chave)) {
        chaves_vistas.add(chave);
        deduplicado.push(s);
      }
    }

    let importados = 0;
    let erros = 0;
    const detalhes_erros = [];

    // Importar em batches, mas recuperar registro por registro em caso de erro
    for (let i = 0; i < deduplicado.length; i += BATCH_SIZE) {
      const batch = deduplicado.slice(i, i + BATCH_SIZE);

      try {
        await base44.asServiceRole.entities.Serventia.bulkCreate(batch);
        importados += batch.length;
      } catch (batchError) {
        // Se batch falhar, tentar um por um
        for (const serventia of batch) {
          try {
            await base44.asServiceRole.entities.Serventia.create(serventia);
            importados++;
          } catch (itemError) {
            erros++;
            detalhes_erros.push({
              serventia: `${serventia.tribunal}/${serventia.numero_serventia}`,
              erro: itemError.message?.slice(0, 100),
            });
          }
        }
      }

      await new Promise(r => setTimeout(r, 100));
    }

    console.log(`[importarServentias] Batch ${batch_number}/${total_batches}: ${importados} ok, ${erros} erros, ${serventias.length - deduplicado.length} duplicados`);

    return Response.json({
      success: true,
      batch: batch_number,
      total_batches,
      importados,
      erros,
      duplicados: serventias.length - deduplicado.length,
      total_processado: deduplicado.length,
      detalhes_erros: detalhes_erros.slice(0, 10), // Retorna primeiros 10 erros
    });

  } catch (error) {
    console.error('[importarServentias]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});