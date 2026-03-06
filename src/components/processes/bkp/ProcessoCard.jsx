import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, AlertCircle, CheckCircle, X, User, Scale, ChevronRight, ChevronDown, Trash2, FileText, ExternalLink } from 'lucide-react';
import ProcessoTimeline from './ProcessoTimeline';
import ProconWorkflow from './ProconWorkflow';
import ProconDocumentUpload from './ProconDocumentUpload';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export const STATUS_CONFIG = {
  aberto:       { color: 'bg-blue-100 text-blue-800',   icon: AlertCircle, label: 'Aberto' },
  em_audiencia: { color: 'bg-yellow-100 text-yellow-800', icon: Calendar,   label: 'Em Audiência' },
  acordo:       { color: 'bg-green-100 text-green-800',  icon: CheckCircle, label: 'Acordo' },
  cancelado:    { color: 'bg-red-100 text-red-800',      icon: X,           label: 'Cancelado' },
  finalizado:   { color: 'bg-slate-100 text-slate-800',  icon: CheckCircle, label: 'Finalizado' },
};

export const TIPO_CONFIG = {
  cejusc: { color: 'bg-indigo-100 text-indigo-800', label: 'CEJUSC' },
  procon: { color: 'bg-orange-100 text-orange-800', label: 'PROCON' },
};

export default function ProcessoCard({ processo, showCliente = false, showConsultor = false, onEdit, onView, onDelete }) {
  const [showTimeline, setShowTimeline] = useState(false);
  const conf = STATUS_CONFIG[processo.status] || STATUS_CONFIG.aberto;
  const tipoConf = TIPO_CONFIG[processo.tipo] || TIPO_CONFIG.cejusc;
  const Icon = conf.icon;
  const hasMovimentos = processo.movimentos?.length > 0;
  const isProcon = processo.tipo === 'procon';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className={tipoConf.color + ' text-xs'}>{tipoConf.label}</Badge>
              <h3 className="font-mono font-semibold text-slate-900 text-sm truncate">
                {processo.numero_processo}
              </h3>
              <Badge className={conf.color + ' text-xs'}>
                <Icon className="w-3 h-3 mr-1" />
                {conf.label}
              </Badge>
              {processo.tribunal && (
                <Badge variant="outline" className="text-xs">{processo.tribunal}</Badge>
              )}
              {processo.sistema_processual?.nome && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">{processo.sistema_processual.nome}</Badge>
              )}
              {processo.nivel_sigilo > 0 && (
                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">🔒 Sigiloso</Badge>
              )}
            </div>

            {/* Descrição */}
            {processo.descricao && (
              <p className="text-sm text-slate-600 mb-2 line-clamp-2">{processo.descricao}</p>
            )}

            {/* Assuntos */}
            {processo.assuntos?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {processo.assuntos.slice(0, 3).map((a, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {a}
                  </span>
                ))}
                {processo.assuntos.length > 3 && (
                  <span className="text-xs text-slate-400">+{processo.assuntos.length - 3}</span>
                )}
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              {processo.data_abertura && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(processo.data_abertura), 'dd/MM/yyyy')}
                </span>
              )}
              {processo.tribunal && (
                <span className="flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  {processo.tribunal}
                </span>
              )}
              {showCliente && processo.cliente_nome && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {processo.cliente_nome}
                </span>
              )}
              {showConsultor && processo.consultor_responsavel_nome && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {processo.consultor_responsavel_nome}
                </span>
              )}
              {processo.data_proxima_audiencia && (
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  Próx. audiência: {format(new Date(processo.data_proxima_audiencia), 'dd/MM/yyyy')}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1 flex-shrink-0">
            {/* Link para detalhe */}
            <Link to={createPageUrl(`ProcessoDetalhe?id=${processo.id}`)}>
              <Button size="sm" variant="outline" className="text-xs gap-1 w-full">
                <ExternalLink className="w-3 h-3" /> Detalhes
              </Button>
            </Link>

            {(hasMovimentos || isProcon) && (
              <Button size="sm" variant="ghost" onClick={() => setShowTimeline(t => !t)} title={isProcon ? 'Ver workflow e documentos' : 'Ver movimentações'}>
                {isProcon
                  ? <FileText className={`w-4 h-4 transition-transform ${showTimeline ? 'text-orange-500' : ''}`} />
                  : <ChevronDown className={`w-4 h-4 transition-transform ${showTimeline ? 'rotate-180' : ''}`} />
                }
              </Button>
            )}
            {onView && (
              <Button size="sm" variant="ghost" onClick={() => onView(processo)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            {onEdit && (
              <Button size="sm" variant="outline" className="text-xs" onClick={() => onEdit(processo)}>
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-red-500 hover:bg-red-50"
                onClick={() => onDelete(processo.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Timeline expansível (CEJUSC) */}
        {showTimeline && hasMovimentos && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <ProcessoTimeline movimentos={processo.movimentos} processo={processo} />
          </div>
        )}

        {/* PROCON: Workflow + Documentos */}
        {processo.tipo === 'procon' && showTimeline && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <ProconWorkflow processo={processo} />
            <ProconDocumentUpload processo={processo} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}