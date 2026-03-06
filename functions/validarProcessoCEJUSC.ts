import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const data = payload || {};

    const erros = [];
    const avisos = [];
    let processoDJData = null;

    // 1. VALIDAR CAMPOS OBRIGATÓRIOS
    if (!data.numero_processo || typeof data.numero_processo !== 'string') {
      erros.push({
        campo: 'numero_processo',
        mensagem: 'Número do processo obrigatório e deve ser texto',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!data.data_ajuizamento || typeof data.data_ajuizamento !== 'string') {
      erros.push({
        campo: 'data_ajuizamento',
        mensagem: 'Data de ajuizamento obrigatória (formato: YYYY-MM-DD)',
        code: 'REQUIRED_FIELD'
      });
    }

    // 2. VALIDAR FORMATO CNJ
    if (data.numero_processo && erros.length === 0) {
      const padraoCNJ = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/;
      if (!padraoCNJ.test(data.numero_processo)) {
        erros.push({
          campo: 'numero_processo',
          mensagem: 'Formato CNJ inválido. Esperado: 0001234-56.2024.8.26.0000',
          code: 'INVALID_FORMAT'
        });
      }
    }

    // 3. VALIDAR DATA (se formato válido)
    if (data.data_ajuizamento) {
      try {
        const data_obj = new Date(data.data_ajuizamento);
        if (isNaN(data_obj.getTime())) {
          erros.push({
            campo: 'data_ajuizamento',
            mensagem: 'Data inválida. Use formato: YYYY-MM-DD',
            code: 'INVALID_DATE'
          });
        } else if (data_obj > new Date()) {
          avisos.push({
            campo: 'data_ajuizamento',
            mensagem: 'Data é futura. Verifique se está correta.',
            code: 'FUTURE_DATE'
          });
        }
      } catch (dateErr) {
        erros.push({
          campo: 'data_ajuizamento',
          mensagem: 'Erro ao processar data: ' + dateErr.message,
          code: 'DATE_ERROR'
        });
      }
    }

    // 4. CONSULTAR DATAJUD (se numero_processo válido e CNJ válido)
    if (data.numero_processo && erros.length === 1 && erros[0]?.code === 'INVALID_FORMAT') {
      // Só tem erro de formato, pula DataJud
    } else if (data.numero_processo && !erros.some(e => e.campo === 'numero_processo')) {
      try {
        const apiKey = Deno.env.get('DATAJUD_API_KEY');
        if (!apiKey) {
          avisos.push({
            campo: 'datajud',
            mensagem: 'DataJud não configurado (chave API ausente). Validação offline apenas.',
            code: 'DATAJUD_NOT_CONFIGURED'
          });
        } else {
          // Chamar consultarDataJud (função backend existente)
          try {
            const djResponse = await base44.functions.invoke('consultarDataJud', {
              numero: data.numero_processo
            });

            if (djResponse?.data) {
              processoDJData = djResponse.data;
              
              // Validar se processo existe
              if (!processoDJData || djResponse.data.error) {
                erros.push({
                  campo: 'numero_processo',
                  mensagem: 'Processo não encontrado em DataJud',
                  code: 'DATAJUD_NOT_FOUND'
                });
              } else {
                // Validar tribunal
                if (data.tribunal && data.tribunal.toUpperCase() !== processoDJData.tribunal?.toUpperCase()) {
                  avisos.push({
                    campo: 'tribunal',
                    mensagem: `Tribunal informado (${data.tribunal}) diferente de DataJud (${processoDJData.tribunal})`,
                    code: 'TRIBUNAL_MISMATCH'
                  });
                }
              }
            } else {
              avisos.push({
                campo: 'datajud',
                mensagem: 'Não foi possível validar em DataJud, mas processo pode existir',
                code: 'DATAJUD_TIMEOUT'
              });
            }
          } catch (djErr) {
            avisos.push({
              campo: 'datajud',
              mensagem: 'Erro ao consultar DataJud: ' + djErr.message,
              code: 'DATAJUD_ERROR'
            });
          }
        }
      } catch (djMainErr) {
        console.error('[validarProcessoCEJUSC] Erro DataJud:', djMainErr.message);
        avisos.push({
          campo: 'datajud',
          mensagem: 'Validação offline (DataJud indisponível)',
          code: 'DATAJUD_UNAVAILABLE'
        });
      }
    }

    // 5. VALIDAR TRIBUNAL (se fornecido)
    const tribunaisValidos = ['TJSP', 'TRF1', 'TRF2', 'TRF3', 'TRF4', 'TRF5', 'STF', 'STJ', 'TST', 'TRTSP'];
    if (data.tribunal && !tribunaisValidos.includes(data.tribunal.toUpperCase())) {
      avisos.push({
        campo: 'tribunal',
        mensagem: `Tribunal ${data.tribunal} não está na lista de tribunais conhecidos`,
        code: 'TRIBUNAL_UNKNOWN'
      });
    }

    // 6. VALIDAR PARTES (se fornecido)
    if (data.partes && Array.isArray(data.partes) && data.partes.length === 0) {
      avisos.push({
        campo: 'partes',
        mensagem: 'Lista de partes vazia',
        code: 'EMPTY_PARTES'
      });
    }

    const valido = erros.length === 0;

    const resultado = {
      valido,
      erros,
      avisos,
      datajud: processoDJData ? {
        tribunal: processoDJData.tribunal,
        classe: processoDJData.classe,
        assunto: processoDJData.assunto,
        ultima_movimentacao: processoDJData.ultima_movimentacao
      } : null,
      timestamp: new Date().toISOString(),
      usuario: user.email
    };

    console.log('[validarProcessoCEJUSC] Validação:', {
      numero_processo: data.numero_processo,
      valido,
      erros: erros.length,
      avisos: avisos.length
    });

    return Response.json(resultado);

  } catch (error) {
    console.error('[validarProcessoCEJUSC] Erro fatal:', error.message);
    return Response.json({
      error: error.message,
      valido: false,
      erros: [{
        campo: 'geral',
        mensagem: 'Erro ao validar processo: ' + error.message,
        code: 'VALIDATION_ERROR'
      }],
      avisos: []
    }, { status: 500 });
  }
});