import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const MINIMO_EXISTENCIAL = 2500; // Ajustar anualmente conforme salário mínimo

function validarComplianceCNJ(req) {
  return {
    validarDadosSocioeconomicos,
    validarDividas,
    validarCapacidadePagamento,
    calcularMetricasCNJ
  };
}

/**
 * Valida dados socioeconômicos conforme CNJ Anexo II
 */
function validarDadosSocioeconomicos(dados) {
  const erros = [];
  const avisos = [];

  // Validações obrigatórias
  if (!dados.sexo) erros.push("Sexo é obrigatório");
  if (!dados.idade || dados.idade < 18) erros.push("Idade inválida (mínimo 18 anos)");
  if (!dados.profissao) erros.push("Profissão é obrigatória");
  if (!dados.estado_civil) erros.push("Estado civil é obrigatório");
  if (dados.numero_dependentes === undefined) erros.push("Número de dependentes é obrigatório");

  // Validar renda
  if (!dados.renda_individual_mensal) erros.push("Renda individual mensal é obrigatória");
  if (!dados.renda_familiar_mensal) erros.push("Renda familiar mensal é obrigatória");

  if (dados.renda_individual_mensal > dados.renda_familiar_mensal) {
    avisos.push("Renda individual não pode ser maior que renda familiar");
  }

  // Validar despesas
  const totalDespesas = calcularTotalDespesas(dados.despesas_mensais || {});
  if (!dados.despesas_mensais || totalDespesas === 0) {
    avisos.push("Preencha ao menos uma despesa mensal");
  }

  // Validar propriedades
  if (dados.imovel_proprio && !dados.imovel_status) {
    erros.push("Especifique se o imóvel é financiado ou quitado");
  }

  if (dados.imovel_proprio && dados.imovel_valor_parcela > 0 && !dados.imovel_data_vencimento) {
    erros.push("Data de vencimento do imóvel é obrigatória");
  }

  if (dados.veiculo_financiado && dados.veiculo_valor_parcela > 0 && !dados.veiculo_data_vencimento) {
    erros.push("Data de vencimento do veículo é obrigatória");
  }

  // Validar dívidas
  if (!dados.total_divida_superendividamento || dados.total_divida_superendividamento === 0) {
    erros.push("Total da dívida é obrigatório");
  }

  if (!dados.numero_credores || dados.numero_credores === 0) {
    erros.push("Número de credores deve ser informado");
  }

  if (dados.causas_dividas.length === 0) {
    avisos.push("Indique ao menos uma causa da dívida");
  }

  return { isValid: erros.length === 0, erros, avisos };
}

/**
 * Valida dívidas conforme Banco Central
 */
function validarDividas(dividas) {
  const erros = [];
  const avisos = [];

  const MODALIDADES_VALIDAS = [
    "cartao_credito_parcelado",
    "cartao_credito_rotativo",
    "cheque_especial",
    "credito_pessoal_consignado_inss",
    "credito_pessoal_consignado_privado",
    "credito_pessoal_consignado_publico",
    "credito_pessoal_nao_consignado",
    "desconto_cheques",
    "financiamento_imobiliario_mercado_prefixado",
    "financiamento_imobiliario_mercado_ipca",
    "financiamento_imobiliario_mercado_tr",
    "financiamento_imobiliario_regulado_prefixado",
    "financiamento_imobiliario_regulado_ipca",
    "financiamento_imobiliario_regulado_tr",
    "aquisicao_veiculos",
    "arrendamento_mercantil",
    "aquisicao_outros_bens"
  ];

  dividas.forEach((divida, idx) => {
    if (!divida.credor) erros.push(`Dívida ${idx + 1}: Credor é obrigatório`);
    if (!divida.valor_divida || divida.valor_divida <= 0) erros.push(`Dívida ${idx + 1}: Valor inválido`);
    if (!divida.modalidade_credito || !MODALIDADES_VALIDAS.includes(divida.modalidade_credito)) {
      erros.push(`Dívida ${idx + 1}: Modalidade de crédito inválida`);
    }

    // Avisos
    if (divida.valor_divida > divida.valor_original && divida.valor_original > 0) {
      avisos.push(`Dívida ${idx + 1}: Saldo devedor > valor original (juros abusivos?)`);
    }

    if (divida.divida_vencida && divida.atraso_dias > 90) {
      avisos.push(`Dívida ${idx + 1}: Atraso > 90 dias (risco de ação judicial)`);
    }
  });

  return { isValid: erros.length === 0, erros, avisos };
}

/**
 * Valida capacidade de pagamento conforme CNJ
 */
