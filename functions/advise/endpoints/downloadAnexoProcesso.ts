import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { idAnexo } = await req.json();

    if (!idAnexo) {
      return Response.json({
        success: false,
        error: 'idAnexo é obrigatório no body'
      }, { status: 400 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = 'https://api.advise.com.br';

    // Fetch download URL from Advise API
    const response = await fetch(`${adviseUrl}/core/v1/anexo-fonte-processo/${idAnexo}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Advise API error: ${error.message || 'Failed to get download URL'}`
      }, { status: response.status });
    }

    const downloadData = await response.json();
    const urlDownload = downloadData.urlDownload || downloadData.url;

    // Update AnexoProcesso with download URL
    const anexos = await base44.entities.AnexoProcesso.filter({
      idAnexo
    });

    if (anexos && anexos.length > 0) {
      await base44.entities.AnexoProcesso.update(anexos[0].id, {
        urlDownload,
        urlDownloadExpira: downloadData.urlDownloadExpira || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        dataSincronizacao: new Date().toISOString()
      });
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'downloadAnexo',
      entidade: 'AnexoProcesso',
      resultado: 'success',
      metadados: { idAnexo }
    });

    return Response.json({
      success: true,
      action: 'anexos.download',
      data: {
        idAnexo,
        urlDownload,
        urlDownloadExpira: downloadData.urlDownloadExpira || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        nomeArquivo: downloadData.nomeArquivo || '',
        tamanho: downloadData.tamanho || 0,
        message: `URL de download gerada com sucesso para anexo ${idAnexo}`
      }
    });
  } catch (error) {
    console.error('DownloadAnexoProcesso error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});