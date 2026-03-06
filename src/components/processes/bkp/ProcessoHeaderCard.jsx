/**
 * ProcessoHeaderCard - Header gradient com info principal do processo
 */
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Scale, User, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { STATUS_CONFIG, TIPO_CONFIG } from './ProcessoCard';

export default function ProcessoHeaderCard({ processo, showCliente = true }) {
  const statusCfg = STATUS_CONFIG[processo.status] || STATUS_CONFIG.aberto;
  const tipoCfg = TIPO_CONFIG[processo.tipo] || TIPO_CONFIG.cejusc;
  const Icon = statusCfg.icon;

  return (
    <div className="bg-gradient-to-r from-[#212373] to-[#1a1956] text-white rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge className={`${tipoCfg.color} text-xs`}>{tipoCfg.label}</Badge>
            <Badge className={`${statusCfg.color} text-xs flex items-center gap-1`}>
              <Icon className="w-3 h-3" />{statusCfg.label}
            </Badge>
            {processo.nivel_sigilo > 0 && (
              <Badge className="bg-red-500/20 text-red-200 border-red-400/30 text-xs">🔒 Sigiloso</Badge>
            )}
            {processo.ultima_sincronizacao && (
              <Badge className="bg-white/10 border-white/30 text-white text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Sincronizado
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-bold font-mono truncate">{processo.numero_processo}</h1>
          {processo.descricao && (
            <p className="text-white/70 text-sm mt-1 line-clamp-2">{processo.descricao}</p>
          )}
          {processo.classe_judicial && (
            <p className="text-white/50 text-xs mt-1">📋 {processo.classe_judicial}</p>
          )}
        </div>

        <div className="text-sm text-white/70 space-y-1 text-right flex-shrink-0">
          {processo.data_abertura && (
            <p className="flex items-center gap-1 justify-end text-xs">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(processo.data_abertura + 'T12:00:00'), 'dd/MM/yyyy')}
            </p>
          )}
          {processo.tribunal && (
            <p className="flex items-center gap-1 justify-end text-xs">
              <Scale className="w-3.5 h-3.5" />
              {processo.tribunal}
            </p>
          )}
          {showCliente && processo.cliente_nome && (
            <p className="flex items-center gap-1 justify-end text-xs">
              <User className="w-3.5 h-3.5" />
              {processo.cliente_nome}
            </p>
          )}
          {processo.orgao_julgador && (
            <p className="text-white/40 text-xs">
              {typeof processo.orgao_julgador === 'string'
                ? processo.orgao_julgador
                : processo.orgao_julgador?.nome}
            </p>
          )}
          {processo.ultima_sincronizacao && (
            <p className="text-white/40 text-xs flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" />
              {format(new Date(processo.ultima_sincronizacao), "dd/MM HH:mm", { locale: ptBR })}
            </p>
          )}
        </div>
      </div>

      {processo.data_proxima_audiencia && (
        <div className="mt-3 bg-amber-400/20 border border-amber-300/30 rounded-lg px-3 py-2 inline-flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span className="text-sm text-amber-100">
            Próxima audiência: <strong>
              {format(new Date(processo.data_proxima_audiencia + 'T12:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}