import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = 'https://api.advise.com.br';

    // Fetch fontes de intimações from Advise API
    const response = await fetch(`${adviseUrl}/core/v1/intimacao/ConsultaFonteIntimacoes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = 'Unknown error';
      try {
        const error = JSON.parse(errorText);
        errorMsg = error.message || errorText;
      } catch (e) {
        errorMsg = errorText || `HTTP ${response.status}`;
      }
      return Response.json({
        success: false,
        error: `Advise API error: ${errorMsg}`
      }, { status: response.status });
    }

    const responseText = await response.text();
    if (!responseText) {
      return Response.json({
        success: true,
        data: { fontes: [], totalFontes: 0, dataSincronizacao: new Date().toISOString() }
      });
    }

    let fontes;
    try {
      fontes = JSON.parse(responseText);
    } catch (e) {
      console.error(`JSON Parse error: ${e.message}`);
      return Response.json({
        success: false,
        error: 'Invalid JSON response from API'
      }, { status: 500 });
    }

    // Sync fontes to local database
    const fontesIntimacao = [];
    for (const fonte of (Array.isArray(fontes) ? fontes : fontes.data || [])) {
      const localFonte = {
        idFonte: fonte.id || fonte.idFonte,
        nomeFonte: fonte.nome || fonte.nomeFonte,
        descricao: fonte.descricao || '',
        ativa: fonte.ativa !== false,
        ultimaSincronizacao: new Date().toISOString(),
        erroUltimo: null
      };

      try {
        // Try to find existing
        const existing = await base44.entities.FonteIntimacao.filter({
          idFonte: localFonte.idFonte
        });

        if (existing && existing.length > 0) {
          await base44.entities.FonteIntimacao.update(existing[0].id, localFonte);
        } else {
          await base44.entities.FonteIntimacao.create(localFonte);
        }
        fontesIntimacao.push(localFonte);
      } catch (syncError) {
        console.error(`Error syncing fonte ${localFonte.idFonte}:`, syncError);
        localFonte.erroUltimo = syncError.message;
      }
    }

    // Log audit
    await base44.functions.invoke('security/auditLog', {
      acao: 'consultaFonteIntimacoes',
      entidade: 'FonteIntimacao',
      resultado: 'success',
      metadados: { fontesCount: fontesIntimacao.length }
    });

    return Response.json({
      success: true,
      action: 'intimacao.consultarFontes',
      data: {
        fontes: fontesIntimacao,
        totalFontes: fontesIntimacao.length,
        dataSincronizacao: new Date().toISOString(),
        message: `${fontesIntimacao.length} fontes de intimação sincronizadas com sucesso`
      }
    });
  } catch (error) {
    console.error('ConsultaFonteIntimacoes error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});