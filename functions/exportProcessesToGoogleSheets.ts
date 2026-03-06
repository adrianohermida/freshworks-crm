import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Export Processes to Google Sheets
 * Creates/updates a Google Sheet with all user's processes
 * Auto-syncs on demand or scheduled
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Fetch user's processes (linked via ProcessoUsuario)
    const userProcesses = await base44.entities.ProcessoUsuario.filter(
      { usuario_email: user.email },
      '-data_adicao',
      500
    );

    // Get full process details
    const processIds = userProcesses.map(up => up.processo_cnj);
    const processes = await base44.entities.ProcessoRepositorio.filter(
      { cnj_number: { $in: processIds } },
      '-data_verificacao_datajud',
      500
    );

    // Create sheet data
    const sheetData = [
      ['CNJ', 'Número', 'Tribunal', 'Classe', 'Assunto', 'Status', 'Última Verificação'],
      ...processes.map(p => [
        p.cnj_number,
        p.numero_sequencial,
        p.tribunal_nome,
        p.classe_nome,
        p.assunto_nome,
        p.status_repositorio,
        new Date(p.data_verificacao_datajud).toLocaleDateString('pt-BR'),
      ]),
    ];

    // Create or update spreadsheet
    const spreadsheetPayload = {
      properties: {
        title: `LegalDock - Processos (${new Date().toLocaleDateString('pt-BR')})`,
      },
      sheets: [
        {
          properties: {
            sheetId: 0,
            title: 'Processos',
            gridProperties: {
              rowCount: sheetData.length + 1,
              columnCount: 7,
            },
          },
          data: [
            {
              rowData: sheetData.map(row => ({
                values: row.map(cell => ({
                  userEnteredValue: {
                    stringValue: String(cell),
                  },
                })),
              })),
            },
          ],
        },
      ],
    };

    const response = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spreadsheetPayload),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }

    const spreadsheet = await response.json();

    return Response.json({
      success: true,
      spreadsheetId: spreadsheet.spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheet.spreadsheetId}`,
      processesCount: processes.length,
    });
  } catch (error) {
    console.error('Export error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});