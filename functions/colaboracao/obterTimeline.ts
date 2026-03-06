import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { idProcesso, limite = 50 } = await req.json();

    if (!idProcesso) {
      return Response.json({
        success: false,
        error: 'idProcesso é obrigatório'
      }, { status: 400 });
    }

    // Fetch timeline events from multiple entities
    const timeline = [];

    try {
      // Get comments
      const comentarios = await base44.entities.Comentario?.filter({ idProcesso }, '-dataCriacao', limite);
      if (comentarios) {
        comentarios.forEach(c => {
          timeline.push({
            tipo: 'comentario',
            id: c.id,
            timestamp: c.dataCriacao,
            autor: c.autorNome,
            conteudo: c.conteudo,
            mencoes: c.mencoes.length,
            respostas: c.respostas?.length || 0
          });
        });
      }
    } catch (e) {
      console.log('Comentario entity not available');
    }

    try {
      // Get assignments
      const atribuicoes = await base44.entities.Atribuicao?.filter({ idTarefa: idProcesso }, '-dataAtribuicao', limite);
      if (atribuicoes) {
        atribuicoes.forEach(a => {
          timeline.push({
            tipo: 'atribuicao',
            id: a.id,
            timestamp: a.dataAtribuicao,
            responsavel: a.responsavel,
            atribuidoPor: a.atribuidoPor,
            prioridade: a.prioridade,
            prazo: a.prazo
          });
        });
      }
    } catch (e) {
      console.log('Atribuicao entity not available');
    }

    try {
      // Get shares
      const compartilhamentos = await base44.entities.Compartilhamento?.filter({ idAnexo: idProcesso }, '-dataCompartilhamento', limite);
      if (compartilhamentos) {
        compartilhamentos.forEach(c => {
          timeline.push({
            tipo: 'compartilhamento',
            id: c.id,
            timestamp: c.dataCompartilhamento,
            documento: c.nomeArquivo,
            compartilhadoPor: c.compartilhadoPor,
            usuariosCount: c.usuariosComAcesso?.length || 0
          });
        });
      }
    } catch (e) {
      console.log('Compartilhamento entity not available');
    }

    // Get process movements
    try {
      const movimentos = await base44.entities.MovimentoProcesso?.filter({ numeroProcesso: idProcesso }, '-dataMovimento', limite);
      if (movimentos) {
        movimentos.forEach(m => {
          timeline.push({
            tipo: 'movimento',
            id: m.id,
            timestamp: m.dataMovimento,
            descricao: m.descricaoMovimento,
            tribunal: m.tribunal
          });
        });
      }
    } catch (e) {
      console.log('MovimentoProcesso entity not available');
    }

    // Sort by timestamp descending
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'obterTimeline',
      entidade: 'Timeline',
      resultado: 'success',
      metadados: { idProcesso, eventosCount: timeline.length }
    });

    return Response.json({
      success: true,
      action: 'colaboracao.obterTimeline',
      data: {
        idProcesso,
        eventos: timeline.slice(0, limite),
        totalEventos: timeline.length,
        ultimoEvento: timeline[0]?.timestamp || null,
        message: `Timeline com ${timeline.length} eventos carregada com sucesso`
      }
    });
  } catch (error) {
    console.error('ObterTimeline error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});