import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Calcula deadline usando o módulo de prazos
function calculateLegalDeadline(publicationDate, businessDaysCount = 15) {
  function isBusinessDay(date) {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  function isPublicHoliday(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const fixedHolidays = [
      { month: 1, day: 1 },
      { month: 4, day: 21 },
      { month: 5, day: 1 },
      { month: 9, day: 7 },
      { month: 10, day: 12 },
      { month: 11, day: 2 },
      { month: 11, day: 20 },
      { month: 12, day: 25 }
    ];
    return fixedHolidays.some(h => h.month === month && h.day === day);
  }

  const startDate = new Date(publicationDate);
  startDate.setHours(0, 0, 0, 0);
  
  let currentDate = new Date(startDate);
  let daysCount = 0;

  while (daysCount < businessDaysCount) {
    currentDate.setDate(currentDate.getDate() + 1);
    if (isBusinessDay(currentDate) && !isPublicHoliday(currentDate)) {
      daysCount++;
    }
  }

  return currentDate;
}

function extractPrazoInfo(conteudo, palavrasChave) {
  let tipoPrazo = 'customizado';
  let diasUteis = 15;

  const conteudoLower = conteudo.toLowerCase();
  
  if (conteudoLower.includes('5 dias') || conteudoLower.includes('cinco dias')) {
    tipoPrazo = '5_dias_uteis';
    diasUteis = 5;
  } else if (conteudoLower.includes('10 dias') || conteudoLower.includes('dez dias')) {
    tipoPrazo = 'customizado';
    diasUteis = 10;
  } else if (conteudoLower.includes('15 dias') || conteudoLower.includes('quinze dias')) {
    tipoPrazo = '15_dias_uteis';
    diasUteis = 15;
  } else if (conteudoLower.includes('30 dias') || conteudoLower.includes('trinta dias')) {
    tipoPrazo = 'customizado';
    diasUteis = 30;
  }

  return { tipoPrazo, diasUteis };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Busca publicações pendentes de processamento
    const publicacoes = await base44.entities.PublicacaoAdvise.filter({
      statusSincronizacao: 'importado'
    });

    const tarefasProcessadas = [];

    for (const pub of publicacoes) {
      try {
        // Verifica se já existe tarefa para esta publicação
        const existentes = await base44.entities.TarefaAgendada.filter({
          idPublicacao: pub.id
        });

        if (existentes.length > 0) continue;

        // Extrai informações de prazo
        const { tipoPrazo, diasUteis } = extractPrazoInfo(
          pub.conteudo || '',
          pub.palavrasChave || []
        );

        // Calcula deadline
        const dataPrazo = calculateLegalDeadline(
          pub.dataPublicacao || pub.created_date,
          diasUteis
        );

        // Cria tarefa agendada
        const tarefa = await base44.entities.TarefaAgendada.create({
          idPublicacao: pub.id,
          numeroProcesso: pub.numeroProcesso,
          titulo: `Prazo: ${pub.numeroProcesso}`,
          descricao: pub.conteudo ? pub.conteudo.substring(0, 500) : '',
          dataPublicacao: pub.dataPublicacao || pub.created_date,
          dataPrazo: dataPrazo.toISOString().split('T')[0],
          diasUteis: diasUteis,
          tipoPrazo: tipoPrazo,
          status: 'criada',
          integracao: 'advise',
          metadados: {
            palavrasChave: pub.palavrasChave,
            municipio: pub.municipio,
            vara: pub.vara,
            diario: pub.diario
          }
        });

        // Atualiza publicação como processada
        await base44.entities.PublicacaoAdvise.update(pub.id, {
          statusSincronizacao: 'processado'
        });

        tarefasProcessadas.push(tarefa);
      } catch (error) {
        console.error(`Erro ao processar publicação ${pub.id}:`, error.message);
      }
    }

    return Response.json({
      success: true,
      message: 'Publicações processadas em tarefas',
      tarefasProcessadas: tarefasProcessadas.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no processamento:', error);
    return Response.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});