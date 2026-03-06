import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const PRAZO_RULES = [
  { pattern: /prazo.*?(\d+)\s*(dias?\s*úteis|du)/i, type: 'Prazo Processual', extract: true },
  { pattern: /audiência.*?(\d{1,2}\/\d{1,2}\/\d{4})/i, type: 'Audiência', extract: true },
  { pattern: /intimação/i, type: 'Intimação', dias: 15 },
  { pattern: /citação/i, type: 'Citação', dias: 15 },
  { pattern: /recurso/i, type: 'Recurso', dias: 15 },
  { pattern: /contestação/i, type: 'Contestação', dias: 15 },
  { pattern: /embargos/i, type: 'Embargos', dias: 5 },
  { pattern: /apelação/i, type: 'Apelação', dias: 15 },
  { pattern: /agravo/i, type: 'Agravo', dias: 15 },
  { pattern: /pagamento|multa/i, type: 'Pagamento/Multa', dias: 5 },
];

function addBusinessDays(date, days) {
  let d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

function extractPrazos(conteudo = '', dataPublicacao) {
  const text = conteudo;
  const suggestions = [];
  const base = dataPublicacao ? new Date(dataPublicacao) : new Date();

  for (const rule of PRAZO_RULES) {
    const match = text.match(rule.pattern);
    if (match) {
      const dias = rule.dias || parseInt(match[1]) || 15;
      const vencimento = addBusinessDays(base, dias);
      suggestions.push({
        tipo: rule.type,
        diasUteis: dias,
        dataBase: base.toISOString().split('T')[0],
        dataVencimento: vencimento.toISOString().split('T')[0],
        confianca: rule.extract && match[1] ? 'alta' : 'media',
        trechoIdentificado: match[0].substring(0, 80)
      });
      break;
    }
  }

  return suggestions;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { conteudo, dataPublicacao, publicacaoId } = body;

    if (publicacaoId) {
      const pubs = await base44.asServiceRole.entities.PublicacaoAdvise.list();
      const pub = pubs.find(p => p.id === publicacaoId);
      if (!pub) return Response.json({ error: 'Publicação não encontrada' }, { status: 404 });
      const prazos = extractPrazos(pub.conteudo, pub.dataPublicacao);
      return Response.json({ success: true, publicacaoId, numeroProcesso: pub.numeroProcesso, prazos });
    }

    if (conteudo) {
      const prazos = extractPrazos(conteudo, dataPublicacao);
      return Response.json({ success: true, prazos, totalSugestoes: prazos.length });
    }

    // Demo
    const demo = 'O advogado foi intimado para apresentar contestação no prazo de 15 dias úteis contados desta publicação.';
    const prazos = extractPrazos(demo, new Date().toISOString());
    return Response.json({ success: true, demo: true, input: demo, prazos });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});