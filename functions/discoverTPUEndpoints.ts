import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Discover correct TPU Gateway endpoint format
 * Tests various endpoint patterns to find working URLs
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role?.includes('admin')) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const baseUrl = 'https://gateway.cloud.pje.jus.br';
    const table = 'assuntos';

    // Test different endpoint patterns
    const patterns = [
      { name: 'consulta/assuntos', url: `${baseUrl}/tpu/consulta/assuntos?size=10` },
      { name: 'assuntos', url: `${baseUrl}/tpu/assuntos?size=10` },
      { name: 'publico/assuntos', url: `${baseUrl}/tpu/publico/assuntos?size=10` },
      { name: 'api/assuntos', url: `${baseUrl}/tpu/api/assuntos?size=10` },
      { name: '/v1/publico/consulta/assuntos', url: `${baseUrl}/tpu/v1/publico/consulta/assuntos?size=10` },
      { name: '/publico/consulta/detalhada/assuntos', url: `${baseUrl}/tpu/publico/consulta/detalhada/assuntos?size=10` },
      { name: '/api/v1/publico/consulta/assuntos', url: `${baseUrl}/tpu/api/v1/publico/consulta/assuntos?size=10` },
    ];

    const results = [];

    for (const pattern of patterns) {
      try {
        const response = await fetch(pattern.url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        });

        const text = await response.text();
        const hasData = text.length > 50 && !text.includes('404') && !text.includes('Not Found');

        results.push({
          pattern: pattern.name,
          url: pattern.url,
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          hasData,
          responseLength: text.length,
          sample: text.substring(0, 200)
        });
      } catch (error) {
        results.push({
          pattern: pattern.name,
          url: pattern.url,
          status: 'ERROR',
          error: error.message,
          success: false
        });
      }
    }

    const workingPatterns = results.filter(r => r.success && r.hasData);

    return Response.json({
      success: true,
      results,
      workingPatterns,
      recommendation: workingPatterns.length > 0 
        ? `Use pattern: ${workingPatterns[0].pattern}` 
        : 'No working patterns found - TPU API may be offline'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});