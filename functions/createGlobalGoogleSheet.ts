import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's Google Sheets token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Create new spreadsheet
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: `DataJud - Processos Judiciais (${user.full_name})`
        },
        sheets: [
          { properties: { title: 'Processos' } },
          { properties: { title: 'Prazos' } },
          { properties: { title: 'Publicações' } }
        ]
      })
    });

    if (!createResponse.ok) {
      throw new Error('Erro ao criar planilha no Google Sheets');
    }

    const spreadsheet = await createResponse.json();
    const spreadsheetId = spreadsheet.spreadsheetId;

    // Save spreadsheet ID to user profile
    await base44.auth.updateMe({
      global_google_sheet_id: spreadsheetId
    });

    return Response.json({
      success: true,
      spreadsheetId,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      message: 'Planilha global criada com sucesso!'
    });

  } catch (error) {
    console.error('Error creating global sheet:', error);
    return Response.json({
      error: 'Erro ao criar planilha global',
      details: error.message
    }, { status: 500 });
  }
});