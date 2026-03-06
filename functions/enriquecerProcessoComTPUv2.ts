import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * enriquecerProcessoComTPUv2 - Enriquecimento completo com TPU
 * Suporta: Classe, Assunto, Movimento, Documento
 * Usa entidades: TPUClasses, TPUAssuntos, TPUMovimentos, TPUDocumentos (plural - schema real)
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const {
      processoCEJUSCId,
      classeCodigoDataJud,
      assuntosCodigos = [],
      movimentosCodigos = [],
      documentosCodigos = []
    } = await req.json();

    if (!processoCEJUSCId) {
      return Response.json({ error: 'processoCEJUSCId obrigatório' }, { status: 400 });
    }

    const enriquecimento = {
      classe_judicial: null,
      classe_codigo: null,
      assuntos_enriquecidos: [],
      movimentos_enriquecidos: [],
      documentos_enriquecidos: [],
      metadadoEnriquecimento: {
        data_enriquecimento: new Date().toISOString(),
        usuario_email: user.email
      }
    };

    // Enriquecer Classe (TPUClasses - schema usa cod_classe)
    if (classeCodigoDataJud) {
      try {
        const classes = await base44.asServiceRole.entities.TPUClasses.filter(
          { cod_classe: parseInt(classeCodigoDataJud) },
          null,
          1
        );
        if (classes && classes.length > 0) {
          enriquecimento.classe_judicial = classes[0].nome;
          enriquecimento.classe_codigo = classes[0].cod_classe;
          enriquecimento.classe_sigla = classes[0].sigla || '';
          enriquecimento.classe_glossario = classes[0].glossario || '';
        }
      } catch (e) {
        console.warn('Erro ao enriquecer classe:', e.message);
      }
    }

    // Enriquecer Assuntos (TPUAssuntos - schema usa cod_assunto)
    for (const codigo of assuntosCodigos.slice(0, 10)) {
      try {
        const assuntos = await base44.asServiceRole.entities.TPUAssuntos.filter(
          { cod_assunto: parseInt(codigo) },
          null,
          1
        );
        if (assuntos && assuntos.length > 0) {
          enriquecimento.assuntos_enriquecidos.push({
            codigo,
            nome: assuntos[0].nome,
            ramo_direito: assuntos[0].ramo_direito || '',
            glossario: assuntos[0].glossario || ''
          });
        }
      } catch (e) {
        console.warn(`Erro ao enriquecer assunto ${codigo}:`, e.message);
      }
    }

    // Enriquecer Movimentos (TPUMovimentos - schema usa cod_movimento)
    for (const codigo of movimentosCodigos.slice(0, 50)) {
      try {
        const movs = await base44.asServiceRole.entities.TPUMovimentos.filter(
          { cod_movimento: parseInt(codigo) },
          null,
          1
        );
        if (movs && movs.length > 0) {
          enriquecimento.movimentos_enriquecidos.push({
            codigo,
            nome: movs[0].nome,
            categoria: movs[0].categoria || '',
            subcategoria: movs[0].subcategoria || '',
            glossario: movs[0].glossario || ''
          });
        }
      } catch (e) {
        console.warn(`Erro ao enriquecer movimento ${codigo}:`, e.message);
      }
    }

    // Enriquecer Documentos (TPUDocumentos - schema usa cod_documento_processual)
    for (const codigo of documentosCodigos.slice(0, 20)) {
      try {
        const docs = await base44.asServiceRole.entities.TPUDocumentos.filter(
          { cod_documento_processual: parseInt(codigo) },
          null,
          1
        );
        if (docs && docs.length > 0) {
          enriquecimento.documentos_enriquecidos.push({
            codigo,
            glossario: docs[0].txt_glossario || ''
          });
        }
      } catch (e) {
        console.warn(`Erro ao enriquecer documento ${codigo}:`, e.message);
      }
    }

    return Response.json({ status: 'sucesso', enriquecimento });

  } catch (error) {
    console.error('Erro em enriquecerProcessoComTPUv2:', error);
    return Response.json({ status: 'erro', error: error.message }, { status: 500 });
  }
});