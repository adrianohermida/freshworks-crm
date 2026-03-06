import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para processar publicação e criar processo automaticamente
 * POST - Cria ProcessoAdvise a partir de PublicacaoAdvise
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
    const { publicacaoId, numeroProcesso, tribunal, vara, municipio, classe, assunto } = body;

    if (!publicacaoId || !numeroProcesso) {
      return Response.json(
        { error: 'publicacaoId e numeroProcesso são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar publicação
    const publicacoes = await base44.entities.PublicacaoAdvise.filter({ id: publicacaoId });
    if (publicacoes.length === 0) {
      return Response.json({ error: 'Publicação não encontrada' }, { status: 404 });
    }

    const publicacao = publicacoes[0];

    // Verificar se processo já existe
    const processosExistentes = await base44.entities.ProcessoAdvise.filter({
      numeroProcesso: numeroProcesso
    });

    let processo;

    if (processosExistentes.length > 0) {
      processo = processosExistentes[0];
      // Atualizar processo existente
      await base44.entities.ProcessoAdvise.update(processo.id, {
        tribunal: tribunal || processo.tribunal,
        vara: vara || processo.vara,
        municipio: municipio || processo.municipio,
        classeProcessual: classe || processo.classeProcessual,
        assunto: assunto || processo.assunto,
        dataSincronizacao: new Date().toISOString()
      });
    } else {
      // Criar novo processo
      processo = await base44.entities.ProcessoAdvise.create({
        idProcessoAdvise: `adv-${numeroProcesso}-${Date.now()}`,
        numeroProcesso,
        numeroCNJ: true,
        statusProcesso: 'ativo',
        tribunal: tribunal || 'Tribunal Desconhecido',
        vara: vara || 'Vara Desconhecida',
        municipio: municipio || 'Município Desconhecido',
        dataDistribuicao: publicacao.dataPublicacao || new Date().toISOString(),
        dataUltimo: new Date().toISOString(),
        partesProcesso: [],
        classeProcessual: classe || 'Classe Desconhecida',
        assunto: assunto || publicacao.conteudo?.substring(0, 100) || 'Sem assunto',
        assuntos: publicacao.palavrasChave || [],
        juiz: 'Não informado',
        grau: '1º grau',
        dataSincronizacao: new Date().toISOString(),
        ultimoAndamento: `Criado automaticamente a partir de publicação`,
        metadados: {
          publicacaoId,
          dataPublicacao: publicacao.dataPublicacao,
          diario: publicacao.diario,
          palavrasChave: publicacao.palavrasChave
        }
      });
    }

    // Extrair partes automaticamente
    let partes = [];
    try {
      const resPartes = await base44.functions.invoke('extrairPartesPublicacao', {
        publicacaoId,
        numeroProcesso,
        conteudo: publicacao.conteudo || ''
      });
      partes = resPartes.data?.partes || [];
    } catch (err) {
      console.error('Erro ao extrair partes:', err);
    }

    // Identificar audiências
    let audiencias = [];
    try {
      const resAudiencias = await base44.functions.invoke('identificarAudiencias', {
        numeroProcesso,
        conteudo: publicacao.conteudo || ''
      });
      audiencias = resAudiencias.data?.audiencias || [];
    } catch (err) {
      console.error('Erro ao identificar audiências:', err);
    }

    // Identificar prazos processuais
    let prazos = [];
    try {
      const resPrazos = await base44.functions.invoke('extrairPrazosProcessuais', {
        numeroProcesso,
        conteudo: publicacao.conteudo || '',
        dataPublicacao: publicacao.dataPublicacao
      });
      prazos = resPrazos.data?.prazos || [];
    } catch (err) {
      console.error('Erro ao extrair prazos:', err);
    }

    // Analisar dependências de apensos
    let apensos = [];
    try {
      const resApensos = await base44.functions.invoke('analisarDependenciasApensos', {
        numeroProcesso,
        conteudo: publicacao.conteudo || ''
      });
      apensos = resApensos.data?.apensos || [];
    } catch (err) {
      console.error('Erro ao analisar apensos:', err);
    }

    // Marcar publicação como processada
    await base44.entities.PublicacaoAdvise.update(publicacao.id, {
      statusSincronizacao: 'processado',
      idMovProcessoClienteAdvise: processo.id
    });

    return new Response(JSON.stringify({
      success: true,
      processo: {
        id: processo.id,
        numeroProcesso: processo.numeroProcesso,
        statusProcesso: processo.statusProcesso,
        tribunal: processo.tribunal
      },
      partes,
      audiencias,
      prazos,
      apensos,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erro ao processar publicação:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});