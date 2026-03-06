import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Parâmetros da requisição
    const tabela = searchParams.get('tabela'); // assuntos, classes, movimentos, documentos
    const codigo = searchParams.get('codigo');
    const nome = searchParams.get('nome');
    const glossario = searchParams.get('glossario');
    const detalhado = searchParams.get('detalhado') === 'true';

    if (!tabela) {
      return Response.json({ error: 'Parâmetro "tabela" é obrigatório' }, { status: 400 });
    }

    // Construir endpoint
    const datajudBaseUrl = Deno.env.get('DATAJUD_BASE_URL');
    const apiKey = Deno.env.get('DATAJUD_API_KEY');

    if (!datajudBaseUrl || !apiKey) {
      return Response.json({ error: 'Configuração incompleta' }, { status: 500 });
    }

    // Construir URL da requisição
     const endpoint = detalhado ? 'consulta/detalhada' : 'consulta';
     const tpuUrl = new URL(`https://gateway.cloud.pje.jus.br/tpu/${endpoint}/${tabela}`);

    // Adicionar parâmetros de filtro
    if (codigo) tpuUrl.searchParams.append('codigo', codigo);
    if (nome) tpuUrl.searchParams.append('nome', nome);
    if (glossario) tpuUrl.searchParams.append('glossario', glossario);

    // Fazer requisição ao TPU
    const response = await fetch(tpuUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `APIKey ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return Response.json(
        { error: `Erro ao consultar TPU: ${response.status}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Track analytics
    await base44.asServiceRole.integrations.Core.TrackEvent({
      eventName: 'tpu_consulta',
      properties: {
        tabela,
        detalhado,
        registros: Array.isArray(data) ? data.length : 0,
        filtros: { codigo, nome, glossario }
      }
    }).catch(() => {});

    return Response.json({ data, count: Array.isArray(data) ? data.length : 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});