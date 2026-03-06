import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Importa dados SQL de Classes, Movimentos e Assuntos TPU.
 *
 * Melhorias:
 * - processamento incremental (stream) para arquivos grandes (>50MB)
 * - parser de INSERT com múltiplas tuplas VALUES (...),(...)
 * - identificação correta de tabela (sem bug de operador ||)
 * - inserção em lote com fallback para upsert idempotente por código
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Apenas POST permitido' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

const BATCH_SIZE = 100;

type LinhaRegistro = Array<string | null>;

type TabelaConfig = {
  entity: 'TPUClasse' | 'TPUMovimento' | 'TPUAssunto';
  cols: string[];
};

const MAPEAMENTO: Record<string, TabelaConfig> = {
  tpu_classe: { entity: 'TPUClasse', cols: ['codigo', 'nome', 'ativo'] },
  tpu_movimento: { entity: 'TPUMovimento', cols: ['codigo', 'nome', 'tipo_andamento', 'ativo'] },
  tpu_assunto: { entity: 'TPUAssunto', cols: ['codigo', 'nome', 'ativo'] },
};

function normalizarTabela(insertSql: string): string | null {
  const lower = insertSql.toLowerCase();
  for (const tabela of Object.keys(MAPEAMENTO)) {
    if (
      lower.includes(`into ${tabela}`) ||
      lower.includes(`into \`${tabela}\``) ||
      lower.includes(`into "${tabela}"`)
    ) {
      return tabela;
    }
  }
  return null;
}

function splitValuesTuples(valuesPart: string): string[] {
  const tuples: string[] = [];
  let inQuote = false;
  let quoteChar = "'";
  let depth = 0;
  let start = -1;

  for (let i = 0; i < valuesPart.length; i += 1) {
    const ch = valuesPart[i];
    const prev = i > 0 ? valuesPart[i - 1] : '';

    if ((ch === "'" || ch === '"') && prev !== '\\') {
      if (!inQuote) {
        inQuote = true;
        quoteChar = ch;
      } else if (quoteChar === ch) {
        inQuote = false;
      }
      continue;
    }

    if (inQuote) continue;

    if (ch === '(') {
      if (depth === 0) start = i;
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        tuples.push(valuesPart.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return null;
}

function splitValuesTuples(valuesPart: string): string[] {
  const tuples: string[] = [];
  let inQuote = false;
  let quoteChar = "'";
  let depth = 0;
  let start = -1;

  for (let i = 0; i < valuesPart.length; i += 1) {
    const ch = valuesPart[i];
    const prev = i > 0 ? valuesPart[i - 1] : '';

    if ((ch === "'" || ch === '"') && prev !== '\\') {
      if (!inQuote) {
        inQuote = true;
        quoteChar = ch;
      } else if (quoteChar === ch) {
        inQuote = false;
      }
      continue;
    }

  return tuples;
}

function parseTuple(tuple: string): LinhaRegistro {
  const inner = tuple.trim().replace(/^\(/, '').replace(/\)$/, '');
  const out: LinhaRegistro = [];

  let token = '';
  let inQuote = false;
  let quoteChar = "'";

  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    const prev = i > 0 ? inner[i - 1] : '';

    if ((ch === "'" || ch === '"') && prev !== '\\') {
      if (!inQuote) {
        inQuote = true;
        quoteChar = ch;
      } else if (quoteChar === ch) {
        inQuote = false;
      }
      token += ch;
      continue;
    }

    if (ch === ',' && !inQuote) {
      out.push(normalizeScalar(token));
      token = '';
      continue;
    }

    token += ch;
  }

  if (token.length > 0) out.push(normalizeScalar(token));
  return out;
}

function normalizeScalar(raw: string): string | null {
  const t = raw.trim();
  if (!t || /^null$/i.test(t)) return null;

  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    const body = t.slice(1, -1);
    return body.replace(/\\'/g, "'").replace(/\\"/g, '"');
  }

  return t;
}

async function upsertByCodigo(base44: any, entity: string, doc: Record<string, any>) {
  const codigo = Number(doc.codigo);
  if (!Number.isFinite(codigo)) return 'invalid';

  const existentes = await base44.asServiceRole.entities[entity].filter({ codigo }, null, 1);
  if (Array.isArray(existentes) && existentes.length > 0) {
    await base44.asServiceRole.entities[entity].update(existentes[0].id, {
      ...doc,
      codigo,
      updated_date: new Date().toISOString(),
    });
    return 'updated';
  }

  await base44.asServiceRole.entities[entity].create({ ...doc, codigo });
  return 'created';
}

async function importarTabela(base44: any, nomeTabela: string, registros: LinhaRegistro[]) {
  let importados = 0;
  let atualizados = 0;
  let erros = 0;

  const config = MAPEAMENTO[nomeTabela];
  if (!config) return { importados, atualizados, erros, aviso: `Tabela ${nomeTabela} não mapeada` };

  for (let i = 0; i < registros.length; i += BATCH_SIZE) {
    const batch = registros.slice(i, i + BATCH_SIZE);

    const dados = batch
      .map((r) => {
        const obj: Record<string, any> = {};
        config.cols.forEach((col, idx) => {
          obj[col] = r[idx] ?? null;
        });

        if (obj.codigo != null) obj.codigo = Number(obj.codigo);
        if (obj.ativo != null) {
          const ativo = String(obj.ativo).toLowerCase();
          obj.ativo = ['1', 'true', 't', 's', 'sim'].includes(ativo);
        }

        return obj;
      })
      .filter((d) => Number.isFinite(d.codigo));

    if (dados.length === 0) continue;

    try {
      await base44.asServiceRole.entities[config.entity].bulkCreate(dados);
      importados += dados.length;
    } catch (e) {
      // fallback idempotente por codigo
      for (const doc of dados) {
        try {
          const status = await upsertByCodigo(base44, config.entity, doc);
          if (status === 'created') importados += 1;
          else if (status === 'updated') atualizados += 1;
          else erros += 1;
        } catch {
          erros += 1;
        }
      }

      console.warn(`[importarTPUSql] fallback upsert batch ${nomeTabela}: ${(e as Error).message}`);
    }

    if (i + BATCH_SIZE < registros.length) {
      await new Promise((r) => setTimeout(r, 120));
    }
  }

  return { importados, atualizados, erros };
}

function processarStatement(statement: string, porTabela: Record<string, LinhaRegistro[]>) {
  const sql = statement.trim();
  if (!sql || !sql.toLowerCase().startsWith('insert')) return false;

  const tabela = normalizarTabela(sql);
  if (!tabela) return false;

  const valuesIdx = sql.toLowerCase().indexOf('values');
  if (valuesIdx < 0) return false;

  const valuesPart = sql.slice(valuesIdx + 6).replace(/;\s*$/, '').trim();
  const tuples = splitValuesTuples(valuesPart);

  if (!porTabela[tabela]) porTabela[tabela] = [];
  for (const tuple of tuples) {
    porTabela[tabela].push(parseTuple(tuple));
  }

  return true;
}

async function parseSqlStream(arquivo: File) {
  const porTabela: Record<string, LinhaRegistro[]> = {};
  let statements = 0;

  const reader = arquivo.stream().getReader();
  const decoder = new TextDecoder();
  let carry = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    carry += decoder.decode(value, { stream: true });

    let idx = carry.indexOf(';');
    while (idx >= 0) {
      const stmt = carry.slice(0, idx + 1);
      if (processarStatement(stmt, porTabela)) statements += 1;
      carry = carry.slice(idx + 1);
      idx = carry.indexOf(';');
    }
  }

  carry += decoder.decode();
  if (carry.trim()) {
    if (processarStatement(carry, porTabela)) statements += 1;
  }

  return { porTabela, statements };
}

function processarStatement(statement: string, porTabela: Record<string, LinhaRegistro[]>) {
  const sql = statement.trim();
  if (!sql || !sql.toLowerCase().startsWith('insert')) return false;

  const tabela = normalizarTabela(sql);
  if (!tabela) return false;

  const valuesIdx = sql.toLowerCase().indexOf('values');
  if (valuesIdx < 0) return false;

  const valuesPart = sql.slice(valuesIdx + 6).replace(/;\s*$/, '').trim();
  const tuples = splitValuesTuples(valuesPart);

  if (!porTabela[tabela]) porTabela[tabela] = [];
  for (const tuple of tuples) {
    porTabela[tabela].push(parseTuple(tuple));
  }

  return true;
}

async function parseSqlStream(arquivo: File) {
  const porTabela: Record<string, LinhaRegistro[]> = {};
  let statements = 0;

  const reader = arquivo.stream().getReader();
  const decoder = new TextDecoder();
  let carry = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    carry += decoder.decode(value, { stream: true });

    let idx = carry.indexOf(';');
    while (idx >= 0) {
      const stmt = carry.slice(0, idx + 1);
      if (processarStatement(stmt, porTabela)) statements += 1;
      carry = carry.slice(idx + 1);
      idx = carry.indexOf(';');
    }
  }

  carry += decoder.decode();
  if (carry.trim()) {
    if (processarStatement(carry, porTabela)) statements += 1;
  }

  return { porTabela, statements };
}

