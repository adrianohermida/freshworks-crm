import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseApiUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const { documentoId, numeroProcesso } = await req.json();

    if (!documentoId) {
      return Response.json({
        success: false,
        error: 'documentoId é obrigatório'
      }, { status: 400 });
    }

    // GET /documentos/:id/download - download com streaming
    const response = await fetch(`${adviseApiUrl}/documentos/${documentoId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    // Obter arquivo como ArrayBuffer
    const fileBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('content-disposition') || `attachment; filename=documento-${documentoId}`;

    // Atualizar DB com URL temporária
    if (numeroProcesso) {
      const anexos = await base44.entities.AnexoProcesso.filter({
        idAnexo: documentoId
      });

      if (anexos.length > 0) {
        await base44.entities.AnexoProcesso.update(anexos[0].id, {
          urlDownload: `${adviseApiUrl}/documentos/${documentoId}/download`,
          urlDownloadExpira: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          dataSincronizacao: new Date().toISOString()
        });
      }
    }

    // Retornar arquivo com headers apropriados
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Download-Success': 'true'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});