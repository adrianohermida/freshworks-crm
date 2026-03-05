import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para criar Processo a partir de Publicação
 * Extrai automaticamente: partes, prazos, data distribuição, etc
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { publicacaoId, idPublicacaoAdvise } = await req.json();

    if (!publicacaoId && !idPublicacaoAdvise) {
      return Response.json(
        { error: 'Deve fornecer publicacaoId ou idPublicacaoAdvise' },
        { status: 400 }
      );
    }

    // Buscar a publicação
    let publicacao;
    if (publicacaoId) {
      publicacao = await base44.entities.PublicacaoAdvise.filter(
        { id: publicacaoId },
        '',
        1
      ).then(r => r[0]);
    } else {
      publicacao = await base44.entities.PublicacaoAdvise.filter(
        { idPublicacaoAdvise },
        '',
        1
      ).then(r => r[0]);
    }

    if (!publicacao) {
      return Response.json(
        { error: 'Publicação não encontrada' },
        { status: 404 }
      );
    }

    // Extrair dados da publicação usando IA
    const extractedData = await base44.integrations.Core.InvokeLLM({
      prompt: `Analise esta publicação judicial e extraia os seguintes dados em JSON:
      
Publicação:
${publicacao.conteudo || publicacao.descricao || ''}

Extraia:
1. poloAtivo: Array com nomes das partes ativas (autor, requerente, etc)
2. poloPassivo: Array com nomes das partes passivas (réu, requerido, etc)
3. dataDistribuicao: Data de distribuição do processo (formato YYYY-MM-DD)
4. classeProcessual: Classe/tipo processual
5. assunto: Assunto principal do processo
6. valor_causa: Valor da causa em reais (número, se houver)
7. descricao_breve: Descrição breve do processo
8. prazos: Array de objetos com { tipo, descricao, dataVencimento (YYYY-MM-DD), diasUteis }

Retorne APENAS o JSON, sem explicações.`,
      response_json_schema: {
        type: "object",
        properties: {
          poloAtivo: { type: "array", items: { type: "string" } },
          poloPassivo: { type: "array", items: { type: "string" } },
          dataDistribuicao: { type: "string" },
          classeProcessual: { type: "string" },
          assunto: { type: "string" },
          valor_causa: { type: "number" },
          descricao_breve: { type: "string" },
          prazos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tipo: { type: "string" },
                descricao: { type: "string" },
                dataVencimento: { type: "string" },
                diasUteis: { type: "integer" }
              }
            }
          }
        }
      }
    });

    // Criar ProcessoAdvise
    const novoProcesso = await base44.entities.ProcessoAdvise.create({
      idProcessoAdvise: publicacao.idPublicacaoAdvise || `pub_${publicacao.id}`,
      numeroProcesso: publicacao.numeroProcesso,
      numeroCNJ: publicacao.numeroCNJ || false,
      statusProcesso: "ativo",
      tribunal: publicacao.vara || "Não informado",
      vara: publicacao.vara || "",
      municipio: publicacao.municipio || "",
      dataDistribuicao: extractedData.dataDistribuicao || publicacao.dataPublicacao,
      dataUltimo: new Date().toISOString(),
      classeProcessual: extractedData.classeProcessual || "Não informado",
      assunto: extractedData.assunto || publicacao.conteudo?.substring(0, 200),
      partesProcesso: [
        ...extractedData.poloAtivo.map(p => ({
          nome: p,
          tipo: "pessoa",
          qualidade: "ativa"
        })),
        ...extractedData.poloPassivo.map(p => ({
          nome: p,
          tipo: "pessoa",
          qualidade: "passiva"
        }))
      ],
      valorCausa: extractedData.valor_causa || 0,
      grau: "1º grau",
      dataSincronizacao: new Date().toISOString(),
      ultimoAndamento: publicacao.descricao || "Processo criado a partir de publicação",
      metadados: {
        origem: "publicacao",
        idPublicacao: publicacao.id,
        idPublicacaoAdvise: publicacao.idPublicacaoAdvise
      }
    });

    // Criar Prazos Processuais
    const prazos = [];
    if (extractedData.prazos && Array.isArray(extractedData.prazos)) {
      for (const prazo of extractedData.prazos) {
        const novoPrazo = await base44.entities.PrazoProcessual.create({
          idProcessoAdvise: novoProcesso.idProcessoAdvise,
          numeroProcesso: novoProcesso.numeroProcesso,
          tipo: prazo.tipo || "outro",
          descricao: prazo.descricao || "",
          dataInicio: publicacao.dataPublicacao,
          dataVencimento: prazo.dataVencimento || new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
          diasUteis: prazo.diasUteis || 15,
          status: "aberto"
        });
        prazos.push(novoPrazo);
      }
    }

    return Response.json({
      success: true,
      processo: novoProcesso,
      prazos: prazos,
      message: `Processo criado com sucesso. ${prazos.length} prazos adicionados.`
    });

  } catch (error) {
    console.error('Erro ao criar processo:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});