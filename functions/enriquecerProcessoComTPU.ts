import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Enriquece processo com dados TPU (classe, assunto, movimento)
 * Busca em TPUClasse, TPUAssunto, TPUMovimento
 * Retorna dados enriquecidos para sincronizarProcessoDataJud
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { processoCEJUSCId, classeCodigoDataJud, assuntosCodigos } = await req.json();

    if (!processoCEJUSCId) {
      return Response.json({ 
        status: 'erro',
        error: 'processoCEJUSCId obrigatório' 
      }, { status: 400 });
    }

    const enriquecimento = {
      classe_codigo: null,
      classe_judicial: null,
      assuntos_enriquecidos: [],
    };

    // Enriquecer classe
    if (classeCodigoDataJud) {
      try {
        const classes = await base44.entities.TPUClasse.filter(
          { codigo: Number(classeCodigoDataJud) },
          null,
          1
        );
        
        if (classes && classes.length > 0) {
          const classe = classes[0];
          enriquecimento.classe_codigo = classe.codigo;
          enriquecimento.classe_judicial = classe.nome || `Classe ${classe.codigo}`;
        }
      } catch (e) {
        console.warn('Erro ao buscar classe TPU:', e.message);
      }
    }

    // Enriquecer assuntos
    if (Array.isArray(assuntosCodigos) && assuntosCodigos.length > 0) {
      try {
        for (const codigo of assuntosCodigos) {
          const assuntos = await base44.entities.TPUAssunto.filter(
            { codigo: Number(codigo) },
            null,
            1
          );
          
          if (assuntos && assuntos.length > 0) {
            const assunto = assuntos[0];
            enriquecimento.assuntos_enriquecidos.push({
              codigo: assunto.codigo,
              nome: assunto.nome || `Assunto ${assunto.codigo}`,
              glossario: assunto.glossario || null,
            });
          }
        }
      } catch (e) {
        console.warn('Erro ao buscar assuntos TPU:', e.message);
      }
    }

    return Response.json({
      status: 'sucesso',
      enriquecimento,
      tempo_execucao_ms: Date.now(),
    });

  } catch (error) {
    console.error('Erro em enriquecerProcessoComTPU:', error);
    return Response.json({
      status: 'erro',
      error: error.message,
    }, { status: 500 });
  }
});