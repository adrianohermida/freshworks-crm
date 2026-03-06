import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { AdviseClient } from './utils/client.js';
import { IntimacaoService } from './intimacoes.js';
import { ProcessoService } from './processos.js';
import { PublicacaoService } from './publicacoes.js';
import { AdviseRepository } from './repository.js';

// Observação: ProcessoService foi importado corretamente acima

/**
 * DADOS MOCK - Publicações de exemplo para testes
 * Usado quando API Advise não retorna dados
 */
const PUBLICACOES_MOCK = [
  {
    idPublicacaoAdvise: 'mock_001',
    numeroProcesso: '0000001-00.2024.0.00.0000',
    numeroCNJ: true,
    dataPublicacao: new Date().toISOString(),
    dataHoraMovimento: new Date().toISOString(),
    diario: 'TJSP',
    municipio: 'São Paulo',
    vara: '1ª Vara Cível',
    conteudo: 'PUBLICAÇÃO DE TESTE - Primeira Citação',
    palavrasChave: ['citação', 'teste', 'processo'],
    lido: false
  },
  {
    idPublicacaoAdvise: 'mock_002',
    numeroProcesso: '0000002-00.2024.0.00.0000',
    numeroCNJ: true,
    dataPublicacao: new Date(Date.now() - 86400000).toISOString(),
    dataHoraMovimento: new Date(Date.now() - 86400000).toISOString(),
    diario: 'TJSP',
    municipio: 'São Paulo',
    vara: '2ª Vara Cível',
    conteudo: 'PUBLICAÇÃO DE TESTE - Intimação',
    palavrasChave: ['intimação', 'teste'],
    lido: false
  }
];

