import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Sincroniza processos para Google Sheets
 * Cria/atualiza planilha com dados dos processos
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { spreadsheetId, action = 'sync' } = await req.json();

    if (!spreadsheetId) {
      return Response.json({ error: 'spreadsheetId is required' }, { status: 400 });
    }

    // Get Google Sheets connection
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Fetch user's processes
    const processes = await base44.entities.Process.filter({
      created_by: user.email
    });

    // Prepare data for Google Sheets
    const rows = [
      ['CNJ Number', 'Title', 'Status', 'Synced At', 'Last Movement', 'Movement Count', 'Notes']
    ];

    processes.forEach(proc => {
      rows.push([
        proc.cnj_number || '',
        proc.title || '',
        proc.status || '',
        proc.synced_at || '',
        proc.last_movement_date || '',
        proc.movement_count || 0,
        proc.notes || ''
      ]);
    });

    // Get current sheet info
    const sheetResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!sheetResponse.ok) {
      return Response.json({
        error: 'Failed to access Google Sheet',
        details: await sheetResponse.text()
      }, { status: 400 });
    }

    const sheetData = await sheetResponse.json();
    const sheetId = sheetData.sheets[0].properties.sheetId;

    // Clear existing data
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Processos'!A1:G`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Write new data
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Processos'!A1:G${rows.length}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: rows
        })
      }
    );

    if (!updateResponse.ok) {
      return Response.json({
        error: 'Failed to update Google Sheet',
        details: await updateResponse.text()
      }, { status: 400 });
    }

    return Response.json({
      success: true,
      synced_rows: rows.length - 1,
      spreadsheet_id: spreadsheetId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});