function processarStatement(statement: string, porTabela: Record<string, LinhaRegistro[]>) {
  const sql = statement.trim();
  if (!sql || !sql.toLowerCase().startsWith('insert')) return false;

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await req.formData();
    const arquivo = formData.get('arquivo') as File | null;

    if (!arquivo) {
      return Response.json({ error: 'Arquivo SQL obrigatório' }, { status: 400 });
    }

    const tamanhoBytes = arquivo.size ?? 0;
    console.log(`[importarTPUSql] Início arquivo ${(tamanhoBytes / 1024 / 1024).toFixed(2)}MB`);

    const { porTabela, statements } = await parseSqlStream(arquivo);

    const resultados: Record<string, any> = {};
    for (const [tabela, registros] of Object.entries(porTabela)) {
      console.log(`[importarTPUSql] Importando ${registros.length} registros de ${tabela}`);
      resultados[tabela] = await importarTabela(base44, tabela, registros);
    }

    const total = Object.values(resultados).reduce(
      (acc: any, r: any) => {
        acc.importado += r.importados || 0;
        acc.atualizados += r.atualizados || 0;
        acc.erros += r.erros || 0;
        return acc;
      },
      { importado: 0, atualizados: 0, erros: 0 },
    );

    return Response.json({
      success: true,
      tamanhoMB: (tamanhoBytes / 1024 / 1024).toFixed(2),
      statements,
      porTabela: resultados,
      total,
    });
  } catch (error) {
    console.error('[importarTPUSql]', (error as Error).message);
    return Response.json(
      {
        error: (error as Error).message || 'Erro ao importar SQL',
        stack: (error as Error).stack?.split('\n')[0],
      },
      { status: 500 },
    );
  }
});
