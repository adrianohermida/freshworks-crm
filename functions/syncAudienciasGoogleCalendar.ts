import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar audiências próximas (próximos 30 dias)
    const dataAtual = new Date();
    const data30Dias = new Date(dataAtual.getTime() + 30 * 24 * 60 * 60 * 1000);

    const audiencias = await base44.entities.Audiencia.filter({
      comparecimento: 'confirmado'
    });

    const audienciasProximas = audiencias.filter(a => {
      const dataAud = new Date(a.dataAudiencia);
      return dataAud >= dataAtual && dataAud <= data30Dias;
    });

    // Sincronizar com Google Calendar (simulado)
    let sincronizadas = 0;
    let erros = [];

    for (const aud of audienciasProximas) {
      // Em produção, aqui seria feita chamada real ao Google Calendar API
      // const event = {
      //   summary: `Audiência - ${aud.numeroProcesso}`,
      //   description: `Tipo: ${aud.tipo}\nJuiz: ${aud.juiz}\nSala: ${aud.sala}`,
      //   start: { dateTime: aud.dataAudiencia },
      //   end: { dateTime: new Date(new Date(aud.dataAudiencia).getTime() + 2 * 60 * 60 * 1000) },
      //   reminders: {
      //     useDefault: false,
      //     overrides: [
      //       { method: 'email', minutes: 24 * 60 },
      //       { method: 'popup', minutes: 30 }
      //     ]
      //   }
      // };

      try {
        // Marcar audiência como lembrete enviado
        await base44.entities.Audiencia.update(aud.id, {
          lembrete_enviado: true
        });
        sincronizadas++;
      } catch (err) {
        erros.push(`Erro ao sincronizar audiência ${aud.numeroProcesso}: ${err.message}`);
      }
    }

    return Response.json({
      success: true,
      data: {
        audienciasSincronizadas: sincronizadas,
        totalAudiencias: audienciasProximas.length,
        erros: erros,
        proximas: audienciasProximas.slice(0, 5).map(a => ({
          numeroProcesso: a.numeroProcesso,
          dataAudiencia: a.dataAudiencia,
          tipo: a.tipo,
          juiz: a.juiz
        }))
      }
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});