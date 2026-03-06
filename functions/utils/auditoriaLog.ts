import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

export async function registrarAuditoria(req, {
  entidade,
  entidade_id,
  acao,
  descricao,
  dados_anteriores = null,
  dados_novos = null,
  modulo,
  status = 'sucesso',
  mensagem_erro = null,
  conformidade = {}
}) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) return null;

    // Detectar mudanças
    const campos_alterados = extrairCamposAlterados(dados_anteriores, dados_novos);

    // Montar payload auditoria
    const auditLog = {
      usuario_email: user.email,
      usuario_nome: user.full_name,
      usuario_role: user.role,
      entidade,
      entidade_id,
      acao,
      descricao,
      dados_anteriores: dados_anteriores ? JSON.stringify(dados_anteriores).substring(0, 5000) : null,
      dados_novos: dados_novos ? JSON.stringify(dados_novos).substring(0, 5000) : null,
      campos_alterados: campos_alterados.length > 0 ? campos_alterados : null,
      ip_usuario: extrairIP(req),
      user_agent: req.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
      status,
      mensagem_erro,
      conformidade: {
        lgpd_compliant: true,
        direito_cancelamento: acao === 'delete',
        consentimento_documentado: true,
        ...conformidade
      },
      modulo,
      observacoes: null
    };

    // Registrar de forma assíncrona (não bloqueia resposta)
    base44.asServiceRole.entities.AuditoriaLog.create(auditLog).catch(err => {
      console.error('Erro ao registrar auditoria:', err);
    });

    return auditLog;
  } catch (error) {
    console.error('Erro em registrarAuditoria:', error);
    return null;
  }
}

function extrairCamposAlterados(anterior, novo) {
  if (!anterior || !novo) return [];

  const alteracoes = [];
  const todasAsChaves = new Set([...Object.keys(anterior || {}), ...Object.keys(novo || {})]);

  for (const campo of todasAsChaves) {
    if (JSON.stringify(anterior?.[campo]) !== JSON.stringify(novo?.[campo])) {
      alteracoes.push({
        campo,
        valor_anterior: anterior?.[campo] ?? null,
        valor_novo: novo?.[campo] ?? null
      });
    }
  }

  return alteracoes;
}

function extrairIP(req) {
  try {
    return req.headers.get('x-forwarded-for')?.split(',')[0] ||
           req.headers.get('x-real-ip') ||
           req.headers.get('cf-connecting-ip') ||
           'desconhecido';
  } catch {
    return 'desconhecido';
  }
}