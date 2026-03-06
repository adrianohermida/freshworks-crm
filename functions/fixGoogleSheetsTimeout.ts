import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1s

function exponentialBackoff(attempt) {
  return BASE_DELAY * Math.pow(2, attempt);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sheetId, data, operation = 'append' } = await req.json();

    if (!sheetId) {
      return Response.json({ error: 'sheetId is required' }, { status: 400 });
    }

    let lastError;
    let result;

    // Retry logic with exponential backoff
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Get Google Sheets connector
        const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

        // Prepare request based on operation
        let url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
        let method = 'POST';
        let body;

        if (operation === 'append') {
          url += `/values/${data.range}:append?valueInputOption=USER_ENTERED`;
          body = JSON.stringify({ values: [data.values] });
        } else if (operation === 'update') {
          url += `/values/${data.range}?valueInputOption=USER_ENTERED`;
          body = JSON.stringify({ values: [data.values] });
          method = 'PUT';
        }

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30s timeout per request
          body
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Google Sheets API error: ${response.status} - ${error}`);
        }

        result = await response.json();

        // Log successful operation
        await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `Log: Google Sheets sync successful on attempt ${attempt + 1}. Sheet: ${sheetId}, Operation: ${operation}`
        });

        return Response.json({
          success: true,
          result,
          attempts: attempt + 1,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        lastError = error;

        if (attempt < MAX_RETRIES) {
          const delay = exponentialBackoff(attempt);
          console.log(`Retry attempt ${attempt + 1}/${MAX_RETRIES} after ${delay}ms:`, error.message);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    console.error('Google Sheets sync failed after all retries:', lastError.message);

    // Log failure for monitoring
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: user.email,
        subject: '⚠️ Google Sheets Sync Failed - Manual Intervention Needed',
        body: `
          Google Sheets synchronization failed after ${MAX_RETRIES + 1} attempts.
          
          Details:
          - Sheet ID: ${sheetId}
          - Operation: ${operation}
          - Error: ${lastError.message}
          - Timestamp: ${new Date().toISOString()}
          
          Please retry manually or contact support.
        `
      });
    } catch (emailError) {
      console.error('Failed to send error notification:', emailError.message);
    }

    return Response.json({
      success: false,
      error: lastError.message,
      attempts: MAX_RETRIES + 1,
      timestamp: new Date().toISOString()
    }, { status: 503 });

  } catch (error) {
    console.error('Function error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});