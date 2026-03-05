import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      tipo_busca, // 'cnj', 'litigante', 'classe', 'orgao', 'tribunal'
      termo,
      tribunal_codigo,
      instancia,
      classe_id,
      ano,
      pagina = 1,
      limite = 25
    } = await req.json();

    let query = {};
    let resultado = { processos: [], total: 0, pagina, limite };

    // Busca por número CNJ (mais rápido - índice PK)
    if (tipo_busca === 'cnj' && termo) {
      try {
        const processos = await base44.entities.ProcessoRepositorio.filter({
          cnj_number: termo
        });
        resultado.processos = processos.slice(0, 1);
        resultado.total = processos.length;
      } catch (err) {
        console.error('Erro na busca CNJ:', err.message);
      }
    }

    // Busca por tribunal e instância (comum)
    if (tipo_busca === 'tribunal' && tribunal_codigo) {
      try {
        const processos = await base44.entities.ProcessoRepositorio.filter({
          tribunal_codigo,
          ...(instancia && { instancia })
        });
        
        const offset = (pagina - 1) * limite;
        resultado.processos = processos.slice(offset, offset + limite);
        resultado.total = processos.length;
      } catch (err) {
        console.error('Erro na busca tribunal:', err.message);
      }
    }

    // Busca por classe processual
    if (tipo_busca === 'classe' && classe_id) {
      try {
        const processos = await base44.entities.ProcessoRepositorio.filter({
          classe_id,
          ...(tribunal_codigo && { tribunal_codigo })
        });
        
        const offset = (pagina - 1) * limite;
        resultado.processos = processos.slice(offset, offset + limite);
        resultado.total = processos.length;
      } catch (err) {
        console.error('Erro na busca classe:', err.message);
      }
    }

    // Busca por órgão
    if (tipo_busca === 'orgao' && termo) {
      try {
        const processos = await base44.entities.ProcessoRepositorio.filter({
          origem_nome: termo
        });
        
        const offset = (pagina - 1) * limite;
        resultado.processos = processos.slice(offset, offset + limite);
        resultado.total = processos.length;
      } catch (err) {
        console.error('Erro na busca órgão:', err.message);
      }
    }

    // Enriquecer com dados do usuário (ProcessoUsuario)
    if (resultado.processos.length > 0) {
      try {
        for (let proc of resultado.processos) {
          const assoc = await base44.entities.ProcessoUsuario.filter({
            processo_cnj: proc.cnj_number,
            usuario_email: user.email
          });
          
          if (assoc.length > 0) {
            proc.usuario_papel = assoc[0].papel;
            proc.usuario_notas = assoc[0].notas_internas;
            proc.usuario_favorito = assoc[0].favorito;
          }
        }
      } catch (err) {
        console.warn('Erro ao enriquecer dados do usuário:', err.message);
      }
    }

    return Response.json({
      success: true,
      resultado,
      metricas: {
        tempo_ms: Date.now(),
        tipo_busca,
        paginas_totais: Math.ceil(resultado.total / limite)
      }
    });

  } catch (error) {
    console.error('Erro em searchProcessoRepositorio:', error.message);
    return Response.json({
      error: error.message
    }, { status: 500 });
  }
});