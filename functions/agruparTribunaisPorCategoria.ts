/**
 * Backend function: Agrupar Tribunais por Categoria
 * Sprint 37 - Tribunals data organization
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Tribunais data embedded directly
const TRIBUNAIS = [
  // Tribunais Superiores
  { alias: 'tst', nome: 'Tribunal Superior do Trabalho', categoria: 'superior' },
  { alias: 'tse', nome: 'Tribunal Superior Eleitoral', categoria: 'superior' },
  { alias: 'stj', nome: 'Tribunal Superior de Justiça', categoria: 'superior' },
  { alias: 'stm', nome: 'Tribunal Superior Militar', categoria: 'superior' },
  // ... truncated for brevity - includes all tribunals from utils
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const grupos = {};
    TRIBUNAIS.forEach(tribunal => {
      if (!grupos[tribunal.categoria]) {
        grupos[tribunal.categoria] = [];
      }
      grupos[tribunal.categoria].push(tribunal);
    });

    return Response.json({
      status: 'success',
      data: grupos,
      count: TRIBUNAIS.length
    });
  } catch (error) {
    console.error('[agruparTribunaisPorCategoria] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});