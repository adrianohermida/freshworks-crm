import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Validação RLS (Row Level Security) para Clientes
 * Verifica se usuário só acessa seus próprios dados
 * Uso: Chamar no início de qualquer função que acessa dados do Cliente
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST only' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cliente_email, cliente_id } = body;

    // RLS: Admin pode acessar todos, User só seus dados
    if (user.role === 'admin') {
      return Response.json({ 
        autorizado: true, 
        acesso: 'admin',
        email: user.email 
      });
    }

    // Para clientes/consultores: Validar que é o próprio email
    if (user.email !== cliente_email && !user.email.includes('@admin')) {
      return Response.json({ 
        error: 'Acesso negado: Você só pode acessar seus próprios dados',
        autorizado: false 
      }, { status: 403 });
    }

    // Validar que cliente_id corresponde ao email
    const cliente = await base44.asServiceRole.entities.Cliente?.read?.(cliente_id);
    if (!cliente || cliente.user_email !== user.email) {
      return Response.json({ 
        error: 'Cliente não encontrado ou não pertence a você',
        autorizado: false 
      }, { status: 404 });
    }

    return Response.json({ 
      autorizado: true,
      acesso: 'user',
      email: user.email,
      cliente_id: cliente_id
    });
  } catch (error) {
    console.error('Erro em validarAcessoCliente:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});