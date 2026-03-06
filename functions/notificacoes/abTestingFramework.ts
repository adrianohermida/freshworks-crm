import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, campanha, variantes = [], destinatarios = [] } = await req.json();

    if (!acao) {
      return Response.json({
        success: false,
        error: 'acao é obrigatória (criar, enviar, analisar)'
      }, { status: 400 });
    }

    if (acao === 'criar') {
      const { nome, descricao } = campanha;

      if (!nome || variantes.length < 2) {
        return Response.json({
          success: false,
          error: 'Nome obrigatório e mínimo 2 variantes'
        }, { status: 400 });
      }

      const abCampanha = {
        nome,
        descricao,
        variantes: variantes.map((v, idx) => ({
          id: `var_${idx}`,
          nome: v.nome,
          templateId: v.templateId,
          descricao: v.descricao,
          peso: v.peso || (100 / variantes.length)
        })),
        status: 'criada',
        dataCriacao: new Date().toISOString(),
        criadoPor: user.email,
        metricas: {
          envios: 0,
          aberturas: 0,
          cliques: 0,
          conversoes: 0
        }
      };

      const created = await base44.entities.AbTestCampanha?.create(abCampanha);

      return Response.json({
        success: true,
        action: 'notificacoes.abTestingFramework',
        data: {
          acao: 'criar',
          campanhaId: created?.id,
          nome,
          variantes: variantes.length,
          status: 'criada',
          message: `Campanha A/B "${nome}" criada com ${variantes.length} variantes`
        }
      });
    } else if (acao === 'enviar') {
      const { campanhaId } = campanha;

      if (!campanhaId) {
        return Response.json({
          success: false,
          error: 'campanhaId é obrigatório'
        }, { status: 400 });
      }

      // Get campaign
      const campanhas = await base44.entities.AbTestCampanha?.filter({ id: campanhaId });
      if (!campanhas || campanhas.length === 0) {
        return Response.json({
          success: false,
          error: 'Campanha não encontrada'
        }, { status: 404 });
      }

      const camp = campanhas[0];
      let enviados = 0;
      const resultados = [];

      // Distribute recipients across variants
      for (let i = 0; i < destinatarios.length; i++) {
        const dest = destinatarios[i];
        const varianteIndex = Math.floor(Math.random() * camp.variantes.length);
        const variante = camp.variantes[varianteIndex];

        try {
          await base44.functions.invoke('notificacoes/enviarEmailTemplate', {
            templateId: variante.templateId,
            destinatario: dest,
            dados: { abTestId: campanhaId, varianteId: variante.id }
          });

          enviados++;
          resultados.push({
            destinatario: dest,
            variante: variante.nome,
            status: 'enviado'
          });
        } catch (e) {
          resultados.push({
            destinatario: dest,
            variante: variante.nome,
            status: 'erro',
            erro: e.message
          });
        }
      }

      // Update campaign metrics
      await base44.entities.AbTestCampanha?.update(campanhaId, {
        status: 'em_andamento',
        dataInicio: new Date().toISOString(),
        metricas: {
          ...camp.metricas,
          envios: camp.metricas.envios + enviados
        }
      });

      return Response.json({
        success: enviados === destinatarios.length,
        action: 'notificacoes.abTestingFramework',
        data: {
          acao: 'enviar',
          campanhaId,
          enviados,
          falhados: destinatarios.length - enviados,
          status: 'em_andamento',
          message: `${enviados}/${destinatarios.length} emails da campanha A/B enviados`
        }
      });
    } else if (acao === 'analisar') {
      const { campanhaId } = campanha;

      const campanhas = await base44.entities.AbTestCampanha?.filter({ id: campanhaId });
      if (!campanhas || campanhas.length === 0) {
        return Response.json({
          success: false,
          error: 'Campanha não encontrada'
        }, { status: 404 });
      }

      const camp = campanhas[0];
      const metricas = camp.metricas;

      // Calculate performance
      const taxaAbertura = metricas.envios > 0 ? ((metricas.aberturas / metricas.envios) * 100).toFixed(2) : 0;
      const taxaClique = metricas.aberturas > 0 ? ((metricas.cliques / metricas.aberturas) * 100).toFixed(2) : 0;
      const taxaConversao = metricas.envios > 0 ? ((metricas.conversoes / metricas.envios) * 100).toFixed(2) : 0;

      return Response.json({
        success: true,
        action: 'notificacoes.abTestingFramework',
        data: {
          acao: 'analisar',
          campanhaId,
          nome: camp.nome,
          status: camp.status,
          metricas: {
            envios: metricas.envios,
            aberturas: metricas.aberturas,
            cliques: metricas.cliques,
            conversoes: metricas.conversoes
          },
          taxas: {
            abertura: `${taxaAbertura}%`,
            clique: `${taxaClique}%`,
            conversao: `${taxaConversao}%`
          },
          vencedora: camp.variantes[0]?.nome || 'Em análise',
          recomendacao: 'Continue monitorando por mais 48h para resultado conclusivo'
        }
      });
    }

    return Response.json({
      success: false,
      error: 'Ação inválida'
    }, { status: 400 });
  } catch (error) {
    console.error('AbTestingFramework error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});