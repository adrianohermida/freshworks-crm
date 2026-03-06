import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Sync diário agendado — chama syncPublicacoesBackground diretamente.
 * Usa service role (sem autenticação de usuário).
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const res = await base44.asServiceRole.functions.invoke('advise/syncPublicacoesBackground', {});

    if (res.data?.success) {
      console.log(`[DAILY-SYNC] Sucesso: ${res.data.novas} novas`);
      return Response.json({ success: true, resultado: res.data });
    }

    // Registrar falha
    await base44.asServiceRole.entities.AuditSincPublicacoes.create({
      tipoEvento: 'erro',
      dataEvento: new Date().toISOString(),
      novasImportadas: 0,
      errosEncontrados: 1,
      mensagem: `Sync diário falhou: ${res.data?.error || 'desconhecido'}`,
      tipoExecucao: 'automatica'
    });

    return Response.json({ success: false, error: res.data?.error }, { status: 500 });

  } catch (error) {
    console.error(`[DAILY-SYNC] ERRO: ${error.message}`);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});