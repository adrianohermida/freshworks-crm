import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para analisar dependências e criar apensos
 * POST - Identifica processos relacionados e cria apensos automaticamente
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

    // Usar LLM para identificar apensos
    const resposta = await base44.integrations.Core.InvokeLLM({
      prompt: `Analise o conteúdo judicial e identifique PROCESSOS RELACIONADOS/APENSADOS.

CONTEÚDO:
${conteudo}

TAREFA:
Procure por:
1. Números de outros processos mencionados
2. Motivo da relação (identidade de partes, conexão, dependência)
3. Se é apenso (apensado a outro) ou apensando (tem outro apensado a ele)
4. Tribunal dos processos relacionados

Retorne em JSON:
{
  "processosRelacionados": [
    {
      "numeroProcesso": "string",
      "motivo": "identidade_partes|conexao|dependencia",
      "tipo": "apenso|apensando",
      "tribunal": "string",
      "descricao": "string"
    }
  ]
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          processosRelacionados: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                numeroProcesso: { type: 'string' },
                motivo: { type: 'string' },
                tipo: { type: 'string' },
                tribunal: { type: 'string' },
                descricao: { type: 'string' }
              }
            }
          }
        }
      }
    });

    // Processar apensos
    const apensosSalvos = [];

    if (resposta.processosRelacionados?.length > 0) {
      // Buscar processo principal
      const processoPrincipal = await base44.entities.ProcessoAdvise.filter({
        numeroProcesso
      });

      if (processoPrincipal.length > 0) {
        for (const proc of resposta.processosRelacionados) {
          try {
            // Buscar ou criar processo relacionado
            const processoRelacionado = await base44.entities.ProcessoAdvise.filter({
              numeroProcesso: proc.numeroProcesso
            });

            let idProcessoRelacionado = proc.numeroProcesso;
            if (processoRelacionado.length > 0) {
              idProcessoRelacionado = processoRelacionado[0].idProcessoAdvise || proc.numeroProcesso;
            }

            // Criar registro de apenso
            const apensoMotivos = {
              'identidade_partes': 'Identidade de partes',
              'conexao': 'Conexão processual',
              'dependencia': 'Dependência de outro processo'
            };

            const apenso = await base44.entities.ApensoProcessual.create({
              numeroProcessoPrincipal: numeroProcesso,
              idProcessoPrincipal: processoPrincipal[0].idProcessoAdvise,
              numeroProcessoApensado: proc.numeroProcesso,
              idProcessoApensado: idProcessoRelacionado,
              tipoApenso: proc.tipo === 'apenso' ? 'apenso' : 'apensando',
              motivo: apensoMotivos[proc.motivo] || proc.motivo,
              dataApenso: new Date().toISOString(),
              status: 'ativo',
              descricao: proc.descricao || '',
              tribunal: proc.tribunal || processoPrincipal[0].tribunal
            });

            apensosSalvos.push(apenso);

            // Criar alerta para apenso
            try {
              await base44.functions.invoke('criarAlerta', {
                titulo: `Processo Apensado: ${proc.numeroProcesso}`,
                descricao: `${proc.motivo}: ${proc.descricao}`,
                tipo: 'importante',
                severidade: 'media',
                numeroProcesso,
                acoesSugeridas: ['Revisar apenso', 'Verificar dependências'],
                canalNotificacao: ['in_app']
              });
            } catch (err) {
              console.error('Erro ao criar alerta de apenso:', err);
            }

          } catch (err) {
            console.error(`Erro ao processar apenso ${proc.numeroProcesso}:`, err);
          }
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      apensos: apensosSalvos,
      total: apensosSalvos.length,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erro ao analisar dependências:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});