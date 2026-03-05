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

    const { 
      numeroProcesso, 
      tipo, 
      paginaAtual = 1, 
      registrosPorPagina = 50 
    } = await req.json();

    if (!numeroProcesso) {
      return Response.json({
        success: false,
        error: 'numeroProcesso é obrigatório'
      }, { status: 400 });
    }

    // GET /documentos - listar anexos/documentos de um processo
    let url = `${adviseApiUrl}/processos/${numeroProcesso}/documentos?page=${paginaAtual}&pageSize=${registrosPorPagina}`;
    if (tipo) {
      url += `&tipo=${tipo}`;
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
    const documentos = data.documentos || data.data || [];

    // Sincronizar com banco de dados
    for (const doc of documentos) {
      const existente = await base44.entities.AnexoProcesso.filter({
        idAnexo: doc.id
      });

      if (existente.length === 0) {
        await base44.entities.AnexoProcesso.create({
          idAnexo: doc.id,
          idProcessoAdvise: doc.processoId || '',
          numeroProcesso: numeroProcesso,
          nomeArquivo: doc.nome || doc.nomeArquivo,
          extensao: doc.extensao || doc.nome?.split('.').pop() || '',
          tamanhoBytes: doc.tamanho || 0,
          tipo: tipo || doc.tipo || 'outro',
          descricao: doc.descricao || '',
          dataUpload: doc.dataCriacao || new Date().toISOString(),
          dataDocumento: doc.dataDocumento || null,
          autoria: doc.autoria || '',
          assinado: doc.assinado === true,
          privado: doc.privado === true,
          dataSincronizacao: new Date().toISOString(),
          status: 'disponivel'
        });
      }
    }

    return Response.json({
      success: true,
      action: 'documentos.listar',
      data: {
        documentos: documentos,
        totalDocumentos: documentos.length,
        numeroProcesso: numeroProcesso,
        filtro: {
          tipo: tipo || 'todos'
        },
        paginacao: {
          paginaAtual,
          registrosPorPagina,
          total: data.total || documentos.length
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