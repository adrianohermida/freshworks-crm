import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Integração Escavador - Processa webhook com dados do processo
 * Mapeia contatos e salva no banco Base44
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const payload = await req.json();
    const { escavadorData, clientePolo, numeroProcesso } = payload;

    if (!escavadorData || !clientePolo) {
      return Response.json(
        { error: 'escavadorData e clientePolo são obrigatórios' },
        { status: 400 }
      );
    }

    // Mapear contatos
    const contatos = mapearContatos(escavadorData, clientePolo);
    console.log('[Integração] Mapeados', contatos.length, 'contatos');

    // Salvar contatos no ProcessoAdvise
    if (numeroProcesso) {
      try {
        await base44.entities.ProcessoAdvise.update(numeroProcesso, {
          partesProcesso: contatos.map(c => ({
            nome: c.nome,
            tipo: c.tipo,
            qualidade: c.tipo
          }))
        });
        console.log('[Integração] ProcessoAdvise atualizado');
      } catch (err) {
        console.warn('[Integração] Falha ao atualizar ProcessoAdvise:', err.message);
      }
    }

    return Response.json({
      success: true,
      processo: numeroProcesso,
      contatosEncontrados: contatos.length,
      contatos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na integração:', error.message);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});

/**
 * Mapeia contatos do Escavador
 * Identifica cliente vs envolvidos
 */
function mapearContatos(data, clientePolo) {
  const clienteNome = (clientePolo || '').trim().toUpperCase();
  if (!clienteNome) throw new Error('Nome do cliente não informado');

  // Extrai movimentações
  const movimentacoes = findMovimentacoes(data);
  const nomesMap = new Map();

  for (const mov of movimentacoes) {
    for (const pessoa of mov.envolvidos_resumo || []) {
      const nome = (pessoa.nome_sem_filtro || pessoa.nome || '').trim();
      if (!nome) continue;

      const nomeUpper = nome.toUpperCase();
      if (nomesMap.has(nomeUpper)) continue;

      const tipo = nomeUpper === clienteNome ? 'cliente' : 'envolvido';

      nomesMap.set(nomeUpper, {
        nome,
        tipo,
        oab: pessoa.oab || '',
        cpf: pessoa.cpf || null,
        cnpj: pessoa.cnpj || null,
        linkApi: pessoa.link_api || ''
      });
    }
  }

  return Array.from(nomesMap.values());
}

/**
 * Localiza movimentações recursivamente
 */
function findMovimentacoes(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) {
    for (const el of obj) {
      const found = findMovimentacoes(el);
      if (found.length) return found;
    }
  } else if (typeof obj === 'object') {
    if (obj.ultimas_movimentacoes_resumo) {
      return obj.ultimas_movimentacoes_resumo;
    }
    for (const key of Object.keys(obj)) {
      const found = findMovimentacoes(obj[key]);
      if (found.length) return found;
    }
  }
  return [];
}