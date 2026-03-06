import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, tabela, dados, formato } = await req.json();

    if (!action || !tabela) {
      return Response.json({ error: 'Parâmetros "action" e "tabela" são obrigatórios' }, { status: 400 });
    }

    // AÇÃO 1: GERAR DOWNLOAD
    if (action === 'download') {
      if (!dados || dados.length === 0) {
        return Response.json({ error: 'Nenhum dado para download' }, { status: 400 });
      }

      let conteudo, tipo, nomeArquivo;

      if (formato === 'json') {
        conteudo = JSON.stringify(dados, null, 2);
        tipo = 'application/json';
        nomeArquivo = `tpu-${tabela}-${new Date().getTime()}.json`;
      } else if (formato === 'csv') {
        // Gerar CSV
        const chaves = Object.keys(dados[0]);
        const headers = chaves.join(',');
        const linhas = dados.map(item =>
          chaves.map(key => {
            const valor = String(item[key] || '');
            return valor.includes(',') ? `"${valor}"` : valor;
          }).join(',')
        );
        conteudo = [headers, ...linhas].join('\n');
        tipo = 'text/csv;charset=utf-8';
        nomeArquivo = `tpu-${tabela}-${new Date().getTime()}.csv`;
      } else {
        return Response.json({ error: 'Formato inválido. Use "json" ou "csv"' }, { status: 400 });
      }

      return new Response(conteudo, {
        status: 200,
        headers: {
          'Content-Type': tipo,
          'Content-Disposition': `attachment; filename="${nomeArquivo}"`
        }
      });
    }

    // AÇÃO 2: SINCRONIZAR PARA BANCO DE DADOS
    if (action === 'sync') {
      if (!dados || dados.length === 0) {
        return Response.json({ error: 'Nenhum dado para sincronizar' }, { status: 400 });
      }

      const entidadeMap = {
        assuntos: 'TPUAssuntos',
        classes: 'TPUClasses',
        movimentos: 'TPUMovimentos',
        documentos: 'TPUDocumentos'
      };

      const nomeEntidade = entidadeMap[tabela];
      if (!nomeEntidade) {
        return Response.json({ error: 'Tabela inválida' }, { status: 400 });
      }

      try {
        // Buscar entidade
        const entidade = base44.entities[nomeEntidade];
        if (!entidade) {
          return Response.json({ error: `Entidade ${nomeEntidade} não encontrada` }, { status: 500 });
        }

        // Mapear campos de entrada para campos da entidade
        const dadosProcessados = dados.map(item => {
          const novoItem = {};
          
          // Mapear campos comuns
          novoItem.cod_item = item.cod_item || item.codigo;
          novoItem.nome = item.nome;
          novoItem.dscGlossario = item.dscGlossario || item.glossario || item.descricao_glossario;
          
          // Adicionar campos específicos por tabela
          if (tabela === 'assuntos') {
            novoItem.ramo_direito = item.ramo_direito;
            novoItem.sigiloso = item.sigiloso;
            novoItem.assunto_secundario = item.assunto_secundario;
          } else if (tabela === 'classes') {
            novoItem.sigla = item.sigla;
            novoItem.natureza = item.natureza;
            novoItem.numeracao_propria = item.numeracao_propria;
          } else if (tabela === 'movimentos') {
            novoItem.categoria = item.categoria;
            novoItem.subcategoria = item.subcategoria;
            novoItem.visibilidade_externa = item.visibilidade_externa;
            novoItem.flg_eletronico = item.flg_eletronico;
            novoItem.flg_papel = item.flg_papel;
          } else if (tabela === 'documentos') {
            novoItem.cod_item_pai = item.cod_item_pai;
          }
          
          // Campos comuns
          novoItem.data_inclusao = item.data_inclusao || new Date().toISOString();
          novoItem.usuario_inclusao = item.usuario_inclusao || user.email;
          
          return novoItem;
        });

        // Sincronizar em lotes de 50
        const loteSize = 50;
        let sincronizados = 0;
        let erros = 0;

        for (let i = 0; i < dadosProcessados.length; i += loteSize) {
          const lote = dadosProcessados.slice(i, i + loteSize);
          
          try {
            await entidade.bulkCreate(lote);
            sincronizados += lote.length;
          } catch (error) {
            erros += lote.length;
          }
        }

        // Criar registro de sincronização
        const syncRecord = {
          tabela,
          total_sincronizado: sincronizados,
          total_erros: erros,
          data_sincronizacao: new Date().toISOString(),
          usuario_sincronizacao: user.email,
          status: erros === 0 ? 'sucesso' : 'parcial'
        };

        return Response.json({
          success: true,
          message: `${sincronizados} registros sincronizados`,
          syncRecord,
          erros
        });
      } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    return Response.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});