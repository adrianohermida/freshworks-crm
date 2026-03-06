import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function getDaysUntilDeadline(deadlineDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const deadline = new Date(deadlineDate);
  deadline.setHours(0, 0, 0, 0);
  
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('pt-BR', options);
}

function generateEmailContent(tarefa, diasRestantes) {
  const statusColor = diasRestantes <= 3 ? '#d32f2f' : diasRestantes <= 7 ? '#f57c00' : '#388e3c';
  const statusTexto = diasRestantes < 0 ? 'PRAZO EXPIRADO' : `${diasRestantes} dias restantes`;

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1976d2;">Lembrete de Prazo - Processo ${tarefa.numeroProcesso}</h2>
          
          <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid ${statusColor}; margin: 20px 0;">
            <p style="margin: 0; color: ${statusColor}; font-weight: bold;">Status: ${statusTexto}</p>
          </div>

          <p><strong>Número do Processo:</strong> ${tarefa.numeroProcesso}</p>
          <p><strong>Descrição:</strong> ${tarefa.descricao || 'Não informada'}</p>
          
          <p><strong>Data do Prazo:</strong> ${formatDate(tarefa.dataPrazo)}</p>
          <p><strong>Publicação:</strong> ${formatDate(tarefa.dataPublicacao)}</p>
          <p><strong>Dias Úteis:</strong> ${tarefa.diasUteis}</p>

          ${tarefa.metadados?.municipio ? `<p><strong>Município/Comarca:</strong> ${tarefa.metadados.municipio}</p>` : ''}
          ${tarefa.metadados?.vara ? `<p><strong>Vara:</strong> ${tarefa.metadados.vara}</p>` : ''}

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="font-size: 12px; color: #666;">
            Este é um lembrete automático gerado pelo sistema de integração com Advise.
            Acesse sua conta para mais detalhes sobre a tarefa.
          </p>
        </div>
      </body>
    </html>
  `;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base48.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Busca tarefas que precisam de lembrete
    const tarefas = await base44.entities.TarefaAgendada.filter({
      status: { $in: ['criada', 'sincronizada'] }
    });

    const emailsEnviados = [];

    for (const tarefa of tarefas) {
      try {
        const diasRestantes = getDaysUntilDeadline(tarefa.dataPrazo);
        
        // Envia email se estiver próximo do prazo (3, 1 dia antes ou atrasado)
        if (diasRestantes <= 3 && diasRestantes >= -5) {
          const emailContent = generateEmailContent(tarefa, diasRestantes);

          // Atualiza status se atrasado
          if (diasRestantes < 0) {
            await base44.entities.TarefaAgendada.update(tarefa.id, {
              status: 'atrasada',
              diasAteAtraso: diasRestantes
            });
          }

          // Envia email via integração Core
          await base44.integrations.Core.SendEmail({
            to: tarefa.emailDestino || user.email,
            subject: `⏰ Lembrete: Prazo ${diasRestantes < 0 ? 'EXPIRADO' : 'próximo'} - ${tarefa.numeroProcesso}`,
            body: emailContent,
            from_name: 'Sistema de Prazos'
          });

          // Atualiza data de envio
          await base44.entities.TarefaAgendada.update(tarefa.id, {
            dataEnvioEmail: new Date().toISOString(),
            diasAteAtraso: diasRestantes
          });

          emailsEnviados.push({
            tarefaId: tarefa.id,
            processo: tarefa.numeroProcesso,
            diasRestantes: diasRestantes
          });
        }
      } catch (error) {
        console.error(`Erro ao enviar email para tarefa ${tarefa.id}:`, error.message);
      }
    }

    return Response.json({
      success: true,
      message: 'Lembretes processados',
      emailsEnviados: emailsEnviados.length,
      detalhes: emailsEnviados,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no envio de lembretes:', error);
    return Response.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});