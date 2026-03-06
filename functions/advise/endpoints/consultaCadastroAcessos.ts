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

    // Fetch acessos from Advise API
    const response = await fetch(`${adviseUrl}/core/v1/intimacao/ConsultaCadastroAcessos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Advise API error: ${error.message || 'Unknown error'}`
      }, { status: response.status });
    }

    const acessosAdvise = await response.json();

    // Sync local database
    const acessosCadastrados = [];
    for (const acesso of (Array.isArray(acessosAdvise) ? acessosAdvise : acessosAdvise.data || [])) {
      const acessoLocal = {
        nomeResponsavel: acesso.nomeResponsavel || 'Unknown',
        idFonteXTipoPesquisa: acesso.idFonteXTipoPesquisa,
        nomeFonte: acesso.nomeFonte,
        dadoAcesso: acesso.dadoAcesso,
        ativa: acesso.ativa !== false,
        dataCadastro: acesso.dataCadastro || new Date().toISOString(),
        ultimaSincronizacao: new Date().toISOString(),
        usuarioCadastro: acesso.usuarioCadastro || 'system',
        idAdvise: acesso.id || acesso.idAdvise,
        status: acesso.ativa ? 'ativo' : 'inativo'
      };

      try {
        const existing = await base44.entities.ConfigIntimacao.filter({
          idAdvise: acessoLocal.idAdvise
        });

        if (existing && existing.length > 0) {
          await base44.entities.ConfigIntimacao.update(existing[0].id, acessoLocal);
        } else {
          await base44.entities.ConfigIntimacao.create(acessoLocal);
        }
        acessosCadastrados.push(acessoLocal);
      } catch (syncError) {
        console.error(`Error syncing acesso ${acessoLocal.idAdvise}:`, syncError);
      }
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'consultaCadastroAcessos',
      entidade: 'ConfigIntimacao',
      resultado: 'success',
      metadados: { acessosCount: acessosCadastrados.length }
    });

    return Response.json({
      success: true,
      action: 'intimacao.consultaCadastroAcessos',
      data: {
        acessos: acessosCadastrados,
        totalAcessos: acessosCadastrados.length,
        dataSincronizacao: new Date().toISOString(),
        acessosAtivos: acessosCadastrados.filter(a => a.ativa).length,
        message: `${acessosCadastrados.length} acessos de intimação recuperados`
      }
    });
  } catch (error) {
    console.error('ConsultaCadastroAcessos error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});