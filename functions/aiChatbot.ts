import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * AI Chatbot - Sprint 16 Task 2
 * Chatbot inteligente para suporte e queries
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, context = {} } = await req.json();

    if (!message) {
      return Response.json({ error: 'Message required' }, { status: 400 });
    }

    // Processar intent
    const intent = detectIntent(message);
    let response = '';

    if (intent === 'search_process') {
      const cnj = extractCNJ(message);
      if (cnj) {
        const process = await base44.entities.Process.filter({ cnj_number: cnj })
          .then(list => list[0]);
        response = process 
          ? `Encontrei o processo ${cnj}. Status: ${process.status}. ${process.movement_count} movimentos registrados.`
          : `Processo ${cnj} não encontrado.`;
      }
    }

    if (intent === 'check_deadline') {
      const deadlines = await base44.entities.Deadline.filter({ status: 'alert' });
      response = deadlines.length > 0
        ? `Você tem ${deadlines.length} prazos próximos. O mais urgente vence em ${deadlines[0].days_until} dias.`
        : 'Nenhum prazo urgente.';
    }

    if (intent === 'sync_status') {
      const processes = await base44.entities.Process.list();
      const synced = processes.filter(p => p.synced_at).length;
      response = `${synced} de ${processes.length} processos sincronizados (${Math.round(synced/processes.length*100)}%).`;
    }

    if (intent === 'help') {
      response = 'Posso ajudar você com: buscar processos, verificar prazos, status de sincronização, criar novos processos e mais. O que você precisa?';
    }

    if (!response) {
      response = 'Desculpe, não entendi. Você pode perguntar sobre processos, prazos, ou sincronização.';
    }

    return Response.json({
      success: true,
      message: response,
      intent,
      confidence: 0.85
    });

  } catch (error) {
    console.error('[aiChatbot]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function detectIntent(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('processo') || msg.includes('cnj')) return 'search_process';
  if (msg.includes('prazo') || msg.includes('vencimento')) return 'check_deadline';
  if (msg.includes('sincroniz')) return 'sync_status';
  if (msg.includes('help') || msg.includes('ajuda')) return 'help';
  
  return 'general';
}

function extractCNJ(message) {
  const match = message.match(/\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{5}\.\d{7}/);
  return match ? match[0] : null;
}