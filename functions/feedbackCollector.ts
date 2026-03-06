import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * User Feedback Collection & Analysis
 * Coleta feedback de usuários em tempo real pós-launch
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, feedback_text, feedback_type, feature } = await req.json();

    if (action === 'submit') {
      // Salvar feedback
      const feedbackRecord = {
        user_id: user.email,
        text: feedback_text,
        type: feedback_type || 'neutral', // positive, neutral, negative
        feature: feature || 'general',
        timestamp: new Date().toISOString(),
        helpful_count: 0,
        status: 'new'
      };

      // Salvar em Analytics
      try {
        await base44.asServiceRole.entities.Analytics.create({
          user_id: user.email,
          event_type: 'user_feedback',
          entity_type: 'feedback',
          action: `Feedback: ${feedback_type}`,
          timestamp: new Date().toISOString(),
          metadata: feedbackRecord,
          status: 'success'
        });
      } catch (err) {
        console.error('[Feedback Save Error]', err);
      }

      // Análise de sentiment básica
      const sentiment = analyzeSentiment(feedback_text);

      return Response.json({
        success: true,
        feedback_id: `fb_${Date.now()}`,
        message: 'Obrigado pelo feedback! Sua opinião é muito importante.',
        sentiment_score: sentiment
      });
    } 
    else if (action === 'list_feedback') {
      // Listar feedback (admin only)
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }

      const feedback = await base44.asServiceRole.entities.Analytics.filter(
        { event_type: 'user_feedback' },
        '-timestamp',
        100
      );

      const grouped = {
        positive: 0,
        neutral: 0,
        negative: 0
      };

      feedback.forEach(f => {
        const type = f.metadata?.type || 'neutral';
        grouped[type]++;
      });

      return Response.json({
        total: feedback.length,
        sentiment_breakdown: grouped,
        sentiment_ratio: {
          positive: (grouped.positive / feedback.length * 100).toFixed(1) + '%',
          neutral: (grouped.neutral / feedback.length * 100).toFixed(1) + '%',
          negative: (grouped.negative / feedback.length * 100).toFixed(1) + '%'
        },
        recent_feedback: feedback.slice(0, 10).map(f => ({
          text: f.metadata?.text,
          type: f.metadata?.type,
          user: f.user_id,
          timestamp: f.timestamp
        }))
      });
    }
    else if (action === 'helpful') {
      // Marcar como helpful (análise de qualidade do feedback)
      return Response.json({
        success: true,
        message: 'Obrigado por avaliar o feedback!'
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[feedbackCollector]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function analyzeSentiment(text) {
  // Análise simples de sentimento baseada em palavras-chave
  const positive = ['ótimo', 'excelente', 'adorei', 'perfeito', 'amei', 'incrível', 'muito bom'];
  const negative = ['ruim', 'horrível', 'problema', 'erro', 'lento', 'confuso', 'difícil'];

  const lowerText = text.toLowerCase();
  let score = 0.5; // Neutral default

  positive.forEach(word => {
    if (lowerText.includes(word)) score += 0.1;
  });

  negative.forEach(word => {
    if (lowerText.includes(word)) score -= 0.1;
  });

  return Math.max(0, Math.min(1, score));
}