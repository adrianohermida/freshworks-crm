import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Restaura processos a partir do Google Sheets (fallback offline)
 * Usada quando o servidor principal está offline
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { spreadsheetId } = await req.json();

    if (!spreadsheetId) {
      return Response.json({ error: 'spreadsheetId is required' }, { status: 400 });
    }

    // Get Google Sheets connection
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Read data from Google Sheets
    const sheetResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Processos'!A2:G`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!sheetResponse.ok) {
      return Response.json({
        error: 'Failed to read Google Sheet',
        details: await sheetResponse.text()
      }, { status: 400 });
    }

    const sheetData = await sheetResponse.json();
    const rows = sheetData.values || [];

    if (rows.length === 0) {
      return Response.json({
        success: true,
        restored_count: 0,
        message: 'No data found in Google Sheet'
      });
    }

    // Restore/sync processes from sheet
    let restoredCount = 0;
    const errors = [];

    for (const row of rows) {
      try {
        const [cnjNumber, title, status, syncedAt, lastMovement, movementCount, notes] = row;

        if (!cnjNumber) continue; // Skip empty rows

        // Check if process exists
        const existing = await base44.entities.Process.filter({
          cnj_number: cnjNumber,
          created_by: user.email
        });

        if (existing.length > 0) {
          // Update
          await base44.entities.Process.update(existing[0].id, {
            title: title || existing[0].title,
            status: status || 'active',
            notes: notes || '',
            synced_at: new Date().toISOString()
          });
        } else {
          // Create new
          await base44.entities.Process.create({
            cnj_number: cnjNumber,
            title: title || 'Imported from Google Sheets',
            status: status || 'active',
            notes: notes || `Restaurado do Google Sheets em ${new Date().toLocaleString()}`,
            synced_at: new Date().toISOString()
          });
        }

        restoredCount++;
      } catch (rowError) {
        errors.push({
          row: row[0],
          error: rowError.message
        });
      }
    }

    return Response.json({
      success: true,
      restored_count: restoredCount,
      errors: errors.length > 0 ? errors : null,
      timestamp: new Date().toISOString(),
      message: `✓ ${restoredCount} processos restaurados do Google Sheets`
    });

  } catch (error) {
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});