import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const ADVISE_BASE = () => (Deno.env.get('ADVISE_API_URL') || 'https://sandbox-api.advise.com.br').replace(/\/$/, '');

async function adviseGet(path, token, signal) {
  const response = await fetch(`${ADVISE_BASE()}${path}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    signal
  });
  if (response.status === 401) throw new Error('Token ADVISE inválido ou expirado');
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.json();
}

async function advisePut(path, token, body) {
  const response = await fetch(`${ADVISE_BASE()}${path}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json().catch(() => ({}));
}

function mapItem(item) {
  const id = String(item.id || item.idPublicacaoCliente || item.idMovProcessoCliente || '');
  return {
    idPublicacaoAdvise: id,
    numeroProcesso: item.processos?.[0]?.numeroProcesso || item.numeroProcesso || item.numero || 'N/A',
    numeroCNJ: item.numeroCNJ ?? true,
    palavrasChave: Array.isArray(item.palavrasChave)
      ? item.palavrasChave.map(p => typeof p === 'string' ? p : p.palavraChave || '')
      : [],
    dataHoraMovimento: item.dataHoraMovimento || new Date().toISOString(),
    dataPublicacao: item.dataPublicacao || new Date().toISOString(),
    conteudo: (item.conteudo || '').substring(0, 5000),
    municipio: item.cidadeComarcaDescricao || item.municipio || '',
    vara: item.varaDescricao || item.vara || '',
    diario: item.nomeDiario || item.diario || '',
    lido: item.lido || false,
    statusSincronizacao: 'importado',
    dataSincronizacao: new Date().toISOString(),
    idMovProcessoClienteAdvise: String(item.idMovProcessoCliente || '')
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Não autenticado' }, { status: 401 });

    const token = Deno.env.get('ADVISE_TOKEN');
    if (!token) return Response.json({ error: 'ADVISE_TOKEN não configurado' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const { action, params = {} } = body;

    // ── CONSULTAR ────────────────────────────────────────────────
    if (action === 'consultar') {
      const hoje = new Date();
      const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
      const fmt = (d) => (d instanceof Date ? d.toISOString().split('T')[0] : d);

      const DataInicioMovimento = fmt(params.DataInicioMovimento || trintaDiasAtras);
      const DataFimMovimento = fmt(params.DataFimMovimento || hoje);
      const RegistrosPorPagina = params.RegistrosPorPagina || 20;
      const paginaAtual = params.paginaAtual || 1;

      const path = `/core/v1/publicacoes-clientes/consulta-paginada?Campos=*&Lido=false&DataInicioMovimento=${DataInicioMovimento}&DataFimMovimento=${DataFimMovimento}&RegistrosPorPagina=${RegistrosPorPagina}&paginaAtual=${paginaAtual}`;

      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 20000);
      const data = await adviseGet(path, token, controller.signal);
      clearTimeout(tid);

      const itens = data.itens || data.items || [];

      // Deduplicar antes de salvar
      if (itens.length > 0) {
        const existentes = await base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 500);
        const idsExistentes = new Set(existentes.map(r => String(r.idPublicacaoAdvise)));
        const novas = itens.filter(item => {
          const id = String(item.id || item.idPublicacaoCliente || item.idMovProcessoCliente || '');
          return id && !idsExistentes.has(id);
        }).map(mapItem);

        if (novas.length > 0) {
          await base44.asServiceRole.entities.PublicacaoAdvise.bulkCreate(novas);
          console.log(`[PUBLICACOES] Salvou ${novas.length} novas`);
        }

        return Response.json({ success: true, data, savedCount: novas.length, total: itens.length });
      }

      return Response.json({ success: true, data, savedCount: 0, total: 0 });
    }

    // ── MARCAR LIDO ────────────────────────────────────────────────
    if (action === 'marcar-lido') {
      const { publicationIds = [] } = params;
      if (!publicationIds.length) return Response.json({ error: 'publicationIds vazio' }, { status: 400 });

      await advisePut('/core/v1/publicacoes-clientes/marcar-lidos', token, {
        itens: publicationIds.map(id => ({ idMovProcessoCliente: id }))
      });

      // Atualizar no BD em paralelo
      await Promise.allSettled(
        publicationIds.map(id => base44.asServiceRole.entities.PublicacaoAdvise.update(id, { lido: true }))
      );

      return Response.json({ success: true, updated: publicationIds.length });
    }

    // ── DESMARCAR LIDO ─────────────────────────────────────────────
    if (action === 'desmarcar-lido') {
      const { publicationIds = [] } = params;
      if (!publicationIds.length) return Response.json({ error: 'publicationIds vazio' }, { status: 400 });

      await advisePut('/core/v1/publicacoes-clientes/desmarcar-lidos', token, {
        itens: publicationIds.map(id => ({ idMovProcessoCliente: id }))
      });

      await Promise.allSettled(
        publicationIds.map(id => base44.asServiceRole.entities.PublicacaoAdvise.update(id, { lido: false }))
      );

      return Response.json({ success: true, updated: publicationIds.length });
    }

    return Response.json({ error: 'Ação não reconhecida. Use: consultar, marcar-lido, desmarcar-lido' }, { status: 400 });

  } catch (error) {
    console.error('[PUBLICACOES] Erro:', error.message);
    return Response.json({ error: error.message, code: 'ADVISE_ERROR' }, { status: 500 });
  }
});