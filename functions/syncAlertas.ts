import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * syncAlertas
 * 
 * Sincronização inteligente de alertas baseada em:
 * - Prazos vencendo (15 dias antes)
 * - Audiências próximas
 * - Movimentações críticas
 * - Falhas de integração
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar todos os processos
    const processos = await base44.entities.ProcessoAdvise.list();
    
    // Buscar prazos
    const prazos = await base44.entities.PrazoProcessual.list();
    
    // Buscar audi ências
    const audiencias = await base44.entities.Audiencia.list();

    let alertasCriados = 0;
    let erros = [];

    // 1. Verificar prazos vencendo
    for (const prazo of prazos) {
      try {
        if (prazo.status === 'aberto') {
          const dataVenc = new Date(prazo.dataVencimento);
          const hoje = new Date();
          const diasRestantes = Math.ceil((dataVenc - hoje) / (1000 * 60 * 60 * 24));

          // Criar alerta se faltam 15 dias ou menos
          if (diasRestantes <= 15 && diasRestantes > 0) {
            const alertaExiste = await base44.entities.Alerta.filter({
              numeroProcesso: prazo.numeroProcesso,
              tipo: 'prazo',
              resolvido: false
            });

            if (!alertaExiste || alertaExiste.length === 0) {
              await base44.entities.Alerta.create({
                titulo: `Prazo vencendo em ${diasRestantes} dias`,
                descricao: `${prazo.descricao} - ${prazo.tipo}`,
                tipo: 'prazo',
                severidade: diasRestantes <= 5 ? 'critica' : diasRestantes <= 10 ? 'alta' : 'media',
                numeroProcesso: prazo.numeroProcesso,
                idProcessoAdvise: prazo.idProcessoAdvise,
                dataVencimento: prazo.dataVencimento,
                dataOcorrencia: new Date().toISOString(),
                lido: false,
                resolvido: false,
                usuarioResponsavel: user.email,
                tagsAlerta: ['prazo', 'automatico'],
                acoesSugeridas: [
                  'Verificar documentação necessária',
                  'Coordenar com equipe jurídica',
                  'Preparar recursos'
                ],
                notificacaoEnviada: false,
                canalNotificacao: ['email', 'in_app']
              });
              alertasCriados++;
            }
          }

          // Alertar se vencido
          if (diasRestantes < 0) {
            const alertaVencido = await base44.entities.Alerta.filter({
              numeroProcesso: prazo.numeroProcesso,
              tipo: 'prazo',
              resolvido: false
            });

            if (!alertaVencido || alertaVencido.length === 0) {
              await base44.entities.Alerta.create({
                titulo: `⚠️ PRAZO VENCIDO`,
                descricao: `${prazo.descricao} - Vencimento: ${new Date(prazo.dataVencimento).toLocaleDateString('pt-BR')}`,
                tipo: 'prazo',
                severidade: 'critica',
                numeroProcesso: prazo.numeroProcesso,
                idProcessoAdvise: prazo.idProcessoAdvise,
                dataVencimento: prazo.dataVencimento,
                dataOcorrencia: new Date().toISOString(),
                lido: false,
                resolvido: false,
                usuarioResponsavel: user.email,
                tagsAlerta: ['prazo', 'vencido', 'critico'],
                acoesSugeridas: [
                  'URGENTE: Contatar tribunal',
                  'Verificar possibilidade de prorrogação',
                  'Documentar comunicação'
                ],
                notificacaoEnviada: false,
                canalNotificacao: ['email', 'push', 'in_app']
              });
              alertasCriados++;
            }
          }
        }
      } catch (err) {
        erros.push(`Erro ao processar prazo ${prazo.id}: ${err.message}`);
      }
    }

    // 2. Verificar audiências próximas
    for (const audiencia of audiencias) {
      try {
        const dataAud = new Date(audiencia.dataAudiencia);
        const hoje = new Date();
        const diasRestantes = Math.ceil((dataAud - hoje) / (1000 * 60 * 60 * 24));

        // Alerta de audiência em 7 dias
        if (diasRestantes <= 7 && diasRestantes > 0) {
          const alertaExiste = await base44.entities.Alerta.filter({
            numeroProcesso: audiencia.numeroProcesso,
            tipo: 'audiencia',
            resolvido: false
          });

          if (!alertaExiste || alertaExiste.length === 0) {
            await base44.entities.Alerta.create({
              titulo: `Audiência em ${diasRestantes} dias`,
              descricao: `${audiencia.tipo} - ${audiencia.juiz || 'Juiz a ser designado'} - Sala ${audiencia.sala || 'TBD'}`,
              tipo: 'audiencia',
              severidade: diasRestantes <= 3 ? 'alta' : 'media',
              numeroProcesso: audiencia.numeroProcesso,
              idProcessoAdvise: audiencia.idProcessoAdvise,
              dataVencimento: audiencia.dataAudiencia,
              dataOcorrencia: new Date().toISOString(),
              lido: false,
              resolvido: false,
              usuarioResponsavel: user.email,
              tagsAlerta: ['audiencia', 'automatico'],
              acoesSugeridas: [
                'Preparar argumentação',
                'Revisar processo',
                'Confirmar comparecimento'
              ],
              notificacaoEnviada: false,
              canalNotificacao: ['email', 'in_app']
            });
            alertasCriados++;
          }
        }
      } catch (err) {
        erros.push(`Erro ao processar audiência ${audiencia.id}: ${err.message}`);
      }
    }

    // 3. Sincronizar alertas do Advise (se houver integração)
    let alertasAdvise = 0;
    try {
      // Buscar alertas pendentes via integração (quando implementado)
      // const responseAlertas = await consultarAlertasAdvise();
      // alertasAdvise = responseAlertas.length;
    } catch (err) {
      erros.push(`Erro ao sincronizar alertas do Advise: ${err.message}`);
    }

    return Response.json({
      success: true,
      data: {
        alertasCriados,
        alertasAdvise,
        erros,
        timestamp: new Date().toISOString(),
        usuario: user.email
      }
    });
  } catch (error) {
    console.error('Erro em syncAlertas:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});