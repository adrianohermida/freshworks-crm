import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para gerar URL de download segura para anexos
 * POST - Gera token temporal e retorna URL assinada
 * Integração com Advise para download direto
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Método não permitido' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { idAnexo, numeroProcesso, expiresIn = 3600 } = body;

    if (!idAnexo) {
      return Response.json(
        { error: 'idAnexo é obrigatório' },
        { status: 400 }
      );
    }

    // Obter dados do anexo
    const anexos = await base44.entities.AnexoProcesso.filter({
      idAnexo
    });

    if (anexos.length === 0) {
      return Response.json(
        { error: 'Anexo não encontrado' },
        { status: 404 }
      );
    }

    const anexo = anexos[0];

    // Validar autorização (apenas criador ou admin podem baixar)
    if (anexo.created_by !== user.email && user.role !== 'admin') {
      return Response.json(
        { error: 'Sem permissão para baixar este anexo' },
        { status: 403 }
      );
    }

    // Chamar Advise para gerar URL assinada
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const response = await fetch(
      `${adviseUrl}/core/v1/anexos/${idAnexo}/download-url`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adviseToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          expiresIn: Math.min(expiresIn, 86400) // máximo 24h
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { error: `Erro ao gerar URL: ${errorData.message || 'Erro desconhecido'}` },
        { status: response.status }
      );
    }

    const adviseResponse = await response.json();

    // Atualizar registro com URL e data de expiração
    const expiresAt = new Date(Date.now() + (expiresIn * 1000));
    
    await base44.entities.AnexoProcesso.update(anexo.id, {
      urlDownload: adviseResponse.downloadUrl,
      urlDownloadExpira: expiresAt.toISOString()
    });

    return new Response(JSON.stringify({
      success: true,
      downloadUrl: adviseResponse.downloadUrl,
      nomeArquivo: anexo.nomeArquivo,
      expiresAt: expiresAt.toISOString(),
      expiresIn,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erro ao gerar URL de download:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});