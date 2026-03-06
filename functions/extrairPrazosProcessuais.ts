import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para extrair prazos processuais
 * POST - Identifica prazos, datas de vencimento e ações necessárias
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
    const { numeroProcesso, conteudo, dataPublicacao } = body;

    if (!numeroProcesso || !conteudo) {
      return Response.json(
        { error: 'numeroProcesso e conteudo são obrigatórios' },
        { status: 400 }
      );
    }

    // Usar LLM para extrair prazos
    const resposta = await base44.integrations.Core.InvokeLLM({
      prompt: `Analise o conteúdo judicial e identifique TODOS os PRAZOS PROCESSUAIS.

CONTEÚDO:
${conteudo}

TAREFA:
Extraia prazos com:
1. TIPO (defesa, recurso, documentos, comparecimento, pagamento)
2. DESCRIÇÃO do prazo
3. DIAS ÚTEIS (se especificado, senão calcule como 15 ou 5)
4. DATA DE VENCIMENTO (calcule baseado em dataPublicacao: ${dataPublicacao})
5. AÇÃO REQUERIDA
6. DOCUMENTOS NECESSÁRIOS

Retorne em JSON:
{
  "prazos": [
    {
      "tipo": "defesa|recurso|documentos|comparecimento|pagamento|outro",
      "descricao": "string",
      "diasUteis": number,
      "dataVencimento": "ISO date",
      "acao_requerida": "string",
      "documentos_necessarios": ["string"]
    }
  ]
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          prazos: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                tipo: { type: 'string' },
                descricao: { type: 'string' },
                diasUteis: { type: 'number' },
                dataVencimento: { type: 'string' },
                acao_requerida: { type: 'string' },
                documentos_necessarios: {
                  type: 'array',
                  items: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });

    // Salvar prazos
    const prazosSalvos = [];
    if (resposta.prazos?.length > 0) {
      for (const prazo of resposta.prazos) {
        try {
          const prazoCriado = await base44.entities.PrazoProcessual.create({
            idProcessoAdvise: `adv-${numeroProcesso}`,
            numeroProcesso,
            tipo: prazo.tipo || 'outro',
            descricao: prazo.descricao || '',
            dataInicio: dataPublicacao || new Date().toISOString(),
            dataVencimento: prazo.dataVencimento || new Date().toISOString(),
            diasUteis: prazo.diasUteis || 15,
            status: 'aberto',
            acao_requerida: prazo.acao_requerida || '',
            documentos_necessarios: prazo.documentos_necessarios || []
          });
          prazosSalvos.push(prazoCriado);

          // Criar alerta automático para prazo
          try {
            await base44.functions.invoke('criarAlerta', {
              titulo: `Prazo: ${prazo.tipo}`,
              descricao: prazo.descricao,
              tipo: 'prazo',
              severidade: 'alta',
              numeroProcesso,
              dataVencimento: prazo.dataVencimento,
              acoesSugeridas: [prazo.acao_requerida || 'Cumprir prazo'],
              canalNotificacao: ['in_app', 'email']
            });
          } catch (err) {
            console.error('Erro ao criar alerta de prazo:', err);
          }

        } catch (err) {
          console.error('Erro ao salvar prazo:', err);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      prazos: prazosSalvos,
      total: prazosSalvos.length,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erro ao extrair prazos:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});