import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const CLASSIFICATION_RULES = [
  { keywords: ['intimação', 'intimar', 'intimado'], category: 'Intimação', priority: 'alta', prazo: 15 },
  { keywords: ['citação', 'citar', 'citado'], category: 'Citação', priority: 'urgente', prazo: 15 },
  { keywords: ['audiência', 'designou', 'designada'], category: 'Audiência', priority: 'alta', prazo: 5 },
  { keywords: ['prazo', 'apresentar', 'manifestação'], category: 'Prazo Processual', priority: 'alta', prazo: 15 },
  { keywords: ['sentença', 'julgamento', 'acordão'], category: 'Decisão', priority: 'media', prazo: 30 },
  { keywords: ['recurso', 'apelar', 'agravo'], category: 'Recurso', priority: 'alta', prazo: 15 },
  { keywords: ['pagamento', 'multa', 'custas'], category: 'Financeiro', priority: 'urgente', prazo: 5 },
  { keywords: ['certidão', 'carta', 'ofício'], category: 'Administrativo', priority: 'baixa', prazo: 30 },
];

function classifyText(conteudo = '') {
  const text = conteudo.toLowerCase();
  for (const rule of CLASSIFICATION_RULES) {
    if (rule.keywords.some(k => text.includes(k))) {
      return { category: rule.category, priority: rule.priority, prazoSugerido: rule.prazo };
    }
  }
  return { category: 'Geral', priority: 'baixa', prazoSugerido: 30 };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { publicacaoId, batchMode } = body;

    if (batchMode) {
      const publicacoes = await base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 20);
      const results = publicacoes.map(pub => ({
        id: pub.id,
        numeroProcesso: pub.numeroProcesso,
        ...classifyText(pub.conteudo),
        conteudoPreview: (pub.conteudo || '').substring(0, 100)
      }));
      return Response.json({ success: true, classified: results.length, results });
    }

    if (publicacaoId) {
      const publicacoes = await base44.asServiceRole.entities.PublicacaoAdvise.list();
      const pub = publicacoes.find(p => p.id === publicacaoId);
      if (!pub) return Response.json({ error: 'Publicação não encontrada' }, { status: 404 });
      const classification = classifyText(pub.conteudo);
      return Response.json({ success: true, publicacaoId, numeroProcesso: pub.numeroProcesso, ...classification });
    }

    // Demo classification
    const sample = 'O juiz intimou as partes para manifestação no prazo de 15 dias úteis.';
    return Response.json({ success: true, demo: true, input: sample, ...classifyText(sample) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});