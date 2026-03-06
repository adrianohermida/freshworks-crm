import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { valor_necessario = 0, tipo_consulta = 'pj' } = await req.json();

    // 1. Encontrar usuário (consultor ou cliente)
    const consultor = await base44.asServiceRole.entities.Consultor.filter({
      email: user.email
    }, 'created_date', 1).then(r => r[0] || null);

    const cliente = await base44.asServiceRole.entities.Cliente.filter({
      email: user.email
    }, 'created_date', 1).then(r => r[0] || null);

    const usuarioAtual = consultor || cliente;

    if (!usuarioAtual) {
      return Response.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // 2. Obter saldo atual
    const saldoAtual = usuarioAtual.creditos_api_saldo || 0;

    // 3. Custo padrão baseado em tipo
    const custo_padrao = tipo_consulta === 'pf' ? 0.36 : 0.16;
    const custoBuscado = valor_necessario > 0 ? valor_necessario : custo_padrao;

    // 4. Validar disponibilidade
    const temCreditos = saldoAtual >= custoBuscado;
    const deficit = temCreditos ? 0 : custoBuscado - saldoAtual;

    return Response.json({
      sucesso: true,
      saldo_atual: saldoAtual,
      valor_necessario: custoBuscado,
      tem_creditos: temCreditos,
      deficit: deficit,
      usuario_tipo: consultor ? 'Consultor' : 'Cliente',
      plano: usuarioAtual.plano_ativo || 'base',
      consumo_total: usuarioAtual.creditos_api_consumidos || 0
    });
  } catch (error) {
    console.error('Erro em validarCreditoDisponivel:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});