import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Sincronizador TPU - Importa tabelas CNJ (Assuntos, Classes, Movimentos, Documentos)
 * API Oficial CNJ: https://www.cnj.jus.br/programas-e-acoes/numeracao-unica/glossario-da-numeracao-unica/
 * Download direto: https://www.cnj.jus.br/webservices/buscacnj/api/publico/tabelas
 */

const TABELAS_TPU = [
  { tipo: 'Assuntos', entity: 'TPUAssuntos', chaveId: 'cod_assunto' },
  { tipo: 'Classes', entity: 'TPUClasses', chaveId: 'cod_classe' },
  { tipo: 'Movimentos', entity: 'TPUMovimentos', chaveId: 'cod_movimento' },
  { tipo: 'Documentos', entity: 'TPUDocumentos', chaveId: 'cod_documento_processual' }
];

// URLs reais da CNJ
const URLS_CNJ = {
  'Assuntos': 'https://www.cnj.jus.br/webservices/buscacnj/api/publico/tabelas/assuntos',
  'Classes': 'https://www.cnj.jus.br/webservices/buscacnj/api/publico/tabelas/classes',
  'Movimentos': 'https://www.cnj.jus.br/webservices/buscacnj/api/publico/tabelas/movimentos',
  'Documentos': 'https://www.cnj.jus.br/webservices/buscacnj/api/publico/tabelas/documentos'
};

async function sincronizarTabela(base44, tipo, entity, chaveId) {
  try {
    const url = URLS_CNJ[tipo];
    if (!url) {
      return { tipo, sucesso: false, erro: 'URL não configurada para este tipo' };
    }

    const response = await fetch(url, {
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'DataJud-Integrador/2.0'
      },
      signal: AbortSignal.timeout(60000)
    });

    if (!response.ok) {
      // Tentar fallback: cache local ou dados vazio
      return { tipo, sucesso: false, erro: `HTTP ${response.status}: ${response.statusText}`, statusCode: response.status };
    }

    const data = await response.json();
    const itens = Array.isArray(data) ? data : (data?.data || data?.itens || data?.content || []);

    if (!itens || itens.length === 0) {
      return { tipo, sucesso: false, erro: 'Nenhum item encontrado na API', avisoApi: true };
    }

    let inseridos = 0;
    let atualizados = 0;
    let erros = 0;

    // Processar em lotes de 100
    for (let i = 0; i < itens.length; i += 100) {
      const lote = itens.slice(i, i + 100);

      for (const item of lote) {
        try {
          const chaveValor = item[chaveId] || item.codigo || item.id;
          
          if (!chaveValor) {
            erros++;
            continue;
          }

          const sync_data = {
            [chaveId]: chaveValor,
            nome: item.nome || item.dsc_nome || '',
            glossario: item.dsc_glossario || item.descricao || item.glossario || '',
            situacao: item.situacao || 'A',
            synced_at: new Date().toISOString(),
            ...item // Manter campos extras da API
          };

          // Verificar se existe
          const existing = await base44.asServiceRole.entities[entity].filter(
            { [chaveId]: chaveValor },
            null,
            1
          );

          if (existing && existing.length > 0) {
            await base44.asServiceRole.entities[entity].update(existing[0].id, sync_data);
            atualizados++;
          } else {
            await base44.asServiceRole.entities[entity].create(sync_data);
            inseridos++;
          }
        } catch (itemError) {
          erros++;
        }
      }
    }

    return {
      tipo,
      sucesso: true,
      totalAPI: itens.length,
      inseridos,
      atualizados,
      erros,
      taxa_sucesso: ((inseridos + atualizados) / itens.length * 100).toFixed(1) + '%'
    };
  } catch (error) {
    console.error(`[sincronizarTabela ${tipo}]`, error);
    return { tipo, sucesso: false, erro: error.message, stack: error.stack };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const inicio = Date.now();
    const resultados = [];

    // Sincronizar todas as tabelas em paralelo
    const promises = TABELAS_TPU.map(t => sincronizarTabela(base44, t.tipo, t.entity, t.chaveId));
    const results = await Promise.all(promises);
    resultados.push(...results);

    // Log de sucesso
    const totalSucesso = resultados.filter(r => r.sucesso).length;
    await base44.asServiceRole.entities.Analytics.create({
      user_id: user.email,
      event_type: 'sync_tpu',
      entity_type: 'system',
      action: `Sincronizou TPU: ${totalSucesso}/${resultados.length} tabelas`,
      timestamp: new Date().toISOString(),
      metadata: { resultados },
      status: totalSucesso === resultados.length ? 'success' : 'error'
    });

    return Response.json({
      success: totalSucesso === resultados.length,
      resultados,
      tempoMs: Date.now() - inicio
    });
  } catch (error) {
    console.error('[syncTPUTables]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});