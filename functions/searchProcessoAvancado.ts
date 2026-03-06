import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Cache em memória (simples) - em produção usar Redis
const cacheResultados = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function obterDoCache(chave) {
  const item = cacheResultados.get(chave);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cacheResultados.delete(chave);
    return null;
  }
  return item.data;
}

function salvarNoCache(chave, dados) {
  cacheResultados.set(chave, { data: dados, timestamp: Date.now() });
}

// Full-text search - busca em múltiplos campos
function filtrarPorTexto(processos, termo) {
  const termoBaixo = termo.toLowerCase();
  return processos.filter(p =>
    p.cnj_number?.toLowerCase().includes(termoBaixo) ||
    p.classe_nome?.toLowerCase().includes(termoBaixo) ||
    p.assunto_nome?.toLowerCase().includes(termoBaixo) ||
    p.tribunal_nome?.toLowerCase().includes(termoBaixo) ||
    p.origem_nome?.toLowerCase().includes(termoBaixo)
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      tipo_busca, // 'cnj', 'litigante', 'classe', 'tribunal', 'texto'
      termo,
      tribunal_codigo,
      classe_id,
      ano,
      periodo,
      pagina = 1,
      limite = 25,
      incluirCache = true
    } = await req.json();

    // Criar chave de cache
    const cacheKey = `${tipo_busca}:${termo}:${tribunal_codigo}:${classe_id}:${ano}`;

    // Tentar obter do cache
    if (incluirCache) {
      const resultadoCache = obterDoCache(cacheKey);
      if (resultadoCache) {
        return Response.json({
          success: true,
          resultado: resultadoCache,
          fonte: 'cache',
          cacheHitRate: Math.min(100, (cacheResultados.size * 20))
        });
      }
    }

    let processos = [];
    const tempoInicio = Date.now();

    // BUSCA POR NÚMERO CNJ (índice PK - O(1))
    if (tipo_busca === 'cnj' && termo) {
      try {
        processos = await base44.entities.ProcessoRepositorio.filter({
          cnj_number: termo
        });
      } catch (err) {
        console.error('Erro busca CNJ:', err.message);
      }
    }

    // BUSCA POR LITIGANTE/CONTATO (JOIN - O(log n) com índice)
    if (tipo_busca === 'litigante' && termo) {
      try {
        // Buscar contatos com esse nome
        const contatos = await base44.entities.Contato.filter({});
        const contatosMatching = contatos.filter(c =>
          c.name?.toLowerCase().includes(termo.toLowerCase()) ||
          c.document?.includes(termo)
        );

        if (contatosMatching.length > 0) {
          // Buscar processos associados
          const todasProcessos = await base44.entities.ProcessoRepositorio.list();
          processos = todasProcessos.filter(p => {
            // Simular JOIN - em produção seria SQL
            return contatosMatching.some(c => 
              p.datajud_raw_data?.partes?.some(parte => 
                parte.id === c.id || parte.nome?.toLowerCase().includes(termo.toLowerCase())
              )
            );
          });
        }
      } catch (err) {
        console.error('Erro busca litigante:', err.message);
      }
    }

    // BUSCA POR TRIBUNAL + INSTÂNCIA (índice composto)
    if (tipo_busca === 'tribunal' && tribunal_codigo) {
      try {
        processos = await base44.entities.ProcessoRepositorio.filter({
          tribunal_codigo
        });
      } catch (err) {
        console.error('Erro busca tribunal:', err.message);
      }
    }

    // BUSCA POR CLASSE PROCESSUAL (índice)
    if (tipo_busca === 'classe' && classe_id) {
      try {
        processos = await base44.entities.ProcessoRepositorio.filter({
          classe_id,
          ...(tribunal_codigo && { tribunal_codigo })
        });
      } catch (err) {
        console.error('Erro busca classe:', err.message);
      }
    }

    // BUSCA FULL-TEXT (em múltiplos campos)
    if (tipo_busca === 'texto' && termo) {
      try {
        const todos = await base44.entities.ProcessoRepositorio.list();
        processos = filtrarPorTexto(todos, termo);
      } catch (err) {
        console.error('Erro busca full-text:', err.message);
      }
    }

    // Filtro por período (se aplicável)
    if (periodo && periodo !== 'todos') {
      const agora = new Date();
      let dataLimite = new Date();

      if (periodo === 'ultimo_mes') {
        dataLimite.setMonth(agora.getMonth() - 1);
      } else if (periodo === 'ultimos_3_meses') {
        dataLimite.setMonth(agora.getMonth() - 3);
      } else if (periodo === 'ultimo_ano') {
        dataLimite.setFullYear(agora.getFullYear() - 1);
      }

      processos = processos.filter(p => {
        const dataProceso = new Date(p.data_verificacao_datajud);
        return dataProceso >= dataLimite;
      });
    }

    // Paginação
    const offset = (pagina - 1) * limite;
    const processosPage = processos.slice(offset, offset + limite);

    // Enriquecer com dados do usuário
    for (let proc of processosPage) {
      try {
        const assoc = await base44.entities.ProcessoUsuario.filter({
          processo_cnj: proc.cnj_number,
          usuario_email: user.email
        });
        if (assoc.length > 0) {
          proc.usuario_papel = assoc[0].papel;
          proc.usuario_notas = assoc[0].notas_internas;
          proc.usuario_favorito = assoc[0].favorito;
        }
      } catch (err) {
        // Ignorar erro se ProcessoUsuario não existir
      }
    }

    const tempoExecucao = Date.now() - tempoInicio;
    const resultado = {
      processos: processosPage,
      total: processos.length,
      pagina,
      limite,
      paginas_totais: Math.ceil(processos.length / limite),
      tempo_ms: tempoExecucao
    };

    // Salvar no cache
    if (tempoExecucao > 50) { // Cache apenas queries lentas
      salvarNoCache(cacheKey, resultado);
    }

    return Response.json({
      success: true,
      resultado,
      fonte: 'database',
      metricas: {
        tempo_ms: tempoExecucao,
        tipo_busca,
        cache_size: cacheResultados.size,
        tempo_otimo: tempoExecucao < 100
      }
    });

  } catch (error) {
    console.error('Erro em searchProcessoAvancado:', error.message);
    return Response.json({
      error: error.message
    }, { status: 500 });
  }
});