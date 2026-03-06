import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { NOTES_OAUTH } from './FRESHSALES_OAUTH_CREDENTIALS.js';

const fetchFromFreshsales = async (endpoint, accessToken) => {
  const response = await fetch(`https://api.freshsales.io${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Freshsales API error: ${response.statusText}`);
  }

  return response.json();
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant_id = user.id;
    const accessToken = NOTES_OAUTH.clientSecret; // In production, use OAuth token

    // Fetch notes from Freshsales
    let allNotes = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const data = await fetchFromFreshsales(
        `/api/notes?page=${page}&per_page=100`,
        accessToken
      );

      if (data.notes && data.notes.length > 0) {
        allNotes = [...allNotes, ...data.notes];
        page++;
        hasMore = data.notes.length === 100;
      } else {
        hasMore = false;
      }
    }

    // Sync notes to Base44
    const syncedNotes = [];
    for (const note of allNotes) {
      try {
        const existingNote = await base44.entities.FreshsalesNote.filter(
          { freshsales_id: note.id, tenant_id }
        );

        const noteData = {
          title: note.title || note.description?.substring(0, 100),
          description: note.description,
          target_id: note.targetable_id,
          target_type: note.targetable_type,
          created_by: note.created_by,
          last_synced_at: new Date().toISOString(),
          sync_status: 'synced',
        };

        if (existingNote.length > 0) {
          // Update existing
          await base44.entities.FreshsalesNote.update(existingNote[0].id, noteData);
          syncedNotes.push({ id: note.id, action: 'updated' });
        } else {
          // Create new
          await base44.entities.FreshsalesNote.create({
            ...noteData,
            freshsales_id: note.id,
            tenant_id,
          });
          syncedNotes.push({ id: note.id, action: 'created' });
        }
      } catch (error) {
        console.error(`Error syncing note ${note.id}:`, error.message);
        syncedNotes.push({ id: note.id, action: 'failed', error: error.message });
      }
    }

    return Response.json({
      success: true,
      message: `Synced ${syncedNotes.length} notes`,
      synced: syncedNotes,
      totalNotes: allNotes.length,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});