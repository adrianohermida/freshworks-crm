import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * validarSigilosidadeCompliance.ts - Valida sigilo e compliance LGPD/CNJ
 * 
 * Fluxo:
 * 1. Verificar nivelSigilo do processo
 * 2. Se sigiloso, validar permissões do usuário
 * 3. Se CPF/CNPJ, mascarar automaticamente
 * 4. Registrar acesso em auditoria
 * 5. Retornar dados (mascarados se necessário)
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { processoCEJUSCId, processoCEJUSCNumero, tipoAcesso = 'leitura' } = await req.json();

    if (!processoCEJUSCId && !processoCEJUSCNumero) {
      return Response.json({ error: 'processoCEJUSCId ou processoCEJUSCNumero obrigatório' }, { status: 400 });
    }

    // ─── 1. Buscar processo ──────────────────────────────────────────

    let processo;

    if (processoCEJUSCId) {
      processo = await base44.asServiceRole.entities.ProcessoCEJUSC.filter(
        { id: processoCEJUSCId },
        null,
        1
      );
    } else {
      processo = await base44.asServiceRole.entities.ProcessoCEJUSC.filter(
        { numero_processo: processoCEJUSCNumero },
        null,
        1
      );
    }

    if (!processo || processo.length === 0) {
      return Response.json({ error: 'Processo não encontrado' }, { status: 404 });
    }

    const p = processo[0];

    // ─── 2. Validar sigilo ──────────────────────────────────────────

    const nivelSigilo = p.nivel_sigilo || 0;
    let permissaoNegada = false;
    let motivoNegacao = '';

    if (nivelSigilo > 0) {
      // Verificar se usuário tem permissão
      const podeAcessarSigiloso = await validarPermissaoSigilo(
        base44,
        user,
        p,
        tipoAcesso
      );

      if (!podeAcessarSigiloso) {
        permissaoNegada = true;
        motivoNegacao = `Acesso negado: Nível de sigilo ${nivelSigilo} não autorizado para ${tipoAcesso}`;
      }
    }

    // ─── 3. Registrar acesso em auditoria ────────────────────────────

    try {
      await base44.asServiceRole.entities.AuditoriaCNJ.create({
        processo_id: p.id,
        usuario_email: user.email,
        tipo_acesso: tipoAcesso,
        nivel_sigilo: nivelSigilo,
        data_acesso: new Date().toISOString(),
        permissao_concedida: !permissaoNegada,
        motivo_negacao: motivoNegacao,
        ip_origem: req.headers.get('x-forwarded-for') || 'desconhecido'
      });
    } catch (err) {
      console.warn('[Compliance] Erro ao registrar auditoria:', err.message);
    }

    // ─── 4. Se negado, retornar erro ─────────────────────────────────

    if (permissaoNegada) {
      return Response.json({
        status: 'acesso_negado',
        motivo: motivoNegacao,
        nivel_sigilo: nivelSigilo
      }, { status: 403 });
    }

    // ─── 5. Mascarar dados sensíveis ─────────────────────────────────

    const dadosMascarados = mascararDadosSensiveis(p);

    return Response.json({
      status: 'acesso_autorizado',
      processo: dadosMascarados,
      nivel_sigilo: nivelSigilo,
      usuario_email: user.email
    });

  } catch (error) {
    console.error('[validarSigilosidadeCompliance]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Validar se usuário pode acessar dados sigilosos
 */
async function validarPermissaoSigilo(
  base44: any,
  user: any,
  processo: any,
  tipoAcesso: string
): Promise<boolean> {
  // Admin sempre pode
  if (user.role === 'admin') return true;

  // Consultor responsável pode ler/editar
  if (tipoAcesso === 'leitura' || tipoAcesso === 'edicao') {
    if (processo.consultor_responsavel_email === user.email) {
      return true;
    }
  }

  // Cliente pode apenas ler seu próprio processo
  if (tipoAcesso === 'leitura' && user.role === 'user') {
    const cliente = await base44.asServiceRole.entities.Cliente.filter(
      { usuario_email: user.email }
    );
    if (cliente && cliente.length > 0 && cliente[0].id === processo.cliente_id) {
      return true;
    }
  }

  return false;
}

/**
 * Mascarar CPF, CNPJ e dados sensíveis
 */
function mascararDadosSensiveis(processo: any): any {
  const mascara = { ...processo };

  // Mascarar partes (CPF/CNPJ)
  if (mascara.partes && Array.isArray(mascara.partes)) {
    mascara.partes = mascara.partes.map((parte: any) => ({
      ...parte,
      cpf_cnpj: parte.cpf_cnpj ? mascararCPFCNPJ(parte.cpf_cnpj) : null
    }));
  }

  // Mascarar credores
  if (mascara.credores_envolvidos && Array.isArray(mascara.credores_envolvidos)) {
    // Apenas retornar IDs, não nomes
    mascara.credores_envolvidos = mascara.credores_envolvidos.map(() => 'CREDOR_MASCARADO');
  }

  return mascara;
}

/**
 * Mascarar CPF/CNPJ: XXX.XXX.XXX-88 ou XX.XXX.XXX/0001-88
 */
function mascararCPFCNPJ(valor: string): string {
  if (!valor) return '';
  
  const limpo = valor.replace(/\D/g, '');
  
  if (limpo.length === 11) {
    // CPF
    return limpo.slice(0, 3) + '.XXX.XXX-' + limpo.slice(-2);
  } else if (limpo.length === 14) {
    // CNPJ
    return limpo.slice(0, 2) + '.XXX.XXX/0001-' + limpo.slice(-2);
  }
  
  return valor;
}