function validarCapacidadePagamento(dados, dividas) {
  const erros = [];
  const avisos = [];

  const rendaTotal = (dados.renda_individual_mensal || 0) + (dados.renda_familiar_mensal || 0);
  const despesasTotal = calcularTotalDespesas(dados.despesas_mensais || {});
  const dividasTotal = dividas.reduce((sum, d) => sum + (d.valor_divida || 0), 0);

  // Comprometimento
  const comprometimento = dividasTotal / rendaTotal;
  if (comprometimento > 0.7) {
    erros.push(`❌ Comprometimento de ${(comprometimento * 100).toFixed(1)}% > 70% (superendividado)`);
  } else if (comprometimento > 0.5) {
    avisos.push(`⚠️ Comprometimento de ${(comprometimento * 100).toFixed(1)}% > 50% (alto endividamento)`);
  }

  // Mínimo existencial
  const saldoLivre = rendaTotal - despesasTotal;
  if (saldoLivre < MINIMO_EXISTENCIAL) {
    erros.push(`❌ Saldo livre (R$ ${saldoLivre.toFixed(2)}) < mínimo existencial (R$ ${MINIMO_EXISTENCIAL})`);
  }

  // Capacidade de pagamento
  const capacidadePagamento = Math.max(0, saldoLivre - MINIMO_EXISTENCIAL);
  if (capacidadePagamento === 0) {
    erros.push("❌ Sem capacidade de pagamento após mínimo existencial");
  }

  return {
    isValid: erros.length === 0,
    erros,
    avisos,
    metricas: {
      rendaTotal,
      despesasTotal,
      dividasTotal,
      comprometimento: (comprometimento * 100).toFixed(1),
      saldoLivre,
      capacidadePagamento
    }
  };
}

/**
 * Calcula métricas CNJ
 */
function calcularMetricasCNJ(dados, dividas) {
  const rendaTotal = (dados.renda_individual_mensal || 0) + (dados.renda_familiar_mensal || 0);
  const despesasTotal = calcularTotalDespesas(dados.despesas_mensais || {});
  const dividasTotal = dividas.reduce((sum, d) => sum + (d.valor_divida || 0), 0);

  const saldoLivre = rendaTotal - despesasTotal;
  const comprometimento = dividasTotal / Math.max(rendaTotal, 1);
  const capacidadePagamento = Math.max(0, saldoLivre - MINIMO_EXISTENCIAL);
  const prazoMaiorLiquida = capacidadePagamento > 0 ? Math.ceil(dividasTotal / capacidadePagamento) : 0;

  // Score de risco (0-100)
  let scoreRisco = 0;
  scoreRisco += Math.min(comprometimento * 100, 50); // até 50 pontos
  scoreRisco += saldoLivre < MINIMO_EXISTENCIAL ? 30 : 0; // até 30 pontos
  scoreRisco += dados.em_inadimplentes ? 20 : 0; // até 20 pontos

  return {
    renda_total: rendaTotal,
    despesas_total: despesasTotal,
    dívidas_total: dividasTotal,
    saldo_livre: saldoLivre,
    capacidade_pagamento_mensal: capacidadePagamento,
    comprometimento_percentual: (comprometimento * 100).toFixed(1),
    prazo_quitacao_meses: prazoMaiorLiquida,
    score_risco: Math.min(scoreRisco, 100), // 0-100
    status_superendividamento: comprometimento > 0.7 ? "SIM" : "NÃO"
  };
}

function calcularTotalDespesas(despesas) {
  return Object.values(despesas || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { tipo, dados, dividas } = body;

    if (!tipo) {
      return Response.json({ error: "Tipo de validação obrigatório" }, { status: 400 });
    }

    let resultado;

    if (tipo === "socioeconomico") {
      resultado = validarDadosSocioeconomicos(dados);
    } else if (tipo === "dividas") {
      resultado = validarDividas(dividas || []);
    } else if (tipo === "capacidade_pagamento") {
      resultado = validarCapacidadePagamento(dados, dividas || []);
    } else if (tipo === "metricas") {
      resultado = { metricas: calcularMetricasCNJ(dados, dividas || []) };
    } else if (tipo === "completo") {
      const validSocio = validarDadosSocioeconomicos(dados);
      const validDividas = validarDividas(dividas || []);
      const validCapacidade = validarCapacidadePagamento(dados, dividas || []);
      const metricas = calcularMetricasCNJ(dados, dividas || []);

      resultado = {
        isValid: validSocio.isValid && validDividas.isValid && validCapacidade.isValid,
        socioeconomico: validSocio,
        dividas: validDividas,
        capacidade_pagamento: validCapacidade,
        metricas
      };
    } else {
      return Response.json({ error: "Tipo de validação inválido" }, { status: 400 });
    }

    return Response.json(resultado);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});