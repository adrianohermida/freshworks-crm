import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseApiUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const { paginaAtual = 1, registrosPorPagina = 50, filtroStatus = 'ativo' } = await req.json();

    // GET /usuarios - listar usuários do sistema
    let url = `${adviseApiUrl}/usuarios?page=${paginaAtual}&pageSize=${registrosPorPagina}`;
    if (filtroStatus) {
      url += `&status=${filtroStatus}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const data = await response.json();
    const usuarios = data.usuarios || data.data || [];

    // Sincronizar com banco de dados (Advogado entity)
    for (const usr of usuarios) {
      const existente = await base44.entities.Advogado.filter({
        oab: usr.oab
      });

      if (existente.length === 0) {
        await base44.entities.Advogado.create({
          nome: usr.nome || usr.nomeCompleto,
          oab: usr.oab,
          email: usr.email || '',
          telefone: usr.telefone || '',
          especialidade: usr.especialidades || [],
          ativo: usr.ativo !== false,
          processos: []
        });
      } else {
        await base44.entities.Advogado.update(existente[0].id, {
          email: usr.email || '',
          telefone: usr.telefone || '',
          especialidade: usr.especialidades || [],
          ativo: usr.ativo !== false
        });
      }
    }

    return Response.json({
      success: true,
      action: 'usuarios.listar',
      data: {
        usuarios: usuarios,
        totalUsuarios: usuarios.length,
        filtro: {
          status: filtroStatus
        },
        paginacao: {
          paginaAtual,
          registrosPorPagina,
          total: data.total || usuarios.length
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});