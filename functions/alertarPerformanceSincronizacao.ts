import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Verificar performance de sincronizações e criar alertas
 * Monitora taxa de erro, tempo médio, latência
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Buscar sincronizações dos últimos 24h
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);

    const sincs = await base44.entities.TPUSincronizacao.list('-data_sincronizacao', 500);
    const sincsRecentes = sincs.filter(s => new Date(s.data_sincronizacao) >= ontem);

    if (sincsRecentes.length === 0) {
      return Response.json({ alertas: [], status: 'ok' });
    }

    const alertas = [];

    // 1. Taxa de erro acima de 10%
    const erros = sincsRecentes.filter(s => s.status === 'erro').length;
    const taxaErro = (erros / sincsRecentes.length) * 100;

    if (taxaErro > 10) {
      alertas.push({
        tipo: 'taxa_erro_alta',
        severidade: 'critico',
        mensagem: `Taxa de erro acima de 10%: ${taxaErro.toFixed(1)}%`,
        valor: taxaErro,
        limite: 10
      });
    }

    // 2. Tempo médio acima de 5s
    const tempoMedio = sincsRecentes.reduce((sum, s) => sum + (s.tempo_execucao_ms || 0), 0) / sincsRecentes.length;

    if (tempoMedio > 5000) {
      alertas.push({
        tipo: 'tempo_medio_longo',
        severidade: 'aviso',
        mensagem: `Tempo médio de sincronização: ${(tempoMedio / 1000).toFixed(1)}s (limite: 5s)`,
        valor: tempoMedio,
        limite: 5000
      });
    }

    // 3. Múltiplas falhas consecutivas
    const falhasConsecutivas = verificarFalhasConsecutivas(sincsRecentes);
    if (falhasConsecutivas > 3) {
      alertas.push({
        tipo: 'falhas_consecutivas',
        severidade: 'critico',
        mensagem: `${falhasConsecutivas} sincronizações falharam consecutivamente`,
        valor: falhasConsecutivas,
        limite: 3
      });
    }

    // 4. Taxa de duplicatas anormalmente alta
    const totalDuplicatas = sincsRecentes.reduce((sum, s) => sum + (s.total_duplicatas || 0), 0);
    const taxaDuplicatas = sincsRecentes.length > 0 ? (totalDuplicatas / sincsRecentes.length) : 0;

    if (taxaDuplicatas > 100) {
      alertas.push({
        tipo: 'duplicatas_altas',
        severidade: 'aviso',
        mensagem: `Média de ${taxaDuplicatas.toFixed(0)} duplicatas por sincronização`,
        valor: taxaDuplicatas,
        limite: 100
      });
    }

    // Salvar alertas no banco
    for (const alerta of alertas) {
      try {
        await base44.entities.Analytics.create({
          user_id: 'sistema',
          event_type: 'system',
          entity_type: 'system',
          action: `ALERTA: ${alerta.tipo}`,
          timestamp: new Date().toISOString(),
          status: 'error',
          metadata: {
            alerta_tipo: alerta.tipo,
            alerta_severidade: alerta.severidade,
            alerta_mensagem: alerta.mensagem,
            alerta_valor: alerta.valor,
            alerta_limite: alerta.limite
          }
        });
      } catch (e) {
        console.warn('Erro ao registrar alerta:', e.message);
      }
    }

    // Enviar notificação se há alertas críticos
    const temAlertasCriticos = alertas.some(a => a.severidade === 'critico');
    if (temAlertasCriticos && user?.email) {
      try {
        await base44.integrations.Core.SendEmail({
          to: user.email,
          subject: '🚨 ALERTA CRÍTICO: Problemas de Performance DataJud',
          body: `
Alertas críticos detectados no sistema DataJud:

${alertas.filter(a => a.severidade === 'critico').map(a => `• ${a.mensagem}`).join('\n')}

Acesse o dashboard para mais detalhes: [URL DASHBOARD]

Severidade: CRÍTICO
Timestamp: ${new Date().toLocaleString('pt-BR')}
          `
        });
      } catch (emailError) {
        console.warn('Erro ao enviar email de alerta:', emailError.message);
      }
    }

    return Response.json({
      status: alertas.length > 0 ? 'alertas' : 'ok',
      alertas,
      metricas: {
        total_sincronizacoes: sincsRecentes.length,
        taxa_erro: taxaErro.toFixed(1) + '%',
        tempo_medio_ms: Math.round(tempoMedio),
        falhas_consecutivas: falhasConsecutivas,
        taxa_duplicatas: Math.round(taxaDuplicatas)
      }
    });
  } catch (error) {
    console.error('[alertarPerformanceSincronizacao] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Verificar falhas consecutivas
 */
function verificarFalhasConsecutivas(sincs) {
  let contador = 0;
  let maximo = 0;

  for (const sync of sincs) {
    if (sync.status === 'erro') {
      contador++;
      maximo = Math.max(maximo, contador);
    } else {
      contador = 0;
    }
  }

  return maximo;
}