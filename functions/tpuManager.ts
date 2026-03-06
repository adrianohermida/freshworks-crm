import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * 📚 TPU Manager - Biblioteca Centralizada + Gerenciamento
 * Consolidação completa com CRUD para edição/correção de dados
 */

// ============ VALIDAÇÕES ============
function validateCNJ(cnj_number) {
  const pattern = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{5}\.\d{7}$/;
  return pattern.test(cnj_number);
}

function parseCNJ(cnj_number) {
  if (!validateCNJ(cnj_number)) return null;
  
  const clean = cnj_number.replace(/\D/g, '');
  const [num, dd, yyyy, seg, trib, orig, ano] = [
    clean.slice(0, 7),
    clean.slice(7, 9),
    clean.slice(9, 13),
    clean.slice(13, 14),
    clean.slice(14, 19),
    clean.slice(19, 20),
    clean.slice(20, 27)
  ];

  return { numero_sequencial: num, dd, ano: yyyy, segmento: seg, tribunal: trib, origem: orig, ano_dist: ano };
}

// ============ MAPEAMENTOS ============
const TRIBUNALS = {
  '00001': { nome: 'STF', sigla: 'STF', nivel: 'superior', categoria: 'superior' },
  '00002': { nome: 'STJ', sigla: 'STJ', nivel: 'superior', categoria: 'superior' },
  '00003': { nome: 'TST', sigla: 'TST', nivel: 'superior', categoria: 'trabalho' },
  '00011': { nome: 'TRF 1ª', sigla: 'TRF1', nivel: '2º_grau', categoria: 'federal' },
  '00012': { nome: 'TRF 2ª', sigla: 'TRF2', nivel: '2º_grau', categoria: 'federal' },
  '00013': { nome: 'TRF 3ª', sigla: 'TRF3', nivel: '2º_grau', categoria: 'federal' },
  '00035': { nome: 'TJSP', sigla: 'TJSP', nivel: '2º_grau', categoria: 'estadual' }
};

const SEGMENTS = {
  '1': 'Judiciário',
  '2': 'MPU',
  '3': 'Conselho',
  '4': 'OAB'
};

// ============ FUNÇÕES CORE ============
function enrichProcess(processData) {
  if (!processData.cnj_number) return processData;
  
  const parsed = parseCNJ(processData.cnj_number);
  if (!parsed) return processData;
  
  const tribunalInfo = TRIBUNALS[parsed.tribunal] || { nome: 'Desconhecido', sigla: 'XX' };
  
  return {
    ...processData,
    _parsed: {
      cnj_parts: parsed,
      tribunal_info: tribunalInfo,
      segment: SEGMENTS[parsed.segmento] || 'Desconhecido'
    }
  };
}

function classifyMovement(desc) {
  const rules = {
    sentenca: ['sentença', 'condenado', 'absolvido'],
    recurso: ['recurso', 'apelação', 'agravo'],
    audiencia: ['audiência', 'julgamento'],
    intimacao: ['intimação', 'citação'],
    pubicacao: ['publicação', 'diário']
  };
  
  const lower = desc.toLowerCase();
  for (const [type, keywords] of Object.entries(rules)) {
    if (keywords.some(k => lower.includes(k))) return type;
  }
  return 'outro';
}

// ============ API REST ============
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    // ===== LEITURA =====
    if (action === 'get_process') {
      const process = await base44.entities.Process.list()
        .then(list => list.find(p => p.cnj_number === data.cnj_number));
      return Response.json({ success: true, data: enrichProcess(process || {}) });
    }

    if (action === 'list_processes') {
      const processes = await base44.entities.Process.list();
      return Response.json({ 
        success: true, 
        data: processes.map(enrichProcess),
        count: processes.length 
      });
    }

    if (action === 'get_tribunal_info') {
      return Response.json({ 
        success: true, 
        data: TRIBUNALS[data.tribunal_code] || { nome: 'Desconhecido' }
      });
    }

    // ===== CRIAÇÃO =====
    if (action === 'create_process') {
      if (!validateCNJ(data.cnj_number)) {
        return Response.json({ error: 'Invalid CNJ format' }, { status: 400 });
      }

      const newProcess = await base44.entities.Process.create({
        cnj_number: data.cnj_number,
        title: data.title || '',
        status: 'active',
        notes: data.notes || '',
        ...enrichProcess(data)._parsed
      });

      return Response.json({ success: true, data: enrichProcess(newProcess) });
    }

    // ===== EDIÇÃO/CORREÇÃO =====
    if (action === 'update_process') {
      const { process_id, updates } = data;

      // Validar CNJ se for alterado
      if (updates.cnj_number && !validateCNJ(updates.cnj_number)) {
        return Response.json({ error: 'Invalid CNJ format' }, { status: 400 });
      }

      const updated = await base44.entities.Process.update(process_id, updates);
      
      await base44.entities.Analytics.create({
        user_id: user.email,
        event_type: 'process_updated',
        entity_type: 'process',
        entity_id: process_id,
        action: `Processo corrigido: ${JSON.stringify(updates)}`,
        timestamp: new Date().toISOString(),
        status: 'success'
      });

      return Response.json({ success: true, data: enrichProcess(updated) });
    }

    // ===== BULK EDIT =====
    if (action === 'bulk_update_processes') {
      const { filter, updates } = data;
      
      const processes = await base44.entities.Process.list()
        .then(list => list.filter(p => {
          if (filter.status) return p.status === filter.status;
          if (filter.tribunal) return p.parsed_tribunal === filter.tribunal;
          return true;
        }));

      const results = [];
      for (const process of processes) {
        const updated = await base44.entities.Process.update(process.id, updates);
        results.push(updated);
      }

      return Response.json({ 
        success: true, 
        updated_count: results.length,
        data: results.map(enrichProcess)
      });
    }

    // ===== VALIDAÇÃO =====
    if (action === 'validate_cnj') {
      const isValid = validateCNJ(data.cnj_number);
      const parsed = isValid ? parseCNJ(data.cnj_number) : null;
      
      return Response.json({
        success: true,
        is_valid: isValid,
        parsed: parsed,
        tribunal_info: parsed ? TRIBUNALS[parsed.tribunal] : null
      });
    }

    // ===== ENRIQUECIMENTO =====
    if (action === 'enrich_processes') {
      const processes = await base44.entities.Process.list();
      const enriched = processes.map(p => enrichProcess(p));
      
      for (const proc of enriched) {
        if (proc._parsed) {
          await base44.entities.Process.update(proc.id, {
            parsed_tribunal: proc._parsed.tribunal_info.sigla,
            parsed_segment: proc._parsed.segment
          });
        }
      }

      return Response.json({ 
        success: true, 
        enriched_count: enriched.length 
      });
    }

    // ===== ANALYTICS =====
    if (action === 'get_stats') {
      const processes = await base44.entities.Process.list();
      const byTribunal = processes.reduce((acc, p) => {
        const tribunal = p.parsed_tribunal || 'unknown';
        acc[tribunal] = (acc[tribunal] || 0) + 1;
        return acc;
      }, {});

      return Response.json({
        success: true,
        stats: {
          total_processes: processes.length,
          active: processes.filter(p => p.status === 'active').length,
          synced: processes.filter(p => p.synced_at).length,
          by_tribunal: byTribunal
        }
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[tpuManager]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ============ EXPORTAÇÕES ============
export const TPU = {
  validate: validateCNJ,
  parse: parseCNJ,
  enrich: enrichProcess,
  classify: classifyMovement,
  TRIBUNALS,
  SEGMENTS
};

export default TPU;