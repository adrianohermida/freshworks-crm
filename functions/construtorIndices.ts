/**
 * Construtor de Índices - Cria índices otimizados para busca rápida
 * Suporta indexação por múltiplos campos para processos e movimentos
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class IndicePalavrasChave {
  constructor() {
    this.indice = new Map();
  }

  adicionar(id, palavras) {
    palavras.forEach(palavra => {
      const chave = palavra.toLowerCase();
      if (!this.indice.has(chave)) {
        this.indice.set(chave, []);
      }
      this.indice.get(chave).push(id);
    });
  }

  buscar(termo) {
    const chave = termo.toLowerCase();
    return this.indice.get(chave) || [];
  }

  buscaGlobal(termo) {
    const chave = termo.toLowerCase();
    const resultados = [];
    
    for (const [palavraChave, ids] of this.indice.entries()) {
      if (palavraChave.includes(chave)) {
        resultados.push(...ids);
      }
    }
    
    return [...new Set(resultados)]; // Remover duplicatas
  }

  estatisticas() {
    return {
      total_termos: this.indice.size,
      maior_grupo: Math.max(...Array.from(this.indice.values()).map(arr => arr.length)),
      memoria_estimada_mb: (this.indice.size * 100) / 1024 / 1024
    };
  }
}

class IndiceTribunal {
  constructor() {
    this.indices = new Map();
  }

  criar(tribunal) {
    if (!this.indices.has(tribunal)) {
      this.indices.set(tribunal, new Map());
    }
    return this.indices.get(tribunal);
  }

  adicionar(tribunal, chave, valor, id) {
    const indiceTrib = this.criar(tribunal);
    if (!indiceTrib.has(chave)) {
      indiceTrib.set(chave, new Map());
    }
    
    const indiceChave = indiceTrib.get(chave);
    if (!indiceChave.has(valor)) {
      indiceChave.set(valor, []);
    }
    
    indiceChave.get(valor).push(id);
  }

  buscar(tribunal, chave, valor) {
    const indiceTrib = this.indices.get(tribunal);
    if (!indiceTrib) return [];
    
    const indiceChave = indiceTrib.get(chave);
    if (!indiceChave) return [];
    
    return indiceChave.get(valor) || [];
  }

  estatisticas() {
    const stats = {};
    for (const [tribunal, indice] of this.indices.entries()) {
      stats[tribunal] = {
        total_chaves: indice.size,
        valores_por_chave: Math.round(
          Array.from(indice.values()).reduce((acc, m) => acc + m.size, 0) / indice.size
        )
      };
    }
    return stats;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, tribunal, chave, valor, dados, termo } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    // Índices globais
    const indiceGlobal = new IndicePalavrasChave();
    const indiceTribunal = new IndiceTribunal();

    let resultado;

    switch (operacao) {
      case 'indexar_palavras':
        if (!dados || !Array.isArray(dados)) {
          return Response.json({ error: 'dados deve ser um array' }, { status: 400 });
        }
        
        dados.forEach((item, idx) => {
          const palavras = item.split(' ');
          indiceGlobal.adicionar(idx, palavras);
        });

        resultado = {
          operacao: 'indexar_palavras',
          total_documentos: dados.length,
          estatisticas: indiceGlobal.estatisticas()
        };
        break;

      case 'buscar_palavra':
        if (!termo) {
          return Response.json({ error: 'termo é obrigatório' }, { status: 400 });
        }

        resultado = {
          operacao: 'buscar_palavra',
          termo,
          resultados: indiceGlobal.buscar(termo),
          resultados_globais: indiceGlobal.buscaGlobal(termo)
        };
        break;

      case 'indexar_tribunal':
        if (!tribunal || !chave || !valor) {
          return Response.json({ error: 'tribunal, chave e valor são obrigatórios' }, { status: 400 });
        }

        for (let i = 0; i < 100; i++) {
          indiceTribunal.adicionar(tribunal, chave, valor, i);
        }

        resultado = {
          operacao: 'indexar_tribunal',
          tribunal,
          estatisticas: indiceTribunal.estatisticas()
        };
        break;

      case 'buscar_tribunal':
        if (!tribunal || !chave || !valor) {
          return Response.json({ error: 'tribunal, chave e valor são obrigatórios' }, { status: 400 });
        }

        resultado = {
          operacao: 'buscar_tribunal',
          tribunal,
          chave,
          valor,
          resultados: indiceTribunal.buscar(tribunal, chave, valor)
        };
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[construtorIndices] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});