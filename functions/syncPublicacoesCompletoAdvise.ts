import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    if (!adviseToken) {
      return Response.json({ error: 'ADVISE_TOKEN não configurado' }, { status: 500 });
    }

    const formatDate = (date) => {
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };

    const dataFim = formatDate(new Date());
    const dataInicio = formatDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));

    const existentes = await base44.entities.PublicacaoAdvise.filter({});
    const processosExistentes = new Set(existentes.map(p => p.numeroProcesso));

    let paginaAtual = 1;
    let totalProcessados = 0;
    let totalNovos = 0;
    let continuarBuscando = true;

    while (continuarBuscando) {
      const url = `https://api.advise.com.br/core/v1/publicacoes-clientes/consulta-paginada?campos=*&RegistrosPorPagina=50&paginaAtual=${paginaAtual}&DataInicioMovimento=${dataInicio}&DataFimMovimento=${dataFim}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adviseToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        break;
      }

      const data = await response.json();
      const publicacoes = data.itens || [];

      if (!Array.isArray(publicacoes) || publicacoes.length === 0) {
        continuarBuscando = false;
        break;
      }

      totalProcessados += publicacoes.length;

      // Processar e salvar publicações novas
      const novasPublicacoes = publicacoes
        .filter(item => {
          const numero = item.numero || item.numeroProcesso;
          return numero && !processosExistentes.has(numero);
        })
        .map(item => ({
          idPublicacaoAdvise: item.id?.toString() || item.idMovUsuarioCliente?.toString() || `pub-${Date.now()}-${Math.random()}`,
          numeroProcesso: item.numero || item.numeroProcesso || 'N/A',
          numeroCNJ: item.numeroCNJ || false,
          palavrasChave: item.palavrasChave?.map(p => p.palavraChave) || [],
          dataHoraMovimento: item.dataHoraMovimento || new Date().toISOString(),
          dataPublicacao: item.dataPublicacao || new Date().toISOString(),
          conteudo: item.conteudo || '',
          municipio: item.cidadeComarcaDescricao || '',
          vara: item.varaDescricao || '',
          diario: item.nomeDiario || '',
          lido: false,
          statusSincronizacao: 'importado',
          dataSincronizacao: new Date().toISOString(),
          idMovProcessoClienteAdvise: item.idMovUsuarioCliente?.toString() || '',
          cadernoDiario: item.nomeCadernoDiario || '',
          nomeCliente: item.nomeCliente || '',
          nomeUsuario: item.nomeUsuarioCliente || '',
          edicao: item.edicaoDiario || 0,
          paginaInicial: item.paginaInicialPublicacao || 0,
          paginaFinal: item.paginaFinalPublicacao || 0,
          despacho: item.despacho || ''
        }));

      if (novasPublicacoes.length > 0) {
        await base44.entities.PublicacaoAdvise.bulkCreate(novasPublicacoes);
        totalNovos += novasPublicacoes.length;
        novasPublicacoes.forEach(pub => {
          processosExistentes.add(pub.numeroProcesso);
        });
      }

      paginaAtual++;

      // Limitar para não ficar muito tempo
      if (paginaAtual > 100) {
        continuarBuscando = false;
      }
    }

    return Response.json({
      success: true,
      totalProcessados,
      totalNovos,
      periodo: `${dataInicio} a ${dataFim}`,
      paginas: paginaAtual - 1
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});