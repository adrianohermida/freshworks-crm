import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * importarJuizoCNJv2 - Importa CSV do CNJ com colunas:
 * data_adesao, uf, nome_serventia, ativo, classificacao, unidade,
 * juizo_100_digital, codigo_origem, tribunal, tipo_unidade, numero_serventia, id
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

    const juizos = rows.map(linha => {
      const valores = parseLine(linha, sep);
      const obj = {};
      headers.forEach((col, i) => {
        obj[col] = normalize(valores[i] || '');
      });

      const id_csv = obj.id || '';
      const tribunal = obj.tribunal || '';
      const uf = obj.uf || '';
      const nome_serventia = obj.nome_serventia || obj.nome || '';
      const numero_serventia = obj.numero_serventia || '';
      const codigo_origem = obj.codigo_origem || obj.codigo || '';
      const tipo_unidade = obj.tipo_unidade || '';
      const unidade = obj.unidade || '';
      const classificacao = obj.classificacao || '';
      const juizo_100_digital = parseBool(obj.juizo_100_digital);
      const ativo = parseBool(obj.ativo !== undefined ? obj.ativo : 'true');
      const data_adesao = obj.data_adesao || null;

      const registro = {
        tribunal,
        uf,
        nome_serventia,
        nome: nome_serventia,
        numero_serventia,
        codigo_origem,
        tipo_unidade,
        unidade,
        classificacao,
        juizo_100_digital,
        ativo,
        origem: 'CNJ_DATAJUD',
        atualizado_em: new Date().toISOString(),
      };

      if (id_csv) registro.id = id_csv;
      if (data_adesao) registro.data_adesao = data_adesao;
      if (obj.municipio) registro.municipio = obj.municipio;
      if (obj.grau) registro.grau = obj.grau;
      if (obj.segmento) registro.segmento = obj.segmento;

      return registro;
    }).filter(j => j.tribunal || j.nome_serventia);

    let importados = 0;
    let erros = 0;

    for (let i = 0; i < juizos.length; i += BATCH_SIZE) {
      const batch = juizos.slice(i, i + BATCH_SIZE);
      try {
        await base44.asServiceRole.entities.JuizoCNJ.bulkCreate(batch);
        importados += batch.length;
        await new Promise(r => setTimeout(r, 150));
      } catch (e) {
        console.warn(`Erro batch ${i}:`, e.message);
        erros += batch.length;
      }
    }

    console.log(`[importarJuizoCNJv2] Batch ${batch_number}/${total_batches}: ${importados} ok, ${erros} erros`);

    return Response.json({ success: true, batch: batch_number, total_batches, importados, erros, total: juizos.length });

  } catch (error) {
    console.error('[importarJuizoCNJv2]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});