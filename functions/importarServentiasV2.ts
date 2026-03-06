import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * importarServentiasV2 - Importa CSV com colunas:
 * tribunal, uf, municipio, numero_serventia, nome_serventia,
 * telefone, email, endereco, geolocalizacao, ativo
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

function parseBool(val) {
  if (!val) return true;
  const s = val.toString().toLowerCase().trim();
  return s === '1' || s === 'true' || s === 'sim' || s === 's';
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

    const serventias = rows.map(linha => {
      const valores = parseLine(linha, sep);
      const obj = {};
      headers.forEach((col, i) => {
        obj[col] = normalize(valores[i] || '');
      });

      // Mapeamento flexível
      const tribunal = obj.tribunal || obj.tribunal_sigla || '';
      const uf = obj.uf || '';
      const municipio = obj.municipio || obj.cidade || '';
      const numero_serventia = obj.numero_serventia || obj.numero || obj.codigo || '';
      const nome_serventia = obj.nome_serventia || obj.nome || '';
      const telefone = obj.telefone || obj.phone || '';
      const email = obj.email || '';

      // Endereço: limpar lat/long se misturado
      let endereco = obj.endereco || obj.address || '';
      endereco = endereco.split(/lat\.|long\.|latitude|longitude/i)[0].trim();

      const geolocalizacao = obj.geolocalizacao || obj.geo || obj.coordenadas || '';
      const ativo = parseBool(obj.ativo !== undefined ? obj.ativo : 'true');

      return {
        tribunal,
        uf,
        municipio,
        numero_serventia,
        nome_serventia,
        ...(telefone && { telefone }),
        ...(email && { email }),
        ...(endereco && { endereco }),
        ...(geolocalizacao && { geolocalizacao }),
        ativo,
        atualizado_em: new Date().toISOString(),
      };
    }).filter(s => s.tribunal && s.numero_serventia);

    let importados = 0;
    let erros = 0;

    for (let i = 0; i < serventias.length; i += BATCH_SIZE) {
      const batch = serventias.slice(i, i + BATCH_SIZE);
      try {
        await base44.asServiceRole.entities.Serventia.bulkCreate(batch);
        importados += batch.length;
        await new Promise(r => setTimeout(r, 150));
      } catch (e) {
        console.warn(`Erro batch ${i}:`, e.message);
        erros += batch.length;
      }
    }

    console.log(`[importarServentiasV2] Batch ${batch_number}/${total_batches}: ${importados} ok, ${erros} erros`);

    return Response.json({ success: true, batch: batch_number, total_batches, importados, erros, total: serventias.length });

  } catch (error) {
    console.error('[importarServentiasV2]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});