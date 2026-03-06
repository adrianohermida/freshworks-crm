import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para extrair partes de uma publicação
 * POST - Extrai polo ativo, polo passivo e interessados
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Método não permitido' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { publicacaoId, numeroProcesso, conteudo } = body;

    if (!numeroProcesso || !conteudo) {
      return Response.json(
        { error: 'numeroProcesso e conteudo são obrigatórios' },
        { status: 400 }
      );
    }

    // Usar LLM para extrair partes
    const resposta = await base44.integrations.Core.InvokeLLM({
      prompt: `Analise o conteúdo de uma publicação judicial abaixo e extraia as PARTES envolvidas no processo.

CONTEÚDO DA PUBLICAÇÃO:
${conteudo}

TAREFA:
1. Identifique o POLO ATIVO (autor/reclamante/requerente)
2. Identifique o POLO PASSIVO (réu/reclamado/requerido)
3. Identifique ADVOGADOS e seus dados (nome, OAB, email)
4. Identifique CUSTOS/CUSTAS ou VALORES em disputa
5. Identifique o TIPO DE PROCESSO

Retorne em JSON estruturado com as seguintes propriedades:
{
  "poloAtivo": {
    "nome": "string",
    "cpfCnpj": "string",
    "qualidade": "string"
  },
  "poloPassivo": {
    "nome": "string",
    "cpfCnpj": "string",
    "qualidade": "string"
  },
  "advogados": [
    {
      "nome": "string",
      "oab": "string",
      "email": "string",
      "poloRepresentado": "ativo|passivo"
    }
  ],
  "valor": number,
  "tipoProcesso": "string"
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          poloAtivo: {
            type: 'object',
            properties: {
              nome: { type: 'string' },
              cpfCnpj: { type: 'string' },
              qualidade: { type: 'string' }
            }
          },
          poloPassivo: {
            type: 'object',
            properties: {
              nome: { type: 'string' },
              cpfCnpj: { type: 'string' },
              qualidade: { type: 'string' }
            }
          },
          advogados: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                nome: { type: 'string' },
                oab: { type: 'string' },
                email: { type: 'string' },
                poloRepresentado: { type: 'string' }
              }
            }
          },
          valor: { type: 'number' },
          tipoProcesso: { type: 'string' }
        }
      }
    });

    // Processar e salvar partes
    const partes = [];

    // Salvar polo ativo
    if (resposta.poloAtivo?.nome) {
      partes.push({
        nome: resposta.poloAtivo.nome,
        tipo: 'ativo',
        qualidade: resposta.poloAtivo.qualidade || 'Autor',
        cpfCnpj: resposta.poloAtivo.cpfCnpj || ''
      });
    }

    // Salvar polo passivo
    if (resposta.poloPassivo?.nome) {
      partes.push({
        nome: resposta.poloPassivo.nome,
        tipo: 'passivo',
        qualidade: resposta.poloPassivo.qualidade || 'Réu',
        cpfCnpj: resposta.poloPassivo.cpfCnpj || ''
      });
    }

    // Salvar advogados
    const advogadosSalvos = [];
    if (resposta.advogados?.length > 0) {
      for (const adv of resposta.advogados) {
        try {
          const advogadoExistente = await base44.entities.Advogado.filter({
            oab: adv.oab
          });

          let advogado;
          if (advogadoExistente.length > 0) {
            advogado = advogadoExistente[0];
          } else {
            advogado = await base44.entities.Advogado.create({
              nome: adv.nome,
              oab: adv.oab,
              email: adv.email || '',
              especialidade: [resposta.tipoProcesso || 'Geral'],
              ativo: true,
              processos: [numeroProcesso]
            });
          }
          advogadosSalvos.push(advogado);
        } catch (err) {
          console.error('Erro ao salvar advogado:', err);
        }
      }
    }

    // Atualizar processo com partes
    if (numeroProcesso) {
      try {
        const processosExistentes = await base44.entities.ProcessoAdvise.filter({
          numeroProcesso
        });
        if (processosExistentes.length > 0) {
          await base44.entities.ProcessoAdvise.update(processosExistentes[0].id, {
            partesProcesso: partes,
            valorCausa: resposta.valor || 0,
            classeProcessual: resposta.tipoProcesso || processosExistentes[0].classeProcessual
          });
        }
      } catch (err) {
        console.error('Erro ao atualizar processo:', err);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      partes,
      advogados: advogadosSalvos,
      valor: resposta.valor || 0,
      tipoProcesso: resposta.tipoProcesso || 'Desconhecido',
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300'
      }
    });

  } catch (error) {
    console.error('Erro ao extrair partes:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});