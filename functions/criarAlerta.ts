import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para criar alertas inteligentes
 * POST - Cria alerta no sistema e dispara notificações
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
    const {
      titulo,
      descricao,
      tipo,
      severidade = 'media',
      numeroProcesso,
      idProcessoAdvise,
      dataVencimento,
      usuarioResponsavel,
      tagsAlerta = [],
      acoesSugeridas = [],
      canalNotificacao = ['in_app', 'email'],
      repeticao = 'nenhuma'
    } = body;

    // Validações
    if (!titulo || !tipo || !numeroProcesso) {
      return Response.json(
        { error: 'titulo, tipo e numeroProcesso são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar alerta
    const alerta = await base44.entities.Alerta.create({
      titulo,
      descricao: descricao || '',
      tipo,
      severidade,
      numeroProcesso,
      idProcessoAdvise: idProcessoAdvise || '',
      dataVencimento: dataVencimento || new Date().toISOString(),
      dataOcorrencia: new Date().toISOString(),
      usuarioResponsavel: usuarioResponsavel || user.email,
      tagsAlerta,
      acoesSugeridas,
      canalNotificacao,
      repeticao,
      notificacaoEnviada: false
    });

    // Criar notificações para os canais especificados
    const notificacoes = [];

    for (const canal of canalNotificacao) {
      const notificacao = await base44.entities.Notificacao.create({
        idAlerta: alerta.id,
        titulo,
        mensagem: descricao || titulo,
        tipo: canal,
        destinatario: usuarioResponsavel || user.email,
        status: 'pendente',
        dataCriacao: new Date().toISOString(),
        prioridade: severidade === 'critica' ? 'urgente' : 
                   severidade === 'alta' ? 'alta' : 'normal',
        linkAcao: `/Processos?numero=${numeroProcesso}`,
        metadados: {
          numeroProcesso,
          tipoAlerta: tipo
        }
      });

      notificacoes.push(notificacao);

      // Invocar função de envio de notificação
      try {
        await base44.functions.invoke('enviarNotificacao', {
          notificacaoId: notificacao.id
        });
      } catch (err) {
        console.error('Erro ao enviar notificação:', err);
      }
    }

    // Atualizar alerta com flag de notificação enviada
    await base44.entities.Alerta.update(alerta.id, {
      notificacaoEnviada: true,
      dataLeitura: null
    });

    return new Response(JSON.stringify({
      success: true,
      alerta,
      notificacoes,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erro ao criar alerta:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});