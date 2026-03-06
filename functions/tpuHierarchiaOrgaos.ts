import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TPU_BASE_URL = 'https://gateway.cloud.pje.jus.br/tpu';

/**
 * Endpoints de Hierarquia Judicial (Juizos/Órgãos)
 * 
 * TPU oferece:
 * - /api/v1/publico/consulta/detalhada/orgaos (órgãos julgadores)
 * - /api/v1/publico/consulta/detalhada/segmentos (segmentos de justiça)
 * - /api/v1/publico/consulta/detalhada/graus (graus de jurisdição)
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, codigo, nome, segmento, grau, pagina = 1, limit = 100 } = body;

    switch (action) {
      case 'listar_orgaos':
        return await listarOrgaos(base44, pagina, limit, { nome, segmento, grau });
      
      case 'buscar_orgao':
        return await buscarOrgaoPorCodigo(base44, codigo);
      
      case 'listar_segmentos':
        return await listarSegmentos(base44);
      
      case 'listar_graus':
        return await listarGraus(base44);
      
      case 'hierarquia_completa':
        return await obterHierarchiaCompleta(base44, codigo);
      
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[tpuHierarchiaOrgaos]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Lista órgãos julgadores com filtros
 */
async function listarOrgaos(base44, pagina, limit, filtros = {}) {
  try {
    // TPU requer filtro obrigatório (código, nome, segmento ou grau)
    if (!filtros.nome && !filtros.segmento && !filtros.grau) {
      // Se não há filtro, retornar de cache local
      const localOrgaos = await base44.asServiceRole.entities.JuizoCNJ.list();
      const orgaos = Array.isArray(localOrgaos) ? localOrgaos : (localOrgaos?.data || []);
      
      if (orgaos.length === 0) {
        return Response.json({
          success: false,
          error: 'TPU requer filtro obrigatório (nome, segmento ou grau). Nenhum dado em cache.',
          registros: [],
          total: 0
        }, { status: 400 });
      }

      return Response.json({
        success: true,
        total: orgaos.length,
        pagina: pagina,
        limite: limit,
        registros: orgaos.slice((pagina - 1) * limit, pagina * limit),
        source: 'cache'
      });
    }

    // Construir query com filtros obrigatórios
    const params = new URLSearchParams();
    params.append('pagina', pagina);
    params.append('tamanho', limit);
    
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.segmento) params.append('segmento', filtros.segmento);
    if (filtros.grau) params.append('grau', filtros.grau);

    const url = `${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/orgaos?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`TPU API retornou ${response.status}`);
    }

    const data = await response.json();
    const orgaos = data.content || (Array.isArray(data) ? data : []);

    // Armazenar em cache local
    for (const orgao of orgaos) {
      try {
        await base44.asServiceRole.entities.JuizoCNJ.create({
          codigo: orgao.codigo || orgao.cod_item,
          nome: orgao.nome,
          tribunal: orgao.tribunal,
          municipio: orgao.municipio,
          codigo_ibge: orgao.codigo_ibge,
          tipo: orgao.tipo || 'vara',
          grau: orgao.grau,
          especialidade: orgao.especialidade,
          ativo: true
        }).catch(() => {}); // Ignorar duplicatas
      } catch (e) {
        // Log silencioso
      }
    }

    return Response.json({
      success: true,
      total: data.totalElements || orgaos.length,
      pagina: pagina,
      limite: limit,
      registros: orgaos,
      source: 'tpu'
    });
  } catch (error) {
    console.error('[listarOrgaos]', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * Busca órgão específico por código
 */
async function buscarOrgaoPorCodigo(base44, codigo) {
  try {
    // Primeiro tenta local
    const local = await base44.asServiceRole.entities.JuizoCNJ.filter({
      codigo: codigo
    });

    if (local && local.length > 0) {
      return Response.json({
        success: true,
        source: 'cache',
        orgao: local[0]
      });
    }

    // Depois tenta TPU
    const url = `${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/orgaos?codigo=${codigo}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return Response.json({
        success: false,
        message: 'Órgão não encontrado'
      }, { status: 404 });
    }

    const data = await response.json();
    const orgaos = data.content || (Array.isArray(data) ? data : []);
    const orgao = orgaos[0];

    if (!orgao) {
      return Response.json({
        success: false,
        message: 'Órgão não encontrado'
      }, { status: 404 });
    }

    // Armazenar em cache
    try {
      await base44.asServiceRole.entities.JuizoCNJ.create({
        codigo: orgao.codigo,
        nome: orgao.nome,
        tribunal: orgao.tribunal,
        municipio: orgao.municipio,
        codigo_ibge: orgao.codigo_ibge,
        tipo: orgao.tipo,
        grau: orgao.grau,
        especialidade: orgao.especialidade,
        ativo: true
      });
    } catch (e) {}

    return Response.json({
      success: true,
      source: 'tpu',
      orgao: orgao
    });
  } catch (error) {
    console.error('[buscarOrgaoPorCodigo]', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * Lista segmentos de justiça
 */
async function listarSegmentos(base44) {
  try {
    const url = `${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/segmentos`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`TPU API retornou ${response.status}`);
    }

    const data = await response.json();
    const segmentos = data.content || (Array.isArray(data) ? data : []);

    return Response.json({
      success: true,
      segmentos: segmentos.map(s => ({
        codigo: s.codigo || s.cod_item,
        nome: s.nome,
        descricao: s.descricao || s.descricao_glossario
      }))
    });
  } catch (error) {
    console.error('[listarSegmentos]', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * Lista graus de jurisdição
 */
async function listarGraus(base44) {
  try {
    const url = `${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/graus`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`TPU API retornou ${response.status}`);
    }

    const data = await response.json();
    const graus = data.content || (Array.isArray(data) ? data : []);

    return Response.json({
      success: true,
      graus: graus.map(g => ({
        codigo: g.codigo || g.cod_item,
        nome: g.nome,
        descricao: g.descricao || g.descricao_glossario
      }))
    });
  } catch (error) {
    console.error('[listarGraus]', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * Obtém hierarquia completa: Segmento → Grau → Órgão
 * NOTA: Utiliza cache local. Segmentos e Graus podem não exigir filtro.
 */
async function obterHierarchiaCompleta(base44, codigoSegmento) {
  try {
    // Tentar segmentos
    let segmentos = { content: [] };
    try {
      const segResponse = await fetch(`${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/segmentos`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });
      if (segResponse.ok) {
        segmentos = await segResponse.json();
      }
    } catch (e) {
      console.warn('[segmentos] Erro:', e.message);
    }

    // Tentar graus
    let graus = { content: [] };
    try {
      const grauResponse = await fetch(`${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/graus`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });
      if (grauResponse.ok) {
        graus = await grauResponse.json();
      }
    } catch (e) {
      console.warn('[graus] Erro:', e.message);
    }

    // Órgãos: usar cache local se disponível (não faz requisição sem filtro)
    let orgaosData = { content: [] };
    try {
      const localOrgaos = await base44.asServiceRole.entities.JuizoCNJ.list();
      const orgaosList = Array.isArray(localOrgaos) ? localOrgaos : (localOrgaos?.data || []);
      if (orgaosList.length > 0) {
        orgaosData = { content: orgaosList };
      }
    } catch (e) {
      console.warn('[orgaos cache] Erro:', e.message);
    }

    const segmentosList = segmentos.content || [];
    const grausList = graus.content || [];
    const orgaosList = orgaosData.content || [];

    const hierarquia = segmentosList.map(seg => ({
      segmento: {
        codigo: seg.codigo,
        nome: seg.nome
      },
      graus: grausList.filter(g => !codigoSegmento || g.segmento === seg.codigo).map(g => ({
        codigo: g.codigo,
        nome: g.nome,
        orgaos: orgaosList
          .filter(o => o.segmento === seg.codigo && o.grau === g.codigo)
          .map(o => ({
            codigo: o.codigo,
            nome: o.nome,
            tribunal: o.tribunal,
            municipio: o.municipio,
            especialidade: o.especialidade
          }))
      }))
    }));

    return Response.json({
      success: true,
      hierarquia: hierarquia
    });
  } catch (error) {
    console.error('[obterHierarchiaCompleta]', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}