import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Sincroniza status de publicações com DataJud
 * Função scheduled para execução periódica
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch todas as publicações pendentes
    const publications = await base44.entities.Publication.filter(
      { status: 'pending' },
      '-publication_date',
      100
    );

    if (publications.length === 0) {
      return Response.json({
        message: 'Nenhuma publicação pendente',
        processed: 0,
        updated: 0
      });
    }

    const datajudBaseUrl = Deno.env.get('DATAJUD_BASE_URL');
    const datajudApiKey = Deno.env.get('DATAJUD_API_KEY');

    let updated = 0;

    // Atualizar status de cada publicação
    for (const publication of publications) {
      // Buscar dados atualizados da API
      const processData = await base44.entities.Process.filter(
        { id: publication.process_id },
        null,
        1
      );

      if (processData.length === 0) continue;

      const cnj = processData[0].cnj_number;
      const datajudUrl = `${datajudBaseUrl}/consulta/publica/acompanhamento/${cnj}`;

      const response = await fetch(datajudUrl, {
        headers: {
          'Authorization': `Bearer ${datajudApiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) continue;

      const datajudData = await response.json();
      const remotePublication = datajudData.publicacoes?.find(
        (p) => p.id === publication.datajud_publication_id
      );

      if (remotePublication) {
        // Atualizar para publicado (status final)
        await base44.entities.Publication.update(publication.id, {
          status: 'published',
          synced_at: new Date().toISOString()
        });
        updated++;
      }
    }

    return Response.json({
      message: `Sincronizado ${updated} publicações`,
      processed: publications.length,
      updated
    });
  } catch (error) {
    console.error('[SyncPublicationStatus] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});