import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Integração completa com API Advise
 * Sincroniza: Intimações, Processos e Publicações
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Pega token do .env
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    if (!adviseToken) {
      return Response.json({ error: 'ADVISE_TOKEN não configurado' }, { status: 500 });
    }

    const { action, payload = {} } = await req.json();

    // URLs da API
    const API_URL = payload.apiUrl || 'https://api.advise.com.br';
    const headers = {
      'Authorization': `Bearer ${adviseToken}`,
      'Content-Type': 'application/json'
    };

    let result = {};

    // 1. Buscar Intimações (não lidas)
    if (action === 'intimacoes' || !action) {
      try {
        const intimResponse = await fetch(
          `${API_URL}/core/v1/intimacoes-clientes?lido=false&registrosPorPagina=50&paginaAtual=1`,
          { headers, method: 'GET' }
        );
        if (intimResponse.ok) {
          const intimData = await intimResponse.json();
          result.intimacoes = intimData;
          
          // Salvar no banco
          await base44.asServiceRole.entities.IntimacaoAdvise.bulkCreate(
            (intimData || []).map(item => ({
              idIntimacao: item.idIntimacao,
              numeroProcesso: item.numeroProcesso,
              tipo: item.tipo || 'aviso',
              descricao: item.descricao || '',
              dataIntimacao: item.dataIntimacao,
              statusIntimacao: 'pendente',
              lido: false,
              dataSincronizacao: new Date().toISOString()
            }))
          );
        }
      } catch (err) {
        console.error('Erro ao buscar intimações:', err);
        result.intimacoesError = err.message;
      }
    }

    // 2. Buscar Processos cadastrados
    if (action === 'processos' || !action) {
      try {
        const procResponse = await fetch(
          `${API_URL}/core/v1/processos-clientes/fontes-processos`,
          { headers, method: 'GET' }
        );
        if (procResponse.ok) {
          const procData = await procResponse.json();
          result.processos = procData;
        }
      } catch (err) {
        console.error('Erro ao buscar processos:', err);
        result.processosError = err.message;
      }
    }

    // 3. Buscar Publicações (não lidas)
    if (action === 'publicacoes' || !action) {
      try {
        const diasAtras = payload.diasAtras || 1;
        const dataFim = new Date();
        const dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - diasAtras);

        const params = new URLSearchParams({
          lido: payload.lido === false ? 'false' : 'true',
          registrosPorPagina: payload.registrosPorPagina || 50,
          paginaAtual: payload.paginaAtual || 1,
          dataInicio: dataInicio.toISOString().split('T')[0],
          dataFim: dataFim.toISOString().split('T')[0]
        });

        console.log('[DEBUG] Consultando publicações com params:', params.toString());
        
        const pubResponse = await fetch(
          `${API_URL}/core/v1/publicacoes-clientes?${params.toString()}`,
          { headers, method: 'GET' }
        );

        console.log('[DEBUG] Status:', pubResponse.status);
        
        if (pubResponse.ok) {
          const pubData = await pubResponse.json();
          console.log('[DEBUG] Dados retornados:', Array.isArray(pubData) ? pubData.length : Object.keys(pubData));
          
          result.publicacoes = pubData;
          
          // Mapeia variações de resposta
          let pubArray = Array.isArray(pubData) ? pubData : pubData?.dados || pubData?.publicacoes || [];
          
          if (pubArray.length > 0) {
            await base44.asServiceRole.entities.PublicacaoAdvise.bulkCreate(
              pubArray.map(item => ({
                idPublicacaoAdvise: item.id || item.idPublicacaoCliente || item.idPublicacaoAdvise,
                numeroProcesso: item.numeroProcesso || item.processos?.[0]?.numeroProcesso || 'N/A',
                numeroCNJ: item.numeroCNJ || false,
                dataPublicacao: item.dataPublicacao || item.dataHoraMovimento || new Date().toISOString(),
                conteudo: item.conteudo || item.descricao || '',
                lido: item.lido || false,
                statusSincronizacao: 'importado',
                dataSincronizacao: new Date().toISOString()
              }))
            );
            console.log('[DEBUG] Salvo:', pubArray.length, 'publicações');
          }
        } else {
          const errorText = await pubResponse.text();
          console.error('[DEBUG] Erro API:', pubResponse.status, errorText);
        }
      } catch (err) {
        console.error('Erro ao buscar publicações:', err);
        result.publicacoesError = err.message;
      }
    }

    // 4. Consultar fontes de intimação disponíveis
    if (action === 'fontes' || !action) {
      try {
        const fontesResponse = await fetch(
          `${API_URL}/core/v1/intimacao/ConsultaFonteIntimacoes?registrosPorPagina=100&paginaAtual=1`,
          { headers, method: 'GET' }
        );
        if (fontesResponse.ok) {
          const fontesData = await fontesResponse.json();
          result.fontes = fontesData;
          
          // Salvar fontes disponíveis
          await base44.asServiceRole.entities.FonteIntimacao.bulkCreate(
            (fontesData || []).map(fonte => ({
              idFonte: fonte.id || fonte.idFonteXTipoPesquisa,
              nomeFonte: fonte.nomeFonte || fonte.nome || 'Fonte Desconhecida',
              descricao: fonte.descricao || '',
              ativa: true,
              ultimaSincronizacao: new Date().toISOString()
            }))
          );
        }
      } catch (err) {
        console.error('Erro ao buscar fontes:', err);
        result.fontesError = err.message;
      }
    }

    return Response.json({
      success: true,
      message: 'Sincronização Advise concluída',
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na integração Advise:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});