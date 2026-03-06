import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Sincroniza intimações não lidas da API Advise com o banco local
 * Executa para cada fonte configurada
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    if (!adviseToken) {
      return Response.json({ error: 'ADVISE_TOKEN não configurado' }, { status: 500 });
    }

    const { apiUrl = 'https://api.advise.com.br' } = await req.json();

    const headers = {
      'Authorization': `Bearer ${adviseToken}`,
      'Content-Type': 'application/json'
    };

    const result = {
      fontesConsultadas: 0,
      intimacoesImportadas: 0,
      erros: []
    };

    // 1. Consultar fontes disponíveis
    console.log('[syncAdviseIntimacoes] Consultando fontes...');
    
    try {
      const fontesResponse = await fetch(
        `${apiUrl}/core/v1/intimacao/ConsultaFonteIntimacoes?registrosPorPagina=100&paginaAtual=1`,
        { headers, method: 'GET' }
      );

      if (!fontesResponse.ok) {
        throw new Error(`Erro ao consultar fontes: ${fontesResponse.status}`);
      }

      const fontes = await fontesResponse.json();
      result.fontesConsultadas = (fontes || []).length;
      console.log('[syncAdviseIntimacoes] Fontes encontradas:', result.fontesConsultadas);

      // Salvar fontes no banco
      if (fontes && fontes.length > 0) {
        await base44.asServiceRole.entities.FonteIntimacao.bulkCreate(
          fontes.map(fonte => ({
            idFonte: fonte.idFonteXTipoPesquisa || fonte.id,
            nomeFonte: fonte.nomeFonte || fonte.nome || 'Fonte Desconhecida',
            descricao: fonte.descricao || '',
            ativa: true,
            ultimaSincronizacao: new Date().toISOString()
          }))
        );
      }
    } catch (err) {
      const errorMsg = `Erro ao consultar fontes: ${err.message}`;
      console.error('[syncAdviseIntimacoes]', errorMsg);
      result.erros.push(errorMsg);
    }

    // 2. Listar intimações não lidas
    console.log('[syncAdviseIntimacoes] Listando intimações não lidas...');
    
    try {
      const intimResponse = await fetch(
        `${apiUrl}/core/v1/intimacoes-clientes?lido=false&registrosPorPagina=100&paginaAtual=1`,
        { headers, method: 'GET' }
      );

      if (!intimResponse.ok) {
        throw new Error(`Erro ao listar intimações: ${intimResponse.status}`);
      }

      const intimacoes = await intimResponse.json();
      
      if (Array.isArray(intimacoes) && intimacoes.length > 0) {
        console.log('[syncAdviseIntimacoes] Intimações encontradas:', intimacoes.length);

        // Mapear e salvar intimações
        const mapeadas = intimacoes.map(item => ({
          idIntimacao: item.idIntimacao || item.id,
          numeroProcesso: item.numeroProcesso || 'N/A',
          tipo: item.tipo || 'aviso',
          descricao: item.descricao || '',
          dataIntimacao: item.dataIntimacao || new Date().toISOString(),
          dataMovimento: item.dataMovimento || item.dataIntimacao,
          statusIntimacao: 'pendente',
          lido: false,
          conteudo: item.conteudo || item.descricao || '',
          municipio: item.municipio || '',
          vara: item.vara || '',
          fonte: item.fonte || 'API',
          idMovProcessoCliente: item.idMovProcessoCliente || item.idIntimacao,
          dataSincronizacao: new Date().toISOString(),
          metadados: {
            sincronizadoEm: new Date().toISOString(),
            origem: 'api_advise'
          }
        }));

        await base44.asServiceRole.entities.IntimacaoAdvise.bulkCreate(mapeadas);
        result.intimacoesImportadas = mapeadas.length;
        console.log('[syncAdviseIntimacoes] Intimações salvas:', result.intimacoesImportadas);
      }
    } catch (err) {
      const errorMsg = `Erro ao listar intimações: ${err.message}`;
      console.error('[syncAdviseIntimacoes]', errorMsg);
      result.erros.push(errorMsg);
    }

    // 3. Atualizar config de sincronização
    try {
      const configs = await base44.asServiceRole.entities.AdviseConfig.list();
      if (configs.length > 0) {
        await base44.asServiceRole.entities.AdviseConfig.update(configs[0].id, {
          ultimaSincronizacao: new Date().toISOString(),
          statusConexao: result.erros.length === 0 ? 'conectado' : 'erro',
          erroUltimo: result.erros.length > 0 ? result.erros[0] : null
        });
      }
    } catch (err) {
      console.error('[syncAdviseIntimacoes] Erro ao atualizar config:', err);
    }

    return Response.json({
      success: result.erros.length === 0,
      message: 'Sincronização de intimações concluída',
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[syncAdviseIntimacoes] Erro geral:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});