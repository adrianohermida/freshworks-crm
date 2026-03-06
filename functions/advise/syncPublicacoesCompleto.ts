/**
 * Sincronizar publicações do Advise em lote
 * Processa grandes volumes com pagination e deduplicação
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ADVISE_TOKEN = Deno.env.get('ADVISE_TOKEN');
    const ADVISE_API_URL = Deno.env.get('ADVISE_API_URL');

    if (!ADVISE_TOKEN || !ADVISE_API_URL) {
      return Response.json({ error: 'ADVISE_TOKEN ou ADVISE_API_URL não configurados' }, { status: 500 });
    }

    const REGISTROS_POR_PAGINA = 30; // Reduzido para evitar timeouts com 200K registros
    const TIMEOUT_MS = 30000;
    const DELAY_ENTRE_REQUESTS_MS = 1000; // Aumentado para 1s entre itens

    // Datas
    const dataFim = new Date().toISOString().split('T')[0];
    const dataInicio = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const tempoInicio = Date.now();

    console.log(`\n📌 ===== SINCRONIZAÇÃO DE PUBLICAÇÕES INICIADA =====`);
    console.log(`📅 Período: ${dataInicio} a ${dataFim}`);
    console.log(`⏰ Horário: ${new Date().toISOString()}`);
    console.log(`📦 Registros por página: ${REGISTROS_POR_PAGINA}`);

    // Obter IDs de registros já existentes
    console.log(`🔍 Verificando registros existentes no banco de dados...`);
    const existentes = await base44.asServiceRole.entities.PublicacaoAdvise.list();
    const idsExistentes = new Set(existentes.map(r => r.idPublicacaoAdvise));
    const numerosExistentes = new Set(existentes.map(r => r.numeroProcesso));
    console.log(`✅ ${existentes.length} registros existentes encontrados`);

    let paginaAtual = 1;
    let totalProcessados = 0;
    let totalPulados = 0;
    let totalErros = 0;
    const processados = [];
    const erros = [];

    while (true) {
      const inicioPageTime = Date.now();
      try {
        // ADVISE_API_URL já contém o caminho completo
        const url = new URL(ADVISE_API_URL.replace(/\/$/, ''));
        url.searchParams.append('campos', '*');
        url.searchParams.append('RegistrosPorPagina', String(REGISTROS_POR_PAGINA));
        url.searchParams.append('paginaAtual', String(paginaAtual));
        url.searchParams.append('DataInicioMovimento', dataInicio);
        url.searchParams.append('DataFimMovimento', dataFim);
        
        console.log(`🔗 URL da API: ${url.toString().substring(0, 150)}...`);

        console.log(`\n📄 Página ${paginaAtual} | Total: ${totalProcessados + totalPulados} itens processados`);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ADVISE_TOKEN}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          console.error(`❌ HTTP ${response.status} na página ${paginaAtual} - Parando sincronização`);
          const errorBody = await response.text();
          console.error(`📋 Resposta: ${errorBody.substring(0, 500)}`);
          break;
        }

        const responseText = await response.text();
        if (!responseText) {
          console.log(`⚠️ Resposta vazia na página ${paginaAtual} - Sincronização completa`);
          break;
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseErr) {
          console.error(`❌ JSON Parse Error na página ${paginaAtual}: ${parseErr.message}`);
          console.error(`📋 Resposta (primeiros 500 chars): ${responseText.substring(0, 500)}`);
          break;
        }

        // Extrair items conforme estrutura do Advise
        const publicacoes = data.itens || data.result || data.publicacoes || data.items || [];

        if (!Array.isArray(publicacoes)) {
          console.error(`❌ Estrutura inválida na página ${paginaAtual} - esperado array, recebido ${typeof publicacoes}`);
          console.error(`📋 Estrutura recebida: ${JSON.stringify(data).substring(0, 300)}`);
          break;
        }

        if (publicacoes.length === 0) {
          console.log(`✅ Fim da paginação atingido na página ${paginaAtual}`);
          break;
        }

        console.log(`📥 ${publicacoes.length} itens recebidos | Processando...`);

        // Processar batch em chunks para evitar timeout
        let processadosNestaPagina = 0;
        let errosNestaPagina = 0;
        const CHUNK_SIZE = 10; // Processar 10 registros por vez

        for (let chunkIdx = 0; chunkIdx < publicacoes.length; chunkIdx += CHUNK_SIZE) {
          const chunk = publicacoes.slice(chunkIdx, chunkIdx + CHUNK_SIZE);
          
          for (let idx = 0; idx < chunk.length; idx++) {
            const item = chunk[idx];
            const idAdvise = item.id || item.idMovProcessoCliente;
            const numeroProcesso = item.numero || 'N/A';
            const itemNumber = chunkIdx + idx + 1;

            try {
              // Verificar duplicatas
              if (idsExistentes.has(idAdvise) || numerosExistentes.has(numeroProcesso)) {
                totalPulados++;
                continue;
              }

              if (!idAdvise) {
                console.warn(`⚠️ [Página ${paginaAtual}, item ${itemNumber}] ID ausente para processo ${numeroProcesso}`);
                errosNestaPagina++;
                erros.push({ pagina: paginaAtual, item: itemNumber, processo: numeroProcesso, erro: 'ID ausente' });
                continue;
              }

              const novaPublicacao = {
                idPublicacaoAdvise: String(idAdvise),
                numeroProcesso: numeroProcesso,
                numeroCNJ: true,
                palavrasChave: Array.isArray(item.palavrasChave) 
                  ? item.palavrasChave.map(p => p.palavraChave || p) 
                  : [],
                dataHoraMovimento: item.dataHoraMovimento || new Date().toISOString(),
                dataPublicacao: item.dataPublicacao || new Date().toISOString(),
                conteudo: item.conteudo || '',
                municipio: item.cidadeComarcaDescricao || '',
                vara: item.varaDescricao || '',
                diario: item.nomeDiario || '',
                lido: false,
                statusSincronizacao: 'importado',
                dataSincronizacao: new Date().toISOString(),
                idMovProcessoClienteAdvise: item.idMovProcessoCliente || ''
              };

              let resultado;
              let tentativas = 0;
              const maxTentativas = 3;
              
              while (tentativas < maxTentativas) {
                try {
                  resultado = await base44.asServiceRole.entities.PublicacaoAdvise.create(novaPublicacao);
                  break;
                } catch (retryError) {
                  tentativas++;
                  if (retryError.status === 429) {
                    const delayMs = Math.min(1000 * Math.pow(2, tentativas), 5000);
                    console.warn(`⏳ Rate limit detectado, aguardando ${delayMs}ms antes de retry...`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                  } else {
                    throw retryError;
                  }
                }
              }
              
              // Validar se foi realmente criado
              if (!resultado || !resultado.id) {
                console.warn(`⚠️ [Página ${paginaAtual}, item ${itemNumber}] Falha ao criar ${numeroProcesso}: resultado vazio`);
                errosNestaPagina++;
                erros.push({ pagina: paginaAtual, item: itemNumber, processo: numeroProcesso, erro: 'Resultado de create vazio' });
                continue;
              }

              idsExistentes.add(idAdvise);
              numerosExistentes.add(numeroProcesso);
              totalProcessados++;
              processadosNestaPagina++;
              processados.push(numeroProcesso);
              console.log(`   ✓ ${numeroProcesso} | ID: ${resultado.id}`);
            } catch (createError) {
              totalErros++;
              errosNestaPagina++;
              const errorMsg = createError.message || String(createError);
              console.error(`❌ [Página ${paginaAtual}, item ${itemNumber}] ${numeroProcesso} | ${errorMsg}`);
              erros.push({ pagina: paginaAtual, item: itemNumber, processo: numeroProcesso, erro: errorMsg });
            }

            // Delay entre cada item para evitar rate limiting
            if (idx < chunk.length - 1) {
              await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_REQUESTS_MS));
            }
          }

          // Delay maior entre chunks
          if (chunkIdx + CHUNK_SIZE < publicacoes.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_REQUESTS_MS * 2));
          }
        }

        const tempoPagina = ((Date.now() - inicioPageTime) / 1000).toFixed(2);
        console.log(`✅ Página ${paginaAtual} concluída | ${processadosNestaPagina} novos, ${publicacoes.length - processadosNestaPagina - errosNestaPagina} duplicatas, ${errosNestaPagina} erros | ${tempoPagina}s`);

        paginaAtual++;
      } catch (fetchError) {
        const errorMsg = fetchError.message || String(fetchError);
        console.error(`❌ Erro crítico na página ${paginaAtual}: ${errorMsg}`);
        totalErros++;
        erros.push({ pagina: paginaAtual, erro: `Erro crítico: ${errorMsg}` });
        break;
      }
    }

    const tempoTotal = ((Date.now() - tempoInicio) / 1000).toFixed(2);
    
    // AUDITORIA: Verificar quantos registros realmente foram criados
    console.log(`\n🔍 Iniciando auditoria de integridade...`);
    const registrosAposSync = await base44.asServiceRole.entities.PublicacaoAdvise.list();
    const totalRealAtual = registrosAposSync.length;
    const novosCriados = totalRealAtual - existentes.length;
    
    console.log(`📊 Verificação do Banco de Dados:`);
    console.log(`   - Registros antes: ${existentes.length}`);
    console.log(`   - Registros depois: ${totalRealAtual}`);
    console.log(`   - Diferença (realmente criados): ${novosCriados}`);
    
    if (novosCriados !== totalProcessados) {
      console.warn(`\n⚠️ DISCREPÂNCIA DETECTADA!`);
      console.warn(`   - Reportados como criados: ${totalProcessados}`);
      console.warn(`   - Realmente criados no BD: ${novosCriados}`);
      console.warn(`   - Diferença: ${totalProcessados - novosCriados} registros perdidos!`);
    }
    
    console.log(`\n📊 ===== RESUMO FINAL DA SINCRONIZAÇÃO =====`);
    console.log(`✅ Publicações reportadas como novas: ${totalProcessados}`);
    console.log(`✅ Publicações realmente criadas (BD): ${novosCriados}`);
    console.log(`⏭️  Duplicatas puladas: ${totalPulados}`);
    console.log(`❌ Erros encontrados: ${totalErros}`);
    console.log(`📄 Páginas processadas: ${paginaAtual - 1}`);
    console.log(`⏱️  Tempo total: ${tempoTotal}s`);
    if (novosCriados > 0) {
      console.log(`⚡ Velocidade: ${(novosCriados / parseFloat(tempoTotal)).toFixed(2)} registros/segundo`);
    }
    if (erros.length > 0 && erros.length <= 10) {
      console.log(`\n📝 Erros detectados:`);
      erros.forEach(e => {
        console.log(`   - Página ${e.pagina}, item ${e.item}: ${e.processo} | ${e.erro}`);
      });
    } else if (erros.length > 10) {
      console.log(`\n📝 Primeiros 10 erros:`);
      erros.slice(0, 10).forEach(e => {
        console.log(`   - Página ${e.pagina}, item ${e.item}: ${e.processo} | ${e.erro}`);
      });
    }

    console.log(`\n🎉 Sincronização finalizada!\n`);

    return Response.json({
      success: true,
      totalProcessados,
      totalReallyCriados: novosCriados,
      discrepancia: totalProcessados - novosCriados,
      totalPulados,
      totalErros,
      processados: processados.slice(0, 100),
      erros: erros.slice(0, 50),
      auditoria: {
        registrosAntes: existentes.length,
        registrosDepois: totalRealAtual,
        verificacao: novosCriados === totalProcessados ? '✅ OK' : '⚠️ DISCREPÂNCIA'
      },
      periodo: { dataInicio, dataFim },
      timestamp: new Date().toISOString(),
      tempoTotalSegundos: ((Date.now() - tempoInicio) / 1000).toFixed(2)
    });
  } catch (error) {
    const errorMsg = error.message || String(error);
    console.error(`\n❌ ===== ERRO CRÍTICO NA SINCRONIZAÇÃO =====`);
    console.error(`Mensagem: ${errorMsg}`);
    console.error(`Página onde ocorreu: ${paginaAtual}`);
    console.error(`Total processado até erro: ${totalProcessados}`);
    console.error(`Stack: ${error.stack}`);
    console.error(`⏰ Horário: ${new Date().toISOString()}\n`);
    return Response.json({ 
      error: errorMsg,
      debug: {
        pagina: paginaAtual,
        totalProcessadoAteErro: totalProcessados,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
});