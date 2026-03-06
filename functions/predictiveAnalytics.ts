import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Predictive Analytics Backend
 * Análise real de processos jurídicos usando dados históricos
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, process_id } = await req.json();

    switch (action) {
      case 'predict_outcome':
        if (!process_id) {
          return Response.json({ error: 'Process ID required' }, { status: 400 });
        }

        try {
          const processData = await base44.entities.Process.get(process_id);
          if (!processData) {
            return Response.json({ error: 'Process not found' }, { status: 404 });
          }

          // Buscar dados históricos similares
          const similarProcesses = await base44.entities.Process.filter({
            parsed_tribunal: processData.parsed_tribunal
          }, '-created_date', 50);

          // Calcular estatísticas baseadas em dados reais
          const successCount = similarProcesses.filter(p => 
            p.status === 'archived' || p.datajud_data?.status?.includes('Julgado')
          ).length;

          const successRate = similarProcesses.length > 0 
            ? Math.round((successCount / similarProcesses.length) * 100)
            : 50;

          // Analisar movimentos para estimar duração
          const movements = await base44.entities.AndamentoProcessual.filter({
            processo_id: process_id
          }, '-data_movimento', 100);

          const estimatedDays = movements.length > 0
            ? Math.round(movements.length * 15) // Estimativa baseada em movimentos
            : 180;

          return Response.json({
            likely_outcome: successRate > 60 ? 'favorable' : 'unfavorable',
            confidence: Math.min(0.95, 0.5 + (successRate / 200)), // 50-95% confiança
            estimated_duration_days: estimatedDays,
            risk_factors: getRiskFactors(processData, movements),
            similar_cases: similarProcesses.length,
            success_rate_similar: successRate
          });
        } catch (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getRiskFactors(processData, movements) {
  const factors = [];

  // Verificar atrasos
  if (movements.length > 0) {
    const lastMovement = new Date(movements[0].data_movimento);
    const daysSinceLastMovement = Math.floor((Date.now() - lastMovement.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastMovement > 30) {
      factors.push('Movimento não atualizado há mais de 30 dias');
    }
  }

  // Verificar tribunal
  if (processData.parsed_tribunal && processData.parsed_tribunal.includes('superior')) {
    factors.push('Processo em instância superior');
  }

  // Verificar número de movimentos
  if (movements.length < 5) {
    factors.push('Poucos movimentos registrados');
  }

  return factors.length > 0 ? factors : ['Sem fatores de risco identificados'];
}