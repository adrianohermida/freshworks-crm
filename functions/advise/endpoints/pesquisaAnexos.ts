import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { numeroProcesso, tipo, dataInicio, dataFim, limit = 100 } = await req.json();

    if (!numeroProcesso) {
      return Response.json({
        success: false,
        error: 'numeroProcesso é obrigatório'
      }, { status: 400 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = 'https://api.advise.com.br';

    // Fetch anexos from Advise API
    const response = await fetch(`${adviseUrl}/core/v1/processos-clientes/anexos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numeroProcesso,
        tipo,
        dataInicio,
        dataFim,
        limit
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Advise API error: ${error.message || 'Unknown error'}`
      }, { status: response.status });
    }

    const anexosData = await response.json();
    const anexos = Array.isArray(anexosData) ? anexosData : anexosData.data || [];

    // Sync to local database
    const anexosSincronizados = [];
    for (const anexo of anexos) {
      const anexoLocal = {
        idAnexo: anexo.id || anexo.idAnexo,
        numeroProcesso,
        nomeArquivo: anexo.nomeArquivo || anexo.nome,
        extensao: anexo.extensao || anexo.ext || 'pdf',
        tamanhoBytes: anexo.tamanho || anexo.tamanhoBytes || 0,
        tipo: anexo.tipo || 'outro',
        descricao: anexo.descricao || '',
        dataUpload: anexo.dataUpload || new Date().toISOString(),
        dataDocumento: anexo.dataDocumento || null,
        autoria: anexo.autoria || user.full_name,
        assinado: anexo.assinado === true,
        privado: anexo.privado === true,
        dataSincronizacao: new Date().toISOString(),
        status: 'disponivel'
      };

      try {
        const existing = await base44.entities.AnexoProcesso.filter({
          idAnexo: anexoLocal.idAnexo
        });

        if (existing && existing.length > 0) {
          await base44.entities.AnexoProcesso.update(existing[0].id, anexoLocal);
        } else {
          await base44.entities.AnexoProcesso.create(anexoLocal);
        }
        anexosSincronizados.push(anexoLocal);
      } catch (syncError) {
        console.error(`Error syncing anexo ${anexoLocal.idAnexo}:`, syncError);
      }
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'pesquisaAnexos',
      entidade: 'AnexoProcesso',
      resultado: 'success',
      metadados: { numeroProcesso, anexosCount: anexosSincronizados.length }
    });

    return Response.json({
      success: true,
      action: 'anexos.pesquisa',
      data: {
        numeroProcesso,
        anexos: anexosSincronizados,
        totalAnexos: anexosSincronizados.length,
        dataSincronizacao: new Date().toISOString(),
        message: `${anexosSincronizados.length} anexos encontrados para processo ${numeroProcesso}`
      }
    });
  } catch (error) {
    console.error('PesquisaAnexos error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});