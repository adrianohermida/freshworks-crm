import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Validação completa de numeração CNJ com enriquecimento de dados institucionais
 * Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
 */

const SEGMENTO_JUDICIARIO = {
  '1': { nome: 'Supremo Tribunal Federal', sigla: 'STF' },
  '2': { nome: 'Conselho Nacional de Justiça', sigla: 'CNJ' },
  '3': { nome: 'Superior Tribunal de Justiça', sigla: 'STJ' },
  '4': { nome: 'Justiça Federal', sigla: 'JF' },
  '5': { nome: 'Justiça do Trabalho', sigla: 'JT' },
  '6': { nome: 'Justiça Eleitoral', sigla: 'JE' },
  '7': { nome: 'Justiça Militar da União', sigla: 'JMU' },
  '8': { nome: 'Justiça Estadual', sigla: 'JE' },
  '9': { nome: 'Justiça Militar Estadual', sigla: 'JME' }
};

const TRIBUNAIS_ESTADUAIS = {
  '01': { sigla: 'TJAC', nome: 'Tribunal de Justiça do Acre', uf: 'AC' },
  '02': { sigla: 'TJAL', nome: 'Tribunal de Justiça de Alagoas', uf: 'AL' },
  '03': { sigla: 'TJAP', nome: 'Tribunal de Justiça do Amapá', uf: 'AP' },
  '04': { sigla: 'TJAM', nome: 'Tribunal de Justiça do Amazonas', uf: 'AM' },
  '05': { sigla: 'TJBA', nome: 'Tribunal de Justiça da Bahia', uf: 'BA' },
  '06': { sigla: 'TJCE', nome: 'Tribunal de Justiça do Ceará', uf: 'CE' },
  '07': { sigla: 'TJDF', nome: 'Tribunal de Justiça do Distrito Federal', uf: 'DF' },
  '08': { sigla: 'TJES', nome: 'Tribunal de Justiça do Espírito Santo', uf: 'ES' },
  '09': { sigla: 'TJGO', nome: 'Tribunal de Justiça de Goiás', uf: 'GO' },
  '10': { sigla: 'TJMA', nome: 'Tribunal de Justiça do Maranhão', uf: 'MA' },
  '11': { sigla: 'TJMT', nome: 'Tribunal de Justiça de Mato Grosso', uf: 'MT' },
  '12': { sigla: 'TJMS', nome: 'Tribunal de Justiça de Mato Grosso do Sul', uf: 'MS' },
  '13': { sigla: 'TJMG', nome: 'Tribunal de Justiça de Minas Gerais', uf: 'MG' },
  '14': { sigla: 'TJPA', nome: 'Tribunal de Justiça do Pará', uf: 'PA' },
  '15': { sigla: 'TJPB', nome: 'Tribunal de Justiça da Paraíba', uf: 'PB' },
  '16': { sigla: 'TJPR', nome: 'Tribunal de Justiça do Paraná', uf: 'PR' },
  '17': { sigla: 'TJPE', nome: 'Tribunal de Justiça de Pernambuco', uf: 'PE' },
  '18': { sigla: 'TJPI', nome: 'Tribunal de Justiça do Piauí', uf: 'PI' },
  '19': { sigla: 'TJRJ', nome: 'Tribunal de Justiça do Rio de Janeiro', uf: 'RJ' },
  '20': { sigla: 'TJRN', nome: 'Tribunal de Justiça do Rio Grande do Norte', uf: 'RN' },
  '21': { sigla: 'TJRS', nome: 'Tribunal de Justiça do Rio Grande do Sul', uf: 'RS' },
  '22': { sigla: 'TJRO', nome: 'Tribunal de Justiça de Rondônia', uf: 'RO' },
  '23': { sigla: 'TJRR', nome: 'Tribunal de Justiça de Roraima', uf: 'RR' },
  '24': { sigla: 'TJSC', nome: 'Tribunal de Justiça de Santa Catarina', uf: 'SC' },
  '25': { sigla: 'TJSP', nome: 'Tribunal de Justiça de São Paulo', uf: 'SP' },
  '26': { sigla: 'TJSE', nome: 'Tribunal de Justiça de Sergipe', uf: 'SE' },
  '27': { sigla: 'TJTO', nome: 'Tribunal de Justiça do Tocantins', uf: 'TO' }
};

