import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import crypto from 'node:crypto';

// Função auxiliar para calcular hash
function calcularHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// Função auxiliar para parsear número CNJ
function parseProcessoCNJ(cnj) {
  // Formato: NNNNNNN-DD.AAAA.J.TT.OOOO.SSSSSS
  const regex = /^(\d{7})-(\d{2})\.(\d{4})\.(\d)\.(\d{2})\.(\d{4})\.(\d{6})$/;
  const match = cnj.match(regex);
  
  if (!match) return null;
  
  return {
    numero_sequencial: match[1],
    ano: parseInt(match[3]),
    segmento: match[4],
    tribunal_codigo: match[5],
    origem: match[6],
    classe: match[7]
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cnj_number, data_datajud } = await req.json();

    if (!cnj_number || !data_datajud) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Parsear número CNJ
    const parsed = parseProcessoCNJ(cnj_number);
    if (!parsed) {
      return Response.json({ error: 'Invalid CNJ number format' }, { status: 400 });
    }

    // Calcular hash dos dados
    const novoHash = calcularHash(data_datajud);

    // Verificar se já existe no repositório
    let processoExistente = null;
    try {
      const processos = await base44.entities.ProcessoRepositorio.filter({ cnj_number });
      processoExistente = processos.length > 0 ? processos[0] : null;
    } catch (err) {
      console.log('Processo não encontrado no repositório (primeira sincronização)');
    }

    let resultado = { tipo: 'novo', processo_id: null, mensagem: '' };

    if (processoExistente) {
      // Verificar se houve mudanças
      if (processoExistente.hash_verificacao === novoHash) {
        resultado = {
          tipo: 'duplicata',
          processo_id: processoExistente.id,
          mensagem: 'Processo já existe e não houve mudanças'
        };
      } else {
        // Atualizar processo existente
        await base44.entities.ProcessoRepositorio.update(processoExistente.id, {
          data_verificacao_datajud: new Date().toISOString(),
          hash_verificacao: novoHash,
          datajud_raw_data: data_datajud,
          status_repositorio: 'verificado',
          total_movimentos: data_datajud.movimentos?.length || 0,
          total_partes: data_datajud.partes?.length || 0
        });

        resultado = {
          tipo: 'atualizado',
          processo_id: processoExistente.id,
          mensagem: 'Processo atualizado com novos dados'
        };
      }
    } else {
      // Criar novo registro no repositório
      const novoProcesso = await base44.entities.ProcessoRepositorio.create({
        cnj_number,
        numero_sequencial: parsed.numero_sequencial,
        ano: parsed.ano,
        segmento: parsed.segmento,
        tribunal_codigo: parsed.tribunal_codigo,
        tribunal_nome: data_datajud.tribunal?.nome || 'Desconhecido',
        instancia: data_datajud.instancia || '1grau',
        origem_codigo: parsed.origem,
        origem_nome: data_datajud.origem?.nome || 'Desconhecido',
        classe_id: data_datajud.classe?.id || '',
        classe_nome: data_datajud.classe?.nome || '',
        assunto_id: data_datajud.assunto?.id || '',
        assunto_nome: data_datajud.assunto?.nome || '',
        data_verificacao_datajud: new Date().toISOString(),
        hash_verificacao: novoHash,
        datajud_raw_data: data_datajud,
        status_repositorio: 'verificado',
        total_movimentos: data_datajud.movimentos?.length || 0,
        total_partes: data_datajud.partes?.length || 0,
        sigiloso: data_datajud.sigiloso === 'S' || false
      });

      resultado = {
        tipo: 'novo',
        processo_id: novoProcesso.id,
        mensagem: 'Novo processo adicionado ao repositório'
      };
    }

    // Associar ao usuário (ProcessoUsuario)
    try {
      const associacoes = await base44.entities.ProcessoUsuario.filter({
        processo_cnj: cnj_number,
        usuario_email: user.email
      });

      if (associacoes.length === 0) {
        await base44.entities.ProcessoUsuario.create({
          processo_cnj: cnj_number,
          usuario_email: user.email,
          papel: 'advogado',
          data_adicao: new Date().toISOString(),
          data_ultima_atualizacao: new Date().toISOString()
        });
      } else {
        // Atualizar data de última atualização
        await base44.entities.ProcessoUsuario.update(associacoes[0].id, {
          data_ultima_atualizacao: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Erro ao associar processo ao usuário:', err.message);
    }

    return Response.json({
      success: true,
      resultado,
      metricas: {
        tempo_sincronizacao_ms: Date.now(),
        hash_verificacao: novoHash,
        datajud_campos: Object.keys(data_datajud).length
      }
    });

  } catch (error) {
    console.error('Erro em syncProcessoRepositorio:', error.message);
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});