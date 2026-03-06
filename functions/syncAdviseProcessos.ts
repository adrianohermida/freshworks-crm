import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Sincroniza processos e movimentos da API Advise com banco local
 * Importa novos processos e atualiza movimentos existentes
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
      processosConsultados: 0,
      processosImportados: 0,
      movimentosImportados: 0,
      erros: []
    };

    // 1. Consultar processos registrados
    console.log('[syncAdviseProcessos] Consultando processos...');
    
    let processos = [];
    try {
      const response = await fetch(
        `${apiUrl}/core/v1/processo-cliente?registrosPorPagina=100&paginaAtual=1`,
        { headers, method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`Erro ao consultar processos: ${response.status}`);
      }

      processos = await response.json();
      result.processosConsultados = (processos || []).length;
      console.log('[syncAdviseProcessos] Processos encontrados:', result.processosConsultados);

      // Salvar processos
      if (processos && processos.length > 0) {
        const mapeados = processos.map(p => ({
          idProcessoAdvise: p.idProcesso || p.id,
          numeroProcesso: p.numeroProcesso || 'N/A',
          statusProcesso: p.statusProcesso || 'ativo',
          tribunal: p.tribunal || '',
          vara: p.vara || '',
          municipio: p.municipio || '',
          dataDistribuicao: p.dataDistribuicao || new Date().toISOString(),
          dataUltimo: p.dataUltimo || new Date().toISOString(),
          classeProcessual: p.classeProcessual || '',
          assunto: p.assunto || '',
          grau: p.grau || '1º grau',
          dataSincronizacao: new Date().toISOString(),
          metadados: {
            sincronizadoEm: new Date().toISOString(),
            origem: 'api_advise'
          }
        }));

        await base44.asServiceRole.entities.ProcessoAdvise.bulkCreate(mapeados);
        result.processosImportados = mapeados.length;
        console.log('[syncAdviseProcessos] Processos salvos:', result.processosImportados);
      }
    } catch (err) {
      const errorMsg = `Erro ao consultar processos: ${err.message}`;
      console.error('[syncAdviseProcessos]', errorMsg);
      result.erros.push(errorMsg);
    }

    // 2. Para cada processo, consultar movimentos
    console.log('[syncAdviseProcessos] Sincronizando movimentos...');
    
    if (processos && processos.length > 0) {
      for (const proc of processos.slice(0, 5)) { // Limitar a 5 para não sobrecarregar
        try {
          const numeroProcesso = proc.numeroProcesso;
          const movResponse = await fetch(
            `${apiUrl}/core/v1/movimento-processo-cliente?numeroProcesso=${numeroProcesso}&registrosPorPagina=50&paginaAtual=1`,
            { headers, method: 'GET' }
          );

          if (!movResponse.ok) {
            console.warn('[syncAdviseProcessos] Erro ao buscar movimentos:', numeroProcesso);
            continue;
          }

          const movimentos = await movResponse.json();

          if (Array.isArray(movimentos) && movimentos.length > 0) {
            const mapeados = movimentos.map(m => ({
              idMovimento: m.idMovimento || m.id,
              idProcessoAdvise: m.idProcesso || proc.idProcesso,
              numeroProcesso: numeroProcesso,
              dataMovimento: m.dataMovimento || new Date().toISOString(),
              descricaoMovimento: m.descricao || '',
              tipoMovimento: m.tipo || 'movimento',
              tribunal: proc.tribunal || '',
              conteudo: m.conteudo || m.descricao || '',
              lido: false,
              importante: false,
              sequencia: m.sequencia || 0,
              dataSincronizacao: new Date().toISOString()
            }));

            await base44.asServiceRole.entities.MovimentoProcesso.bulkCreate(mapeados);
            result.movimentosImportados += mapeados.length;
            console.log('[syncAdviseProcessos] Movimentos salvos para', numeroProcesso, ':', mapeados.length);
          }
        } catch (err) {
          console.error('[syncAdviseProcessos] Erro ao sincronizar movimentos:', err);
        }
      }
    }

    // 3. Atualizar config
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
      console.error('[syncAdviseProcessos] Erro ao atualizar config:', err);
    }

    return Response.json({
      success: result.erros.length === 0,
      message: 'Sincronização de processos concluída',
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[syncAdviseProcessos] Erro geral:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});