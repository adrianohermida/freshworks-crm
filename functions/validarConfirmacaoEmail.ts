import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Valida token de confirmação de email (24h de validade)
 * Marca email como confirmado no Cliente/Consultor
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST only' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const { token, email } = await req.json();

    if (!token || !email) {
      return Response.json({ error: 'Token e email obrigatórios' }, { status: 400 });
    }

    // Buscar cliente/consultor com esse token
    const clientes = await base44.asServiceRole.entities.Cliente?.filter?.({
      user_email: email,
      token_confirmacao: token,
    });

    if (!clientes || clientes.length === 0) {
      return Response.json({ error: 'Token inválido ou expirado' }, { status: 404 });
    }

    const cliente = clientes[0];

    // Verificar expiração (24h)
    const expiracaoTime = new Date(cliente.token_expiracao).getTime();
    if (expiracaoTime < Date.now()) {
      return Response.json({ error: 'Token expirado' }, { status: 410 });
    }

    // Marcar como confirmado
    await base44.asServiceRole.entities.Cliente?.update?.(cliente.id, {
      email_confirmado: true,
      token_confirmacao: null,
      token_expiracao: null,
    });

    return Response.json({ 
      success: true, 
      message: 'Email confirmado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro em validarConfirmacaoEmail:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});