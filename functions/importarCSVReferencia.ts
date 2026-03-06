import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Importa dados de referência via CSV
 * - Serventias
 * - JuizoCNJ
 * - CodigoForoTJSP
 * 
 * Suporta headers dinâmicos + validação
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar admin
    if (user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { csv_content, tipo_entidade, headers } = await req.json();

    if (!csv_content || !tipo_entidade) {
      return Response.json({ 
        error: 'csv_content e tipo_entidade são obrigatórios' 
      }, { status: 400 });
    }

    // Mapear tipo para entidade
    const entidadeMap = {
      'serventias': 'Serventia',
      'juizocnj': 'JuizoCNJ',
      'codigoforotjsp': 'CodigoForoTJSP'
    };

    const nomeEntidade = entidadeMap[tipo_entidade.toLowerCase()];
    if (!nomeEntidade) {
      return Response.json({ 
        error: 'tipo_entidade inválido. Use: serventias, juizocnj, codigoforotjsp' 
      }, { status: 400 });
    }

    // Parser CSV manual (sem libs externas)
    const linhas = csv_content.split('\n').map(l => l.trim()).filter(l => l);
    if (linhas.length < 2) {
      return Response.json({ error: 'CSV vazio ou sem cabeçalho' }, { status: 400 });
    }

    // Extrair headers da primeira linha ou usar headers fornecido
    const headerLine = linhas[0].split(',').map(h => h.trim().toLowerCase());
    const dadosLinhas = linhas.slice(1);

    // Mapear valores para objetos
    const registros = dadosLinhas.map((linha, idx) => {
      const valores = linha.split(',').map(v => v.trim());
      const registro = {};

      headerLine.forEach((header, i) => {
        const valor = valores[i] || '';
        // Converter para boolean se necessário
        if (valor.toLowerCase() === 'sim' || valor.toLowerCase() === 's') {
          registro[header] = true;
        } else if (valor.toLowerCase() === 'nao' || valor.toLowerCase() === 'n') {
          registro[header] = false;
        } else if (!isNaN(valor) && valor !== '') {
          // Converter para número se possível
          registro[header] = Number(valor);
        } else {
          registro[header] = valor;
        }
      });

      return { linha_numero: idx + 2, ...registro };
    });

    // Validar registros
    const validacoes = validarRegistros(registros, nomeEntidade);
    if (validacoes.invalidos.length > 0) {
      return Response.json({
        error: 'Validação falhou',
        invalidos: validacoes.invalidos.slice(0, 10), // Primeiros 10 erros
        total_erros: validacoes.invalidos.length
      }, { status: 400 });
    }

    // Bulk insert em lotes de 50
    const loteSize = 50;
    let inseridos = 0;
    let erros_insert = 0;
    const errosDetalhados = [];

    const entidade = base44.entities[nomeEntidade];
    if (!entidade) {
      return Response.json({ error: `Entidade ${nomeEntidade} não encontrada` }, { status: 500 });
    }

    for (let i = 0; i < registros.length; i += loteSize) {
      const lote = registros.slice(i, i + loteSize);

      try {
        await entidade.bulkCreate(lote);
        inseridos += lote.length;
      } catch (error) {
        erros_insert += lote.length;
        errosDetalhados.push({
          lote: Math.floor(i / loteSize) + 1,
          erro: error.message
        });
      }
    }

    // Log de sincronização
    const logSync = {
      entidade: nomeEntidade,
      total_linhas: registros.length,
      inseridos,
      erros: erros_insert,
      timestamp: new Date().toISOString(),
      usuario: user.email,
      status: erros_insert === 0 ? 'sucesso' : 'parcial'
    };

    return Response.json({
      success: true,
      import_summary: logSync,
      errosDetalhados: errosDetalhados.slice(0, 5) // Primeiros 5 erros detalhados
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Valida registros conforme o tipo de entidade
 */
function validarRegistros(registros, nomeEntidade) {
  const validos = [];
  const invalidos = [];

  const validadores = {
    'Serventia': (r) => {
      const erros = [];
      if (!r.codigo) erros.push('codigo obrigatório');
      if (!r.nome) erros.push('nome obrigatório');
      if (!r.tribunal) erros.push('tribunal obrigatório');
      if (!r.municipio) erros.push('municipio obrigatório');
      return erros;
    },
    'JuizoCNJ': (r) => {
      const erros = [];
      if (!r.codigo) erros.push('codigo obrigatório');
      if (!r.nome) erros.push('nome obrigatório');
      if (!r.tribunal) erros.push('tribunal obrigatório');
      if (!r.tipo) erros.push('tipo obrigatório');
      return erros;
    },
    'CodigoForoTJSP': (r) => {
      const erros = [];
      if (!r.codigo_foro) erros.push('codigo_foro obrigatório');
      if (!r.nome_foro) erros.push('nome_foro obrigatório');
      if (!r.municipio) erros.push('municipio obrigatório');
      return erros;
    }
  };

  const validador = validadores[nomeEntidade] || (() => []);

  registros.forEach(registro => {
    const erros = validador(registro);
    if (erros.length > 0) {
      invalidos.push({
        linha_numero: registro.linha_numero,
        erros
      });
    } else {
      validos.push(registro);
    }
  });

  return { validos, invalidos };
}