function validarDigitoVerificador(numero) {
  const limpo = numero.replace(/\D/g, '');
  if (limpo.length !== 20) return { valido: false, mensagem: 'Número CNJ deve ter 20 dígitos' };

  const dd = limpo.substring(7, 9);
  const oooo = limpo.substring(16, 20);
  const aaaa = limpo.substring(9, 13);

  const origem = `${oooo}${dd}${aaaa}`;
  const resto = parseInt(origem) % 97;
  const digitoCalculado = 98 - resto;
  const digitoInformado = parseInt(dd);

  if (digitoCalculado !== digitoInformado) {
    return {
      valido: false,
      mensagem: `Dígito verificador inválido. Esperado: ${digitoCalculado.toString().padStart(2, '0')}, Informado: ${dd}`
    };
  }

  return { valido: true };
}

function extrairComponentes(numero) {
  const limpo = numero.replace(/\D/g, '');
  return {
    numero_sequencial: limpo.substring(0, 7),
    digito_verificador: limpo.substring(7, 9),
    ano_ajuizamento: limpo.substring(9, 13),
    segmento_judiciario: limpo.substring(13, 14),
    tribunal_codigo: limpo.substring(14, 16),
    codigo_origem: limpo.substring(16, 20)
  };
}

function identificarTribunal(segmento, codigoTribunal) {
  const seg = SEGMENTO_JUDICIARIO[segmento];
  if (!seg) return null;

  const resultado = {
    segmento: seg.nome,
    segmento_codigo: segmento,
    segmento_sigla: seg.sigla,
    tribunal_codigo: codigoTribunal
  };

  // Justiça Estadual
  if (segmento === '8') {
    const tj = TRIBUNAIS_ESTADUAIS[codigoTribunal];
    if (tj) {
      resultado.tribunal_sigla = tj.sigla;
      resultado.tribunal_nome = tj.nome;
      resultado.uf = tj.uf;
    }
  }

  return resultado;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { numero_cnj } = await req.json();
    if (!numero_cnj) {
      return Response.json({ 
        valido: false, 
        erro: 'Número CNJ não fornecido' 
      }, { status: 400 });
    }

    // Validar dígito verificador
    const validacao = validarDigitoVerificador(numero_cnj);
    if (!validacao.valido) {
      return Response.json({
        valido: false,
        erro: validacao.mensagem,
        numero_cnj
      });
    }

    // Extrair componentes
    const componentes = extrairComponentes(numero_cnj);

    // Identificar tribunal
    const tribunal = identificarTribunal(
      componentes.segmento_judiciario,
      componentes.tribunal_codigo
    );

    if (!tribunal) {
      return Response.json({
        valido: true,
        numero_cnj,
        erro: 'Tribunal não identificado',
        componentes
      });
    }

    // Buscar dados institucionais (JuizoCNJ + Serventia)
    let juizo = null;
    let serventia = null;

    try {
      const juizos = await base44.asServiceRole.entities.JuizoCNJ.filter({
        codigo_origem: componentes.codigo_origem,
        tribunal: tribunal.tribunal_sigla
      });

      if (juizos.length > 0) {
        juizo = juizos[0];

        const serventias = await base44.asServiceRole.entities.Serventia.filter({
          numero_serventia: juizo.numero_serventia
        });

        if (serventias.length > 0) {
          serventia = serventias[0];
        }
      }
    } catch (e) {
      console.warn('[validarNumeroCNJ] Erro ao buscar dados:', e.message);
    }

    // Montar resposta
    return Response.json({
      valido: true,
      numero_cnj,
      formatado: `${componentes.numero_sequencial}-${componentes.digito_verificador}.${componentes.ano_ajuizamento}.${componentes.segmento_judiciario}.${componentes.tribunal_codigo}.${componentes.codigo_origem}`,
      tribunal: {
        sigla: tribunal.tribunal_sigla,
        nome: tribunal.tribunal_nome,
        codigo: componentes.tribunal_codigo,
        uf: tribunal.uf
      },
      segmento: {
        codigo: componentes.segmento_judiciario,
        nome: tribunal.segmento,
        sigla: tribunal.segmento_sigla
      },
      tribunal_sigla: tribunal.tribunal_sigla,
      dados_enriquecidos: {
        tribunal_sugerido: tribunal.tribunal_sigla,
        comarca_sugerida: serventia?.municipio || juizo?.comarca || null,
        orgao_julgador_sugerido: juizo?.unidade || null,
        juizo_100_digital: juizo?.juizo_100_digital || false,
        serventia_completa: serventia ? {
          nome: serventia.nome_serventia,
          endereco: serventia.endereco,
          telefone: serventia.telefone,
          email: serventia.email
        } : null
      }
    });

  } catch (error) {
    console.error('[validarNumeroCNJ]', error.message);
    return Response.json({ 
      valido: false, 
      erro: 'Erro interno: ' + error.message 
    }, { status: 500 });
  }
});