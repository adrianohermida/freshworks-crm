/**
 * MovimentacaoEnriquecida
 * Exibe movimentos DataJud com tradução TPU automática.
 * Suporta movimentos de processo.movimentos[] E AndamentoProcessual[].
 */
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { useMovimentoTPU } from './hooks/useMovimentoTPU';

function normalizeMovimento(mov) {
  // Suporta estrutura de processo.movimentos[] (DataJud) e AndamentoProcessual
  return {
    codigo: mov.codigo || mov.movimento_codigo || '',
    nome: mov.nome || mov.movimento_nome || '',
    dataHora: mov.dataHora || mov.data_hora || '',
    orgaoJulgador: mov.orgao_julgador || mov.orgaoJulgador?.nome || '',
    complementos: mov.complementosTabelados || mov.complementos || [],
  };
}

function MovimentoItem({ mov, traduzirMovimento, isTraduzido }) {
  const [expanded, setExpanded] = useState(false);
  const norm = normalizeMovimento(mov);
  const label = traduzirMovimento({ codigo: norm.codigo, nome: norm.nome });
  const traduzido = isTraduzido({ codigo: norm.codigo });
  const temComplementos = norm.complementos.length > 0;

  return (
    <div className="bg-white rounded-lg border border-slate-100 border-l-2 border-l-[#00d9a3] overflow-hidden">
      <div className="flex items-start justify-between gap-2 px-3 py-2.5">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {traduzido ? (
            <BookOpen className="w-3.5 h-3.5 text-[#00897B] flex-shrink-0 mt-0.5" title="Código identificado na tabela TPU/CNJ" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 leading-snug">{label}</p>
            {traduzido && norm.codigo && (
              <span className="text-[10px] text-[#00897B] font-mono">cod. {norm.codigo}</span>
            )}
            {!traduzido && norm.codigo && (
              <span className="text-[10px] text-slate-400 font-mono">cod. {norm.codigo}</span>
            )}
            {norm.orgaoJulgador && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3" />
                {norm.orgaoJulgador}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {norm.dataHora && (
            <span className="text-xs text-slate-400">
              {format(new Date(norm.dataHora), "dd/MM/yy", { locale: ptBR })}
            </span>
          )}
          {traduzido && (
            <Badge className="text-[9px] px-1 py-0 h-4 bg-emerald-50 text-emerald-700 border-emerald-200">TPU</Badge>
          )}
          {temComplementos && (
            <button onClick={() => setExpanded(v => !v)} className="text-slate-400 hover:text-slate-600">
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
      {expanded && temComplementos && (
        <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-1">
          {norm.complementos.map((c, j) => (
            <div key={j} className="text-xs text-slate-600">
              • {typeof c === 'string' ? c : c.nome || JSON.stringify(c)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MovimentacaoEnriquecida({ movimentos = [], compact = false }) {
  const { traduzirMovimento, isTraduzido, totalMapeados } = useMovimentoTPU();

  if (!movimentos.length) return (
    <p className="text-xs text-slate-400 text-center py-4">Nenhuma movimentação registrada.</p>
  );

  return (
    <div className="space-y-2">
      {!compact && (
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {movimentos.length} movimentação{movimentos.length !== 1 ? 'ões' : ''}
          </p>
          {totalMapeados > 0 && (
            <span className="text-[10px] text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {totalMapeados.toLocaleString('pt-BR')} códigos TPU mapeados
            </span>
          )}
        </div>
      )}
      {movimentos.map((mov, i) => (
        <MovimentoItem
          key={i}
          mov={mov}
          traduzirMovimento={traduzirMovimento}
          isTraduzido={isTraduzido}
        />
      ))}
    </div>
  );
}