import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para gerenciar Apensos Processuais
 * Cria/atualiza relacionamentos entre processos
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      action, // "apensiar", "desapensiar", "listar"
      numeroProcessoPrincipal,
      numeroProcessoApensado,
      tipoApenso,
      motivo
    } = await req.json();

    if (!action) {
      return Response.json({ error: 'action é obrigatória' }, { status: 400 });
    }

    // APENSIAR
    if (action === 'apensiar') {
      if (!numeroProcessoPrincipal || !numeroProcessoApensado) {
        return Response.json(
          { error: 'numeroProcessoPrincipal e numeroProcessoApensado são obrigatórios' },
          { status: 400 }
        );
      }

      // Buscar os dois processos
      const [procPrincipal] = await base44.entities.ProcessoAdvise.filter(
        { numeroProcesso: numeroProcessoPrincipal }
      );
      const [procApensado] = await base44.entities.ProcessoAdvise.filter(
        { numeroProcesso: numeroProcessoApensado }
      );

      if (!procPrincipal || !procApensado) {
        return Response.json(
          { error: 'Um ou ambos os processos não foram encontrados' },
          { status: 404 }
        );
      }

      // Criar apenso
      const apenso = await base44.entities.ApensoProcessual.create({
        numeroProcessoPrincipal,
        idProcessoPrincipal: procPrincipal.idProcessoAdvise,
        numeroProcessoApensado,
        idProcessoApensado: procApensado.idProcessoAdvise,
        tipoApenso: tipoApenso || 'apenso',
        motivo: motivo || 'Apenso por identidade de partes ou conexão',
        dataApenso: new Date().toISOString(),
        status: 'ativo',
        tribunal: procPrincipal.tribunal
      });

      return Response.json({
        success: true,
        apenso,
        message: `Processo ${numeroProcessoApensado} apensado ao ${numeroProcessoPrincipal}`
      });
    }

    // DESAPENSIAR
    if (action === 'desapensiar') {
      const apensos = await base44.entities.ApensoProcessual.filter({
        numeroProcessoPrincipal,
        numeroProcessoApensado,
        status: 'ativo'
      });

      if (apensos.length === 0) {
        return Response.json(
          { error: 'Apenso não encontrado' },
          { status: 404 }
        );
      }

      const apensoAtualizado = await base44.entities.ApensoProcessual.update(
        apensos[0].id,
        {
          status: 'desapensado',
          dataDesapenso: new Date().toISOString()
        }
      );

      return Response.json({
        success: true,
        apenso: apensoAtualizado,
        message: 'Apenso removido com sucesso'
      });
    }

    // LISTAR
    if (action === 'listar') {
      const filtro = {};
      if (numeroProcessoPrincipal) {
        filtro.numeroProcessoPrincipal = numeroProcessoPrincipal;
      }
      if (numeroProcessoApensado) {
        filtro.numeroProcessoApensado = numeroProcessoApensado;
      }

      const apensos = await base44.entities.ApensoProcessual.filter(filtro);

      // Agrupar por processo principal
      const grouped = {};
      for (const apenso of apensos) {
        if (!grouped[apenso.numeroProcessoPrincipal]) {
          grouped[apenso.numeroProcessoPrincipal] = [];
        }
        grouped[apenso.numeroProcessoPrincipal].push(apenso);
      }

      return Response.json({
        success: true,
        apensos: grouped,
        total: apensos.length
      });
    }

    return Response.json(
      { error: 'Action inválida' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erro ao gerenciar apensos:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});