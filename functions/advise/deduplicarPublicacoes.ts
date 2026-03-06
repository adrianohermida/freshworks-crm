import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { createHash } from 'node:crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { publicacoes } = await req.json();

    if (!Array.isArray(publicacoes) || publicacoes.length === 0) {
      return Response.json({ 
        duplicados: [], 
        unicos: [], 
        total: 0 
      });
    }

    // Fetch existing publicações para comparação
    const existentes = await base44.entities.PublicacaoAdvise.list();
    const existentesHashes = new Set(
      existentes.map(p => gerarHash(p.numeroProcesso, p.dataPublicacao, p.nomeDiario))
    );

    const novasPublicacoes = [];
    const publicacoesDuplicadas = [];
    const hashes = new Set();

    for (const pub of publicacoes) {
      const hash = gerarHash(pub.numero || pub.numeroProcesso, pub.dataPublicacao, pub.nomeDiario);
      
      // Verifica duplicação na batch atual
      if (hashes.has(hash)) {
        publicacoesDuplicadas.push(pub);
        continue;
      }

      // Verifica duplicação com dados existentes
      if (existentesHashes.has(hash)) {
        publicacoesDuplicadas.push(pub);
        continue;
      }

      hashes.add(hash);
      novasPublicacoes.push({
        ...pub,
        _deduplicationHash: hash
      });
    }

    return Response.json({
      sucesso: true,
      totalRecebidos: publicacoes.length,
      novasPublicacoes: novasPublicacoes.length,
      duplicados: publicacoesDuplicadas.length,
      publicacoes: novasPublicacoes,
      duplicadasRemovidas: publicacoesDuplicadas
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function gerarHash(numero, data, diario) {
  const chave = `${numero}|${data}|${diario}`;
  return createHash('sha256').update(chave).digest('hex');
}