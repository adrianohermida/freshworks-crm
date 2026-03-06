import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * importarCodigoForoTJSP - Importa CSV com colunas:
 * comarca, codigo, nome, tipo, ativo, id
 * (ou variações: codigo_tjsp, nome_foro, etc.)
 */

const BATCH_SIZE = 100;

function detectSep(line) {
  const sc = (line.match(/;/g) || []).length;
  const co = (line.match(/,/g) || []).length;
  const tb = (line.match(/\t/g) || []).length;
  if (tb > co && tb > sc) return '\t';
  if (sc > co) return ';';
  return ',';
}

function parseLine(line, sep) {
  const result = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i], n = line[i + 1];
    if (c === '"') { if (inQ && n === '"') { cur += '"'; i++; } else inQ = !inQ; }
    else if (c === sep && !inQ) { result.push(cur.trim()); cur = ''; }
    else cur += c;
  }
  result.push(cur.trim());
  return result;
}

function normalize(val) {
  if (!val) return '';
  return val.replace(/^["']|["']$/g, '').trim();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { csv_content, batch_number = 1, total_batches = 1 } = await req.json();
    if (!csv_content) {
      return Response.json({ error: 'csv_content obrigatório' }, { status: 400 });
    }

    const linhas = csv_content.trim().split('\n').filter(l => l.trim());
    if (linhas.length < 2) {
      return Response.json({ error: 'CSV precisa de header + dados' }, { status: 400 });
    }

    const sep = detectSep(linhas[0]);
    const headers = parseLine(linhas[0], sep).map(h => normalize(h).toLowerCase());
    const rows = linhas.slice(1).filter(l => l.trim());

    const registros = rows.map(linha => {
      const valores = parseLine(linha, sep);
      const obj = {};
      headers.forEach((col, i) => {
        obj[col] = normalize(valores[i] || '');
      });

      // Mapeamento flexível para CodigoForoTJSP
      const id_csv = obj.id || '';
      const codigo = obj.codigo || obj.codigo_tjsp || obj.codigo_foro || '';
      const nome = obj.nome || obj.nome_foro || '';
      const comarca = obj.comarca || '';
      const tipo = obj.tipo || '';
      const ativo = obj.ativo !== undefined ? (obj.ativo === '1' || obj.ativo.toLowerCase() === 'true' || obj.ativo.toLowerCase() === 'sim') : true;

      return {
        ...(id_csv && { id: id_csv }),
        codigo,
        codigo_tjsp: codigo,
        nome,
        nome_foro: nome,
        comarca,
        tipo,
        ativo,
        municipio: obj.municipio || comarca,
        grau: obj.grau || 'G1',
        atualizado_em: new Date().toISOString(),
      };
    }).filter(r => r.nome);

    let importados = 0;
    let erros = 0;

    for (let i = 0; i < registros.length; i += BATCH_SIZE) {
      const batch = registros.slice(i, i + BATCH_SIZE);
      try {
        await base44.asServiceRole.entities.CodigoForoTJSP.bulkCreate(batch);
        importados += batch.length;
        await new Promise(r => setTimeout(r, 150));
      } catch (e) {
        console.warn(`Erro batch ${i}:`, e.message);
        erros += batch.length;
      }
    }

    console.log(`[importarCodigoForoTJSP] ${importados} ok, ${erros} erros`);

    return Response.json({ success: true, batch: batch_number, total_batches, importados, erros, total: registros.length });

  } catch (error) {
    console.error('[importarCodigoForoTJSP]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});