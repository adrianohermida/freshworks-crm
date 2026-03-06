import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { codigo, tabela } = await req.json();

    if (!codigo || !tabela) {
      return Response.json({ error: 'Parâmetros "codigo" e "tabela" são obrigatórios' }, { status: 400 });
    }

    const datajudBaseUrl = Deno.env.get('DATAJUD_BASE_URL');
    const apiKey = Deno.env.get('DATAJUD_API_KEY');

    if (!datajudBaseUrl || !apiKey) {
      return Response.json({ error: 'Configuração incompleta' }, { status: 500 });
    }

    // Consultar API CNJ com o código específico
    const tpuUrl = new URL(`${datajudBaseUrl}/api/v1/publico/consulta/${tabela}`);
    tpuUrl.searchParams.append('codigo', codigo);

    const response = await fetch(tpuUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `APIKey ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json({
        valido: false,
        codigo,
        tabela,
        erro: 'Código não encontrado na API CNJ',
        statusCode: response.status
      });
    }

    const data = await response.json();
    const item = Array.isArray(data) ? data[0] : data;

    if (!item) {
      return Response.json({
        valido: false,
        codigo,
        tabela,
        erro: 'Código não encontrado'
      });
    }

    // Validação bem-sucedida
    return Response.json({
      valido: true,
      codigo,
      tabela,
      item: {
        cod_item: item.cod_item || item.codigo,
        nome: item.nome,
        descricao: item.dscGlossario || item.glossario || item.descricao_glossario,
        data_versao: item.data_versao || item.dat_inclusao,
        ativo: item.situacao === 'A'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});