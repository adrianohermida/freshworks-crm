import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { AdviseClient } from './utils/client.js';
import { PublicacaoService } from './publicacoes.js';
import { AdviseRepository } from './repository.js';

/**
 * Função para sincronizar publicações Advise COM FALLBACK para dados mock
 * Útil quando API não retorna dados mas precisa testar o resto da pipeline
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = Deno.env.get('ADVISE_TOKEN');
    if (!token) {
      return Response.json({ error: 'ADVISE_TOKEN não configurado' }, { status: 500 });
    }

    const { payload = {} } = await req.json().catch(() => ({}));
    const useMock = payload.useMock === true; // Forçar dados mock

    console.log('[PublicacoesMock] Iniciando sincronização (useMock=' + useMock + ')');

    const client = new AdviseClient(token);
    const service = new PublicacaoService(client);
    const repository = new AdviseRepository(base44);

    let publicacoes = [];
    let source = 'api';

    try {
      // Tentar buscar da API
      publicacoes = await service.consultarPublicacoes(false, null, null, 100, 1);
      
      if (!Array.isArray(publicacoes)) {
        publicacoes = publicacoes?.publicacoes || publicacoes?.dados || [];
      }

      console.log('[PublicacoesMock] API retornou:', publicacoes.length, 'publicações');

      if (publicacoes.length === 0 && useMock) {
        console.log('[PublicacoesMock] API vazia, usando dados MOCK');
        publicacoes = DADOS_MOCK;
        source = 'mock';
      }
    } catch (apiErr) {
      console.error('[PublicacoesMock] Erro na API:', apiErr.message);
      
      if (useMock) {
        console.log('[PublicacoesMock] Usando dados MOCK como fallback');
        publicacoes = DADOS_MOCK;
        source = 'mock_fallback';
      } else {
        throw apiErr;
      }
    }

    // Salvar publicações
    let saveResult = { saved: 0, errors: [] };
    if (publicacoes.length > 0) {
      saveResult = await repository.salvarPublicacoes(publicacoes);
      console.log('[PublicacoesMock] Salvos:', saveResult.saved);
    }

    return Response.json({
      success: true,
      data: {
        publicacoes: publicacoes.length,
        saved: saveResult.saved,
        errors: saveResult.errors,
        source: source,
        message: `${saveResult.saved} publicações sincronizadas de ${source}`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[PublicacoesMock] Erro:', error.message);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});

// DADOS MOCK - Publicações de exemplo para testes
const DADOS_MOCK = [
  {
    id: 'pub_mock_001',
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
    id: 'pub_mock_002',
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
  },
  {
    id: 'pub_mock_003',
    numeroProcesso: '0000003-00.2024.0.00.0000',
    numeroCNJ: true,
    dataPublicacao: new Date(Date.now() - 172800000).toISOString(),
    dataHoraMovimento: new Date(Date.now() - 172800000).toISOString(),
    diario: 'TJSP',
    municipio: 'Santos',
    vara: '1ª Vara Cível',
    conteudo: 'PUBLICAÇÃO DE TESTE - Sentença',
    palavrasChave: ['sentença', 'teste', 'julgamento'],
    lido: true
  }
];