import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { numeroProcesso } = await req.json();

    if (!numeroProcesso) {
      return Response.json({
        success: false,
        error: 'numeroProcesso é obrigatório'
      }, { status: 400 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = 'https://api.advise.com.br';

    // Fetch fonte processo from Advise API
    const response = await fetch(`${adviseUrl}/core/v1/processos-clientes/consulta-fonte-processo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ numeroProcesso })
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Advise API error: ${error.message || 'Unknown error'}`
      }, { status: response.status });
    }

    const fonteData = await response.json();

    // Store in local database
    const processoAtualizado = {
      numeroProcesso,
      tribunal: fonteData.tribunal || 'Unknown',
      vara: fonteData.vara || '',
      municipio: fonteData.municipio || '',
      dataSincronizacao: new Date().toISOString()
    };

    // Update ProcessoAdvise if exists
    const processos = await base44.entities.ProcessoAdvise.filter({
      numeroProcesso
    });

    if (processos && processos.length > 0) {
      await base44.entities.ProcessoAdvise.update(processos[0].id, processoAtualizado);
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'consultaFonteProcesso',
      entidade: 'ProcessoAdvise',
      resultado: 'success',
      metadados: { numeroProcesso }
    });

    return Response.json({
      success: true,
      action: 'processos.consultaFonteProcesso',
      data: {
        numeroProcesso,
        tribunal: fonteData.tribunal,
        vara: fonteData.vara,
        municipio: fonteData.municipio,
        fonte: fonteData.fonte || 'Advise API',
        dataSincronizacao: new Date().toISOString(),
        message: `Fonte do processo ${numeroProcesso} recuperada com sucesso`
      }
    });
  } catch (error) {
    console.error('ConsultaFonteProcesso error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});