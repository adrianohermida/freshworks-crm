import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { idProcesso, conteudo, mencoes = [] } = await req.json();

    if (!idProcesso || !conteudo) {
      return Response.json({
        success: false,
        error: 'idProcesso e conteudo são obrigatórios'
      }, { status: 400 });
    }

    const comentario = {
      idProcesso,
      conteudo,
      autorEmail: user.email,
      autorNome: user.full_name,
      mencoes,
      dataCriacao: new Date().toISOString(),
      dataEdicao: null,
      gostei: [],
      respostas: [],
      ativo: true
    };

    const created = await base44.entities.Comentario?.create(comentario);

    // Send mentions notifications
    if (mencoes.length > 0) {
      for (const emailMencionado of mencoes) {
        try {
          await base44.functions.invoke('notificacoes/enviarEmailTemplate', {
            templateId: 'mencao_comentario',
            destinatario: emailMencionado,
            dados: {
              nomeAutor: user.full_name,
              processoId: idProcesso,
              conteudoPreview: conteudo.substring(0, 100)
            }
          });
        } catch (e) {
          console.log(`Falha ao notificar ${emailMencionado}`);
        }
      }
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'criarComentario',
      entidade: 'Comentario',
      resultado: 'success',
      metadados: { idProcesso, mencoes: mencoes.length }
    });

    return Response.json({
      success: true,
      action: 'colaboracao.criarComentario',
      data: {
        id: created?.id,
        idProcesso,
        autor: user.full_name,
        conteudo,
        dataCriacao: comentario.dataCriacao,
        mencoes,
        message: `Comentário criado com sucesso${mencoes.length > 0 ? ` e ${mencoes.length} notificações enviadas` : ''}`
      }
    });
  } catch (error) {
    console.error('CriarComentario error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});