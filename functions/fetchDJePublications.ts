import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Busca publicações do DataJud para um processo
 * Sincroniza com base de dados local
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cnj_number } = await req.json();

    if (!cnj_number) {
      return Response.json({ error: 'cnj_number is required' }, { status: 400 });
    }

    // Validar formato CNJ
    const cnjRegex = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}\.\d{6}$/;
    if (!cnjRegex.test(cnj_number)) {
      return Response.json({ error: 'Invalid CNJ format' }, { status: 400 });
    }

    // Buscar processo
    const process = await base44.entities.Process.filter(
      { cnj_number },
      null,
      1
    );

    if (process.length === 0) {
      return Response.json({ error: 'Process not found' }, { status: 404 });
    }

    const processId = process[0].id;
    const datajudBaseUrl = Deno.env.get('DATAJUD_BASE_URL');
    const datajudApiKey = Deno.env.get('DATAJUD_API_KEY');

    // Buscar publicações da API DataJud
    const datajudUrl = `${datajudBaseUrl}/consulta/publica/acompanhamento/${cnj_number}`;
    
    const response = await fetch(datajudUrl, {
      headers: {
        'Authorization': `Bearer ${datajudApiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json(
        { error: 'DataJud API error', status: response.status },
        { status: response.status }
      );
    }

    const datajudData = await response.json();
    const publications = datajudData.publicacoes || [];

    // Sincronizar publicações
    let created = 0;
    let updated = 0;

    for (const pub of publications) {
      const existingPub = await base44.entities.Publication.filter(
        {
          process_id: processId,
          datajud_publication_id: pub.id
        },
        null,
        1
      );

      if (existingPub.length > 0) {
        // Atualizar
        await base44.entities.Publication.update(existingPub[0].id, {
          title: pub.titulo || 'Publicação DJe',
          publication_date: pub.dataPublicacao,
          dj: pub.diario || 'DJe',
          content: pub.descricao,
          document_url: pub.urlDocumento,
          raw_data: pub,
          synced_at: new Date().toISOString()
        });
        updated++;
      } else {
        // Criar
        await base44.entities.Publication.create({
          process_id: processId,
          title: pub.titulo || 'Publicação DJe',
          publication_date: pub.dataPublicacao,
          publication_number: pub.numero,
          dj: pub.diario || 'DJe',
          content: pub.descricao,
          document_url: pub.urlDocumento,
          status: 'published',
          datajud_publication_id: pub.id,
          raw_data: pub,
          synced_at: new Date().toISOString()
        });
        created++;
      }
    }

    // Atualizar última sincronização do processo
    await base44.entities.Process.update(processId, {
      synced_at: new Date().toISOString()
    });

    return Response.json({
      success: true,
      created,
      updated,
      total: publications.length,
      message: `Sincronizado ${created} novas publicações, ${updated} atualizadas`
    });
  } catch (error) {
    console.error('[FetchDJePublications] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});