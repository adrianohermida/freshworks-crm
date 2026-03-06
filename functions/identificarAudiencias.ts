import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para identificar audiências em publicação
 * POST - Extrai datas, tipos e locais de audiências
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
    const { numeroProcesso, conteudo } = body;

    if (!numeroProcesso || !conteudo) {
      return Response.json(
        { error: 'numeroProcesso e conteudo são obrigatórios' },
        { status: 400 }
      );
    }

    // Usar LLM para extrair audiências
    const resposta = await base44.integrations.Core.InvokeLLM({
      prompt: `Analise o conteúdo abaixo e identifique TODAS as AUDIÊNCIAS mencionadas.

CONTEÚDO:
${conteudo}

TAREFA:
Extraia informações de audiências com:
1. DATA e HORA (se disponível)
2. TIPO (instrução, conciliação, julgamento, etc)
3. LOCAL/SALA (se mencionado)
4. JUIZ responsável (se mencionado)
5. Observações adicionais

Retorne em JSON:
{
  "audiencias": [
    {
      "dataAudiencia": "ISO datetime string",
      "tipo": "instrucao|conciliacao|julgamento|outra",
      "sala": "string",
      "juiz": "string",
      "descricao": "string"
    }
  ]
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          audiencias: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                dataAudiencia: { type: 'string' },
                tipo: { type: 'string' },
                sala: { type: 'string' },
                juiz: { type: 'string' },
                descricao: { type: 'string' }
              }
            }
          }
        }
      }
    });

    // Salvar audiências
    const audienciasSalvas = [];
    if (resposta.audiencias?.length > 0) {
      for (const aud of resposta.audiencias) {
        try {
          const audiencia = await base44.entities.Audiencia.create({
            idProcessoAdvise: `adv-${numeroProcesso}`,
            numeroProcesso,
            dataAudiencia: aud.dataAudiencia || new Date().toISOString(),
            tipo: aud.tipo || 'outra',
            juiz: aud.juiz || 'Não informado',
            sala: aud.sala || 'Sala desconhecida',
            descricao: aud.descricao || '',
            comparecimento: 'pendente',
            lembrete_enviado: false,
            data_criacao: new Date().toISOString()
          });
          audienciasSalvas.push(audiencia);
        } catch (err) {
          console.error('Erro ao salvar audiência:', err);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      audiencias: audienciasSalvas,
      total: audienciasSalvas.length,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erro ao identificar audiências:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});