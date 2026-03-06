import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, processoId, tipoOperacao, descricao, metadados = {} } = await req.json();

    if (!acao) {
      return Response.json({
        success: false,
        error: 'acao é obrigatória (registrar, listar, analizar)'
      }, { status: 400 });
    }

    if (acao === 'registrar') {
      if (!processoId || !tipoOperacao) {
        return Response.json({
          success: false,
          error: 'processoId e tipoOperacao são obrigatórios'
        }, { status: 400 });
      }

      const registro = {
        processoId,
        usuarioEmail: user.email,
        tipoOperacao,
        descricao: descricao || `${tipoOperacao} realizado por ${user.email}`,
        dataCriacao: new Date().toISOString(),
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadados
      };

      const created = await base44.entities.AuditTrailColaboracao?.create(registro);

      return Response.json({
        success: true,
        action: 'colaboracao.auditTrailColaboracao',
        data: {
          acao: 'registrar',
          processoId,
          tipoOperacao,
          usuarioEmail: user.email,
          dataCriacao: registro.dataCriacao,
          message: `Operação registrada no audit trail`
        }
      });
    } else if (acao === 'listar') {
      if (!processoId) {
        return Response.json({
          success: false,
          error: 'processoId é obrigatório'
        }, { status: 400 });
      }

      const registros = await base44.entities.AuditTrailColaboracao?.filter(
        { processoId },
        '-dataCriacao',
        100
      );

      return Response.json({
        success: true,
        action: 'colaboracao.auditTrailColaboracao',
        data: {
          acao: 'listar',
          processoId,
          total: registros?.length || 0,
          registros: registros?.map(r => ({
            id: r.id,
            usuarioEmail: r.usuarioEmail,
            tipoOperacao: r.tipoOperacao,
            descricao: r.descricao,
            dataCriacao: r.dataCriacao,
            ipAddress: r.ipAddress
          })) || []
        }
      });
    } else if (acao === 'analisar') {
      if (!processoId) {
        return Response.json({
          success: false,
          error: 'processoId é obrigatório'
        }, { status: 400 });
      }

      const registros = await base44.entities.AuditTrailColaboracao?.filter(
        { processoId },
        '-dataCriacao',
        1000
      );

      // Analyze patterns
      const usuarios = {};
      const operacoes = {};
      let ultimaModificacao = null;

      registros?.forEach(r => {
        usuarios[r.usuarioEmail] = (usuarios[r.usuarioEmail] || 0) + 1;
        operacoes[r.tipoOperacao] = (operacoes[r.tipoOperacao] || 0) + 1;
        if (!ultimaModificacao) ultimaModificacao = r.dataCriacao;
      });

      return Response.json({
        success: true,
        action: 'colaboracao.auditTrailColaboracao',
        data: {
          acao: 'analisar',
          processoId,
          totalOperacoes: registros?.length || 0,
          usuariosEnvolvidos: Object.keys(usuarios).length,
          distribuicaoUsuarios: usuarios,
          distribuicaoOperacoes: operacoes,
          ultimaModificacao,
          atividade: registros?.length > 0 ? 'alta' : 'baixa'
        }
      });
    }

    return Response.json({
      success: false,
      error: 'Ação inválida'
    }, { status: 400 });
  } catch (error) {
    console.error('AuditTrailColaboracao error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});