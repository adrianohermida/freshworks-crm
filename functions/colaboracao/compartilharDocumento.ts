import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { idAnexo, usuariosPermissao = {}, gruposPermissao = {} } = await req.json();

    if (!idAnexo) {
      return Response.json({
        success: false,
        error: 'idAnexo é obrigatório'
      }, { status: 400 });
    }

    // Get anexo info
    let anexo;
    try {
      const anexos = await base44.entities.AnexoProcesso.filter({ id: idAnexo });
      if (anexos.length === 0) {
        return Response.json({
          success: false,
          error: 'Anexo não encontrado'
        }, { status: 404 });
      }
      anexo = anexos[0];
    } catch (e) {
      return Response.json({
        success: false,
        error: 'Falha ao buscar anexo'
      }, { status: 500 });
    }

    // Create sharing record
    const compartilhamento = {
      idAnexo,
      nomeArquivo: anexo.nomeArquivo,
      usuariosPermissao,
      gruposPermissao,
      compartilhadoPor: user.email,
      dataCompartilhamento: new Date().toISOString(),
      usuariosComAcesso: Object.keys(usuariosPermissao),
      gruposComAcesso: Object.keys(gruposPermissao)
    };

    const created = await base44.entities.Compartilhamento?.create(compartilhamento);

    // Send notifications to users
    for (const [emailUsuario, tipoAcesso] of Object.entries(usuariosPermissao)) {
      try {
        await base44.functions.invoke('notificacoes/enviarEmailTemplate', {
          templateId: 'documento_compartilhado',
          destinatario: emailUsuario,
          dados: {
            nomeDocumento: anexo.nomeArquivo,
            compartilhadoPor: user.full_name,
            tipoAcesso
          }
        });
      } catch (e) {
        console.log(`Falha ao notificar ${emailUsuario}`);
      }
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'compartilharDocumento',
      entidade: 'Compartilhamento',
      resultado: 'success',
      metadados: { idAnexo, usuariosCount: Object.keys(usuariosPermissao).length }
    });

    return Response.json({
      success: true,
      action: 'colaboracao.compartilharDocumento',
      data: {
        id: created?.id,
        idAnexo,
        nomeArquivo: anexo.nomeArquivo,
        usuariosComAcesso: Object.keys(usuariosPermissao),
        gruposComAcesso: Object.keys(gruposPermissao),
        dataCompartilhamento: compartilhamento.dataCompartilhamento,
        message: `Documento compartilhado com ${Object.keys(usuariosPermissao).length} usuários e ${Object.keys(gruposPermissao).length} grupos`
      }
    });
  } catch (error) {
    console.error('CompartilharDocumento error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});