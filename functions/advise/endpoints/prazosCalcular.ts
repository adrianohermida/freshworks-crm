import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Calcula prazos processuais considerando dias úteis
 * Excluindo fins de semana e feriados
 */
function calcularDiasUteis(dataInicio, diasUteis) {
  let data = new Date(dataInicio);
  let contagem = 0;

  while (contagem < diasUteis) {
    data.setDate(data.getDate() + 1);
    const diaSemana = data.getDay();
    // 0 = domingo, 6 = sábado
    if (diaSemana !== 0 && diaSemana !== 6) {
      contagem++;
    }
  }

  return data;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseApiUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const {
      numeroProcesso,
      tipo = 'defesa',
      diasUteis = 15,
      dataInicio
    } = await req.json();

    if (!numeroProcesso || !dataInicio) {
      return Response.json({
        success: false,
        error: 'numeroProcesso e dataInicio são obrigatórios'
      }, { status: 400 });
    }

    // POST /prazos/calcular - calcula vencimento
    const dataVencimento = calcularDiasUteis(dataInicio, diasUteis);

    const response = await fetch(`${adviseApiUrl}/prazos/calcular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numeroProcesso,
        tipo,
        dataInicio,
        diasUteis,
        dataVencimento: dataVencimento.toISOString().split('T')[0]
      })
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const prazoAdvise = await response.json();

    // Sincronizar com banco de dados
    const processo = await base44.entities.ProcessoAdvise.filter({
      numeroProcesso: numeroProcesso
    });

    if (processo.length > 0) {
      const novoPrazo = await base44.entities.PrazoProcessual.create({
        idProcessoAdvise: processo[0].id,
        numeroProcesso: numeroProcesso,
        tipo: tipo,
        descricao: `Prazo ${tipo} - ${diasUteis} dias úteis`,
        dataInicio: dataInicio,
        dataVencimento: dataVencimento.toISOString().split('T')[0],
        diasUteis: diasUteis,
        status: 'aberto',
        acao_requerida: `Cumprir prazo de ${tipo}`,
        documentos_necessarios: []
      });

      return Response.json({
        success: true,
        action: 'prazos.calcular',
        data: {
          prazo: novoPrazo,
          dataInicio: dataInicio,
          dataVencimento: dataVencimento.toISOString().split('T')[0],
          diasUteis: diasUteis,
          diasRestantes: Math.ceil((dataVencimento - new Date()) / (1000 * 60 * 60 * 24)),
          timestamp: new Date().toISOString()
        }
      });
    }

    return Response.json({
      success: false,
      error: 'Processo não encontrado'
    }, { status: 404 });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});