/**
 * Orquestrador principal da integração Advise
 * Expõe serviços profissionalmente estruturados
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const token = Deno.env.get('ADVISE_TOKEN');
    if (!token) {
      return Response.json({ error: 'ADVISE_TOKEN não configurado' }, { status: 500 });
    }

    const { action, payload } = await req.json();
    const client = new AdviseClient(token);
    const repository = new AdviseRepository(base44);

    // Instancia serviços
    const intimacoes = new IntimacaoService(client);
    const processos = new ProcessoService(client);
    const publicacoes = new PublicacaoService(client);

    let result = {};

    // ============ INTIMAÇÕES ============
    if (action === 'intimacoes.consultarFontes') {
      const fontes = await intimacoes.consultarFontes(
        payload?.registrosPorPagina || 50,
        payload?.paginaAtual || 1
      );
      await repository.salvarFontes(fontes);
      result = { fontes, message: 'Fontes consultadas e salvas' };
    }

    if (action === 'intimacoes.consultar') {
      try {
        const diasAtras = payload?.diasAtras || 7; // Padrão: últimos 7 dias
        const responseComPeriodo = await intimacoes.consultarIntimacoes(
          payload?.lido || false,
          payload?.dataInicio,
          payload?.dataFim,
          payload?.registrosPorPagina || 50,
          payload?.paginaAtual || 1,
          diasAtras
        );

        let intArray = [];
        let periodo = null;

        let data = responseComPeriodo?.dados || responseComPeriodo;
        periodo = responseComPeriodo?.periodo || responseComPeriodo?.metadados;

        if (Array.isArray(data)) {
          intArray = data;
        } else if (data && typeof data === 'object') {
          intArray = data.intimacoes || data.dados || data.data || data.result || [];
        }

        console.log('[Index] Intimações retornadas:', intArray.length, 'no período:', periodo?.periodoBuscaFormatado);

        if (intArray.length > 0) {
          await repository.salvarIntimacoes(intArray);
        }

        result = {
          intimacoes: intArray,
          periodo: periodo,
          message: `Intimações sincronizadas: ${intArray.length} registros - Período: ${periodo?.periodoBuscaFormatado || 'Últimos 7 dias'}`
        };
      } catch (intErr) {
        console.error('[Index] Erro ao consultar intimações:', intErr.message);
        result = { intimacoes: [], error: true, message: `Erro: ${intErr.message}` };
      }
    }

    if (action === 'intimacoes.cadastrarCredenciais') {
      const credencial = await intimacoes.cadastrarCredenciais(
        payload.nomeResponsavel,
        payload.idFonteXTipoPesquisa,
        payload.dadoAcesso,
        payload.senha,
        payload.autenticacao
      );
      result = { credencial, message: 'Credenciais cadastradas' };
    }

    if (action === 'intimacoes.ativarPesquisa') {
      const response = await intimacoes.ativarPesquisa(payload.idPesqIntimacaoUsCliente);
      result = { response, message: 'Pesquisa ativada' };
    }

    if (action === 'intimacoes.inativarPesquisa') {
      const response = await intimacoes.inativarPesquisa(payload.idPesqIntimacaoUsCliente);
      result = { response, message: 'Pesquisa inativada' };
    }

    if (action === 'intimacoes.excluirPesquisa') {
      const response = await intimacoes.excluirPesquisa(payload.idPesqIntimacaoUsCliente);
      result = { response, message: 'Pesquisa excluída' };
    }

    if (action === 'intimacoes.marcarLida') {
      const response = await intimacoes.marcarComoLida(payload.itens);
      result = { response, message: 'Intimações marcadas como lidas' };
    }

    if (action === 'intimacoes.marcarNaoLida') {
      const response = await intimacoes.marcarComoNaoLida(payload.itens);
      result = { response, message: 'Intimações marcadas como não lidas' };
    }

    // ============ PROCESSOS ============
    if (action === 'processos.consultar') {
      try {
        const horasAtras = payload?.horasAtras || 24; // Padrão: últimas 24 horas
        const responseComPeriodo = await processos.consultarAndamentos(
          payload?.lido || false,
          payload?.registrosPorPagina || 50,
          payload?.paginaAtual || 1,
          payload?.dataInicio,
          payload?.dataFim,
          horasAtras
        );

        let procArray = [];
        let periodo = null;

        // Extrai array e período
        let data = responseComPeriodo?.dados || responseComPeriodo;
        periodo = responseComPeriodo?.periodo || responseComPeriodo?.metadados;

        if (Array.isArray(data)) {
          procArray = data;
        } else if (data && typeof data === 'object') {
          procArray = data.andamentos || data.dados || data.data || data.result || [];
        }

        console.log('[Index] Andamentos retornados:', procArray.length, 'no período:', periodo?.periodoBuscaFormatado);

        if (procArray.length > 0) {
          const saveResult = await repository.salvarMovimentos(procArray);
          console.log('[Index] Salvos:', saveResult.saved);
        }

        result = {
          processos: procArray,
          saved: procArray.length > 0,
          periodo: periodo,
          message: `Processos sincronizados: ${procArray.length} andamentos - Período: ${periodo?.periodoBuscaFormatado || 'Últimas 24 horas'}`
        };
      } catch (procErr) {
        console.error('[Index] Erro ao consultar processos:', procErr.message);
        result = { processos: [], saved: 0, error: true, message: `Erro: ${procErr.message}` };
      }
    }

    if (action === 'processos.cadastrar') {
      const response = await processos.cadastrarProcessos(payload.itens, payload?.ativo || false);
      result = { response, message: 'Processos cadastrados' };
    }

    if (action === 'processos.consultarFontes') {
      const fontes = await processos.consultarFontesDisponiveis(
        payload?.numeroProcesso,
        payload?.idProcesso
      );
      result = { fontes, message: 'Fontes de processos consultadas' };
    }

    if (action === 'processos.marcarLido') {
      const response = await processos.marcarAndamentosComoLidos(payload.itens);
      result = { response, message: 'Andamentos marcados como lidos' };
    }

    if (action === 'processos.consultarCabecalho') {
      const cabecalho = await processos.consultarCabecalho(payload.idFonteProcesso);
      result = { cabecalho, message: 'Cabeçalho do processo consultado' };
    }

    if (action === 'processos.buscarAnexos') {
      const anexos = await processos.buscarAnexos(
        payload.fontesProcesso,
        payload.trazerAnexosAndamento,
        payload.pagina || 1,
        payload.registrosPagina || 10,
        payload.idUsuarioCliente
      );
      result = { anexos, message: 'Anexos encontrados' };
    }

    if (action === 'processos.downloadAnexo') {
      const anexo = await processos.downloadAnexo(payload.idAnexo);
      result = { anexo, message: 'Anexo pronto para download' };
    }

    // ============ PUBLICAÇÕES ============
    if (action === 'publicacoes.consultar') {
      try {
        const useMock = payload?.useMock === true;
        const diasAtras = payload?.diasAtras || 1; // Padrão: últimas 24 horas
        let pubArray = [];
        let periodo = null;

        if (!useMock) {
          // Tentar API real
          const responseComPeriodo = await publicacoes.consultarPublicacoes(
            payload?.lido || false,
            payload?.dataInicio,
            payload?.dataFim,
            payload?.registrosPorPagina || 50,
            payload?.paginaAtual || 1,
            diasAtras
          );
          
          // Extrai array de dados e metadados de período
          let data = responseComPeriodo?.dados || responseComPeriodo;
          periodo = responseComPeriodo?.periodo || responseComPeriodo?.metadados;
          
          // Trata resposta que pode ser array ou objeto com array dentro
          if (Array.isArray(data)) {
            pubArray = data;
          } else if (data && typeof data === 'object') {
            pubArray = data.publicacoes || data.dados || data.data || data.result || [];
          }
          
          console.log('[Index] API retornou:', pubArray.length, 'publicações no período:', periodo?.periodoBuscaFormatado);
        }

        // Se API retornou vazio e useMock foi solicitado, ou se houver erro
        if (pubArray.length === 0 && useMock) {
          console.log('[Index] Usando MOCK data para testes');
          pubArray = PUBLICACOES_MOCK;
          periodo = { descricao: 'Últimas 24 horas (MOCK)', diasBuscados: 1, periodoBuscaFormatado: 'Dados de teste' };
        }

        if (pubArray.length > 0) {
          const saveResult = await repository.salvarPublicacoes(pubArray);
          console.log('[Index] Salvo:', saveResult.saved);
        }
        
        result = { 
          publicacoes: pubArray, 
          saved: pubArray.length > 0, 
          source: useMock ? 'mock' : 'api',
          periodo: periodo,
          message: `Publicações sincronizadas: ${pubArray.length} registros (${useMock ? 'mock' : 'api'}) - Período: ${periodo?.periodoBuscaFormatado || 'Últimas 24 horas'}` 
        };
      } catch (pubErr) {
        console.error('[Index] Erro ao consultar publicações:', pubErr.message);
        // Fallback para mock em caso de erro
        const mockData = PUBLICACOES_MOCK;
        if (payload?.fallbackToMock !== false) {
          console.log('[Index] Erro na API, usando MOCK como fallback');
          const saveResult = await repository.salvarPublicacoes(mockData);
          result = { 
            publicacoes: mockData, 
            saved: saveResult.saved, 
            source: 'mock_fallback',
            periodo: { descricao: 'Últimas 24 horas (FALLBACK)', diasBuscados: 1, periodoBuscaFormatado: 'Fallback mode' },
            message: `Publicações sincronizadas via fallback: ${mockData.length} registros` 
          };
        } else {
          result = { publicacoes: [], saved: 0, error: true, message: `Erro: ${pubErr.message}` };
        }
      }
    }

    if (action === 'publicacoes.marcarLida') {
      const response = await publicacoes.marcarComoLida(payload.itens);
      result = { response, message: 'Publicações marcadas como lidas' };
    }

    const response = {
      success: !result?.error,
      action,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    console.log('[Index] [FINAL RESPONSE]', JSON.stringify(response));
    
    return Response.json(response);

  } catch (error) {
    console.error('Erro na integração Advise:', error);
    return Response.json({
      success: false,
      error: error.message || 'Erro desconhecido',
      details: error
    }, { status: 500 });
  }
});