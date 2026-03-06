import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { publicacao } = await req.json();

    if (!publicacao) {
      return Response.json({ error: 'Publicação não fornecida' }, { status: 400 });
    }

    // Extrair partes do conteúdo
    const partes = extrairPartes(publicacao.conteudo || publicacao.despacho || '');
    
    // Extrair prazos
    const prazos = extrairPrazos(publicacao.conteudo || publicacao.despacho || '');

    // Enriquecer publicação
    const publicacaoEnriquecida = {
      numeroProcesso: publicacao.numero || publicacao.numeroProcesso,
      idPublicacaoAdvise: publicacao.idMovProcessoCliente || publicacao.id,
      tribunal: publicacao.varaDescricao || 'Não informado',
      comarca: publicacao.cidadeComarcaDescricao || 'Não informada',
      diario: publicacao.nomeDiario,
      dataPublicacao: publicacao.dataPublicacao,
      dataMovimento: publicacao.dataHoraMovimento,
      partes: partes,
      prazos: prazos,
      palavrasChave: publicacao.palavrasChave?.map(p => p.palavraChave) || [],
      conteudoOriginal: publicacao.conteudo || publicacao.despacho,
      metadados: {
        idCliente: publicacao.nomeCliente,
        usuarioCliente: publicacao.nomeUsuarioCliente,
        caderno: publicacao.nomeCadernoDiario,
        edicao: publicacao.edicaoDiario,
        paginas: {
          inicio: publicacao.paginaInicialPublicacao,
          fim: publicacao.paginaFinalPublicacao
        }
      },
      status: 'processado',
      dataSincronizacao: new Date().toISOString()
    };

    return Response.json({
      sucesso: true,
      processo: publicacaoEnriquecida,
      partesCont: partes.length,
      prazosCont: prazos.length
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function extrairPartes(conteudo) {
  const partes = [];
  
  // Padrões comuns em publicações judiciais
  const padroes = [
    /(?:autor|requerente|reclamante)[\s:]*([^,\n]+)/gi,
    /(?:réu|reclamado|requerido)[\s:]*([^,\n]+)/gi,
    /(?:advogado)[\s:]*([^,\n]+)/gi
  ];

  for (const padrao of padroes) {
    let match;
    while ((match = padrao.exec(conteudo)) !== null) {
      const parte = match[1].trim();
      if (parte && parte.length > 3 && !partes.includes(parte)) {
        partes.push(parte);
      }
    }
  }

  return partes;
}

function extrairPrazos(conteudo) {
  const prazos = [];
  
  // Procura por datas e prazos mencionados
  const padroes = [
    /(\d{1,2})\s*(?:de)?\s*(?:dias?\s+(?:úteis|corridos)?)/gi,
    /(?:até|prazo|vencimento|cumprimento)[\s:]*([\d]{1,2}[\/\-][\d]{1,2}[\/\-][\d]{2,4})/gi,
    /(\d{1,2})\s+(?:dias?\s+úteis|dias?\s+corridos)/gi
  ];

  const conteudoLower = conteudo.toLowerCase();
  
  // Identificar tipos de prazo
  const tipoPrazos = [
    { tipo: 'defesa', palavras: ['defesa', 'contestação'] },
    { tipo: 'recurso', palavras: ['recurso', 'apelação'] },
    { tipo: 'comparecimento', palavras: ['comparecimento', 'audiência'] },
    { tipo: 'pagamento', palavras: ['pagamento', 'depósito'] }
  ];

  for (const padrao of padroes) {
    let match;
    while ((match = padrao.exec(conteudo)) !== null) {
      prazos.push({
        dias: parseInt(match[1]),
        descricao: match[0],
        identificado: true
      });
    }
  }

  // Enriquecer prazos com tipo
  return prazos.map(prazo => {
    let tipo = 'outro';
    for (const tipoPrazo of tipoPrazos) {
      if (tipoPrazo.palavras.some(palavra => conteudoLower.includes(palavra))) {
        tipo = tipoPrazo.tipo;
        break;
      }
    }
    return { ...prazo, tipo };
  });
}