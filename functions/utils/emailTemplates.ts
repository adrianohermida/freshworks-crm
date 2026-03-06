/**
 * Templates de Email customizados para DataJud
 */

export const templates = {
  /**
   * Alerta de falha de sincronização
   */
  falhaSincronizacao: (processo_id, erro) => ({
    subject: `🚨 Falha na Sincronização: ${processo_id}`,
    body: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    .alert-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
    .footer { background: #f3f4f6; padding: 10px; font-size: 12px; color: #666; text-align: center; }
    .btn { display: inline-block; background: #0891b2; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">⚠️ Falha na Sincronização</h1>
    </div>
    <div class="content">
      <p>Olá,</p>
      <p>Ocorreu um erro durante a sincronização do processo <strong>${processo_id}</strong>.</p>
      
      <div class="alert-box">
        <strong>Erro:</strong><br>
        ${erro}
      </div>

      <h3>O que fazer?</h3>
      <ul>
        <li>Verifique se o número CNJ está correto</li>
        <li>Tente sincronizar novamente no painel TPU</li>
        <li>Se o erro persistir, entre em contato com o suporte</li>
      </ul>

      <a href="[DASHBOARD_URL]" class="btn">Acessar Dashboard</a>

      <p style="color: #666; font-size: 14px;">
        Timestamp: ${new Date().toLocaleString('pt-BR')}<br>
        Processo: ${processo_id}
      </p>
    </div>
    <div class="footer">
      <p>© 2026 DataJud • Sistema de Integração CNJ</p>
    </div>
  </div>
</body>
</html>
    `
  }),

  /**
   * Alerta crítico de performance
   */
  alertaCritico: (mensagens, metricas) => ({
    subject: '🚨 ALERTA CRÍTICO: Problemas de Performance DataJud',
    body: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #991b1b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .alerta { background: #fecaca; border-left: 4px solid #991b1b; padding: 12px; margin: 10px 0; }
    .metricas { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .metrica { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .footer { background: #f3f4f6; padding: 10px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🚨 ALERTA CRÍTICO - AÇÃO REQUERIDA</h1>
    </div>
    <div style="background: #f9fafb; padding: 20px;">
      <p>Olá,</p>
      <p>Problemas críticos foram detectados no sistema DataJud. Ação imediata é recomendada.</p>

      <h3 style="color: #991b1b;">Alertas Críticos:</h3>
      ${mensagens.map(msg => `<div class="alerta"><strong>⚠️</strong> ${msg}</div>`).join('')}

      <h3>Métricas do Sistema (últimas 24h):</h3>
      <div class="metricas">
        ${Object.entries(metricas).map(([chave, valor]) => `
          <div class="metrica">
            <span><strong>${chave}:</strong></span>
            <span style="color: #0891b2;">${valor}</span>
          </div>
        `).join('')}
      </div>

      <p style="color: #666; font-size: 14px;">
        <strong>Ações Recomendadas:</strong><br>
        1. Acesse o dashboard para revisar os logs<br>
        2. Verifique a disponibilidade da API DataJud<br>
        3. Considere pausar sincronizações automáticas se necessário<br>
        4. Entre em contato com o suporte se o problema persistir
      </p>
    </div>
    <div class="footer">
      <p>© 2026 DataJud • Sistema de Integração CNJ</p>
      <p>Timestamp: ${new Date().toLocaleString('pt-BR')}</p>
    </div>
  </div>
</body>
</html>
    `
  }),

  /**
   * Resumo de sincronização bem-sucedida
   */
  resumoSincronizacao: (stats) => ({
    subject: `✅ Resumo de Sincronizações - ${new Date().toLocaleDateString('pt-BR')}`,
    body: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .stat-card { background: white; border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 6px; display: flex; justify-content: space-between; }
    .stat-value { font-size: 24px; font-weight: bold; color: #059669; }
    .footer { background: #f3f4f6; padding: 10px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✅ Resumo Diário de Sincronizações</h1>
    </div>
    <div style="background: #f9fafb; padding: 20px;">
      <p>Olá,</p>
      <p>Aqui está o resumo das sincronizações de hoje:</p>

      <div class="stat-card">
        <span>Total de Sincronizações</span>
        <span class="stat-value">${stats.total}</span>
      </div>

      <div class="stat-card">
        <span style="color: #059669;">✓ Sucessos</span>
        <span class="stat-value" style="color: #059669;">${stats.sucessos}</span>
      </div>

      <div class="stat-card">
        <span style="color: #ef4444;">✗ Erros</span>
        <span class="stat-value" style="color: #ef4444;">${stats.erros}</span>
      </div>

      <div class="stat-card">
        <span>Taxa de Sucesso</span>
        <span class="stat-value">${stats.taxa_sucesso}%</span>
      </div>

      <div class="stat-card">
        <span>Movimentos Sincronizados</span>
        <span class="stat-value">${stats.movimentos}</span>
      </div>

      <p style="color: #666; margin-top: 20px; font-size: 14px;">
        Período: ${new Date().toLocaleDateString('pt-BR')}<br>
        Sistema operando normalmente ✅
      </p>
    </div>
    <div class="footer">
      <p>© 2026 DataJud • Sistema de Integração CNJ</p>
    </div>
  </div>
</body>
</html>
    `
  })
};

/**
 * Enviar email com template
 */
export async function enviarEmailComTemplate(base44, to, templateNome, dados) {
  const template = templates[templateNome];
  if (!template) {
    throw new Error(`Template "${templateNome}" não encontrado`);
  }

  const { subject, body } = template(dados);

  return base44.integrations.Core.SendEmail({
    to,
    subject,
    body
  });
}