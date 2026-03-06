import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    // Validar origem do webhook
    const authHeader = req.headers.get('authorization');
    const adviseToken = Deno.env.get('ADVISE_TOKEN');

    if (!authHeader || authHeader !== `Bearer ${adviseToken}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
    const { evento, dados } = await req.json();

    let resultado = null;
    let tipo = null;

    // Processar eventos em tempo real
    switch (evento) {
      case 'publicacao.nova':
        // Nova publicação encontrada
        tipo = 'publicacao';
        const pubExistente = await base44.entities.PublicacaoAdvise.filter({
          idPublicacaoAdvise: dados.idPublicacao
        });

        if (pubExistente.length === 0) {
          resultado = await base44.entities.PublicacaoAdvise.create({
            idPublicacaoAdvise: dados.idPublicacao,
            numeroProcesso: dados.numeroProcesso,
            dataPublicacao: new Date().toISOString(),
            conteudo: dados.conteudo,
            statusSincronizacao: 'importado',
            dataSincronizacao: new Date().toISOString()
          });

          // Criar alerta automático
          await base44.entities.Alerta.create({
            titulo: `Nova publicação - ${dados.numeroProcesso}`,
            descricao: 'Uma nova publicação foi encontrada no diário',
            tipo: 'movimentacao',
            severidade: 'media',
            numeroProcesso: dados.numeroProcesso,
            dataOcorrencia: new Date().toISOString(),
            notificacaoEnviada: true,
            canalNotificacao: ['email', 'in_app']
          });
        }
        break;

      case 'intimacao.nova':
        // Nova intimação
        tipo = 'intimacao';
        const intExistente = await base44.entities.IntimacaoAdvise.filter({
          idIntimacao: dados.idIntimacao
        });

        if (intExistente.length === 0) {
          resultado = await base44.entities.IntimacaoAdvise.create({
            idIntimacao: dados.idIntimacao,
            numeroProcesso: dados.numeroProcesso,
            tipo: dados.tipo,
            dataIntimacao: new Date().toISOString(),
            statusIntimacao: 'pendente',
            lido: false,
            dataSincronizacao: new Date().toISOString()
          });

          // Criar alerta crítico
          await base44.entities.Alerta.create({
            titulo: `INTIMAÇÃO RECEBIDA - ${dados.numeroProcesso}`,
            descricao: `Tipo: ${dados.tipo}. Requer análise imediata.`,
            tipo: 'intimacao',
            severidade: 'critica',
            numeroProcesso: dados.numeroProcesso,
            dataOcorrencia: new Date().toISOString(),
            acoesSugeridas: [
              'Analisar conteúdo da intimação',
              'Calcular prazo de resposta',
              'Comunicar ao cliente'
            ],
            notificacaoEnviada: true,
            canalNotificacao: ['email', 'push', 'in_app']
          });
        }
        break;

      case 'prazo.proxximo':
        // Prazo próximo do vencimento
        tipo = 'prazo';
        resultado = await base44.entities.Alerta.create({
          titulo: `Prazo próximo de vencer - ${dados.numeroProcesso}`,
          descricao: `Prazo vence em ${dados.diasRestantes} dias`,
          tipo: 'prazo',
          severidade: dados.diasRestantes <= 5 ? 'critica' : 'alta',
          numeroProcesso: dados.numeroProcesso,
          dataVencimento: dados.dataVencimento,
          dataOcorrencia: new Date().toISOString(),
          acoesSugeridas: [
            'Revisar documentação necessária',
            'Preparar petição/resposta',
            'Contatar cliente se necessário'
          ],
          notificacaoEnviada: true,
          canalNotificacao: ['email', 'in_app']
        });
        break;

      case 'audiencia.confirmada':
        // Audiência confirmada
        tipo = 'audiencia';
        resultado = await base44.entities.Alerta.create({
          titulo: `Audiência confirmada - ${dados.numeroProcesso}`,
          descricao: `${dados.tipo} em ${dados.dataAudiencia}`,
          tipo: 'audiencia',
          severidade: 'media',
          numeroProcesso: dados.numeroProcesso,
          dataVencimento: dados.dataAudiencia,
          dataOcorrencia: new Date().toISOString(),
          acoesSugeridas: [
            'Preparar petições/argumentação',
            'Revisar jurisprudência',
            'Contatar partes'
          ],
          notificacaoEnviada: true,
          canalNotificacao: ['email', 'in_app']
        });
        break;

      default:
        return Response.json({
          success: false,
          error: 'Evento desconhecido'
        }, { status: 400 });
    }

    return Response.json({
      success: true,
      evento: evento,
      tipo: tipo,
      resultado: resultado ? 'criado' : 'ignorado',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});