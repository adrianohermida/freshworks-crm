import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, processoId, usuarioEmail, permissoes = [], nivelAcesso = 'viewer' } = await req.json();

    if (!acao) {
      return Response.json({
        success: false,
        error: 'acao é obrigatória (conceder, revogar, listar, validar)'
      }, { status: 400 });
    }

    // Permission levels: owner, editor, commenter, viewer
    const niveis = {
      owner: ['ler', 'editar', 'deletar', 'compartilhar', 'gerenciar_permissoes'],
      editor: ['ler', 'editar', 'deletar', 'comentar'],
      commenter: ['ler', 'comentar'],
      viewer: ['ler']
    };

    if (acao === 'conceder') {
      if (!processoId || !usuarioEmail) {
        return Response.json({
          success: false,
          error: 'processoId e usuarioEmail são obrigatórios'
        }, { status: 400 });
      }

      const permissao = {
        processoId,
        usuarioEmail,
        nivelAcesso,
        permissoes: niveis[nivelAcesso] || [],
        dataConcessao: new Date().toISOString(),
        concedidoPor: user.email,
        ativa: true,
        dataExpiracao: null
      };

      const created = await base44.entities.PermissaoProcesso?.create(permissao);

      return Response.json({
        success: true,
        action: 'colaboracao.permissoesGranulares',
        data: {
          acao: 'conceder',
          processoId,
          usuarioEmail,
          nivelAcesso,
          permissoes: niveis[nivelAcesso],
          dataConcessao: permissao.dataConcessao,
          message: `Permissão ${nivelAcesso} concedida para ${usuarioEmail}`
        }
      });
    } else if (acao === 'revogar') {
      if (!processoId || !usuarioEmail) {
        return Response.json({
          success: false,
          error: 'processoId e usuarioEmail são obrigatórios'
        }, { status: 400 });
      }

      const perms = await base44.entities.PermissaoProcesso?.filter({
        processoId,
        usuarioEmail
      });

      if (perms && perms.length > 0) {
        await base44.entities.PermissaoProcesso?.delete(perms[0].id);

        return Response.json({
          success: true,
          action: 'colaboracao.permissoesGranulares',
          data: {
            acao: 'revogar',
            processoId,
            usuarioEmail,
            message: `Permissão revogada para ${usuarioEmail}`
          }
        });
      }

      return Response.json({
        success: false,
        error: 'Permissão não encontrada'
      }, { status: 404 });
    } else if (acao === 'listar') {
      const perms = await base44.entities.PermissaoProcesso?.filter({ processoId });

      return Response.json({
        success: true,
        action: 'colaboracao.permissoesGranulares',
        data: {
          acao: 'listar',
          processoId,
          total: perms?.length || 0,
          permissoes: perms?.map(p => ({
            id: p.id,
            usuarioEmail: p.usuarioEmail,
            nivelAcesso: p.nivelAcesso,
            permissoes: p.permissoes,
            dataConcessao: p.dataConcessao,
            ativa: p.ativa
          })) || []
        }
      });
    } else if (acao === 'validar') {
      const perms = await base44.entities.PermissaoProcesso?.filter({
        processoId,
        usuarioEmail: user.email
      });

      if (!perms || perms.length === 0) {
        return Response.json({
          success: false,
          action: 'colaboracao.permissoesGranulares',
          data: {
            acao: 'validar',
            processoId,
            autorizado: false,
            mensagem: 'Usuário sem acesso a este processo'
          }
        });
      }

      const perm = perms[0];
      const permissaoRequerida = await req.json().then(body => body.permissao || 'ler');

      return Response.json({
        success: perm.permissoes.includes(permissaoRequerida),
        action: 'colaboracao.permissoesGranulares',
        data: {
          acao: 'validar',
          processoId,
          usuarioEmail: user.email,
          nivelAcesso: perm.nivelAcesso,
          permissoes: perm.permissoes,
          autorizado: perm.permissoes.includes(permissaoRequerida),
          permissaoRequerida
        }
      });
    }

    return Response.json({
      success: false,
      error: 'Ação inválida'
    }, { status: 400 });
  } catch (error) {
    console.error('PermissoesGranulares error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});