import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para upload de anexos ao processo
 * POST /core/v1/processos-clientes/anexos
 * Envia arquivo para Advise e registra na entidade
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
    const {
      numeroProcesso,
      idProcessoAdvise,
      nomeArquivo,
      tipo,
      descricao,
      fileUrl,
      dataDocumento
    } = body;

    // Validações
    if (!numeroProcesso || !nomeArquivo || !tipo) {
      return Response.json(
        { error: 'numeroProcesso, nomeArquivo e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    // Chamar API Advise para upload
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    // Fetch do arquivo
    let fileContent;
    let mimeType = 'application/octet-stream';
    
    if (fileUrl) {
      const fileResponse = await fetch(fileUrl);
      fileContent = await fileResponse.arrayBuffer();
      
      // Inferir MIME type
      const ext = nomeArquivo.split('.').pop().toLowerCase();
      const mimeTypes = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xls': 'application/vnd.ms-excel',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png'
      };
      mimeType = mimeTypes[ext] || 'application/octet-stream';
    }

    // Criar FormData para upload
    const formData = new FormData();
    const blob = new Blob([fileContent], { type: mimeType });
    formData.append('arquivo', blob, nomeArquivo);
    formData.append('numeroProcesso', numeroProcesso);
    formData.append('tipo', tipo);
    formData.append('descricao', descricao || '');
    formData.append('dataDocumento', dataDocumento || '');

    const response = await fetch(
      `${adviseUrl}/core/v1/processos-clientes/anexos`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adviseToken}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      return Response.json(
        { error: `Erro ao upload no Advise: ${errorData}` },
        { status: response.status }
      );
    }

    const adviseResponse = await response.json();

    // Registrar na entidade AnexoProcesso
    const anexoData = {
      idAnexo: adviseResponse.idAnexo || crypto.randomUUID(),
      idProcessoAdvise: idProcessoAdvise || numeroProcesso,
      numeroProcesso,
      nomeArquivo,
      extensao: nomeArquivo.split('.').pop().toLowerCase(),
      tamanhoBytes: fileContent?.byteLength || 0,
      tipo,
      descricao: descricao || '',
      dataUpload: new Date().toISOString(),
      dataDocumento: dataDocumento || new Date().toISOString(),
      autoria: user.full_name,
      hashSha256: adviseResponse.hashSha256 || '',
      assinado: adviseResponse.assinado || false,
      privado: adviseResponse.privado || false,
      dataSincronizacao: new Date().toISOString(),
      status: 'disponivel',
      metadados: adviseResponse.metadados || {}
    };

    // Criar registro na base44
    const anexoCriado = await base44.entities.AnexoProcesso.create(anexoData);

    return new Response(JSON.stringify({
      success: true,
      anexo: anexoCriado,
      adviseResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erro ao upload de anexo:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});