/**
 * ProcessoKPIBar - Cards de métricas reutilizáveis
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertCircle, Clock, CheckCircle, RefreshCw } from 'lucide-react';

export default function ProcessoKPIBar({ kpis, cols = 4 }) {
  const items = [
    { key: 'total',        label: 'Total',         icon: FileText,    color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { key: 'abertos',      label: 'Abertos',       icon: AlertCircle, color: 'text-amber-600',  bg: 'bg-amber-50'  },
    { key: 'emAudiencia',  label: 'Em Audiência',  icon: Clock,       color: 'text-purple-600', bg: 'bg-purple-50' },
    { key: 'acordos',      label: 'Acordos',       icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50'  },
    { key: 'sincronizados',label: 'Sincronizados', icon: RefreshCw,   color: 'text-teal-600',   bg: 'bg-teal-50'   },
  ];

  const filtered = items.filter(i => kpis[i.key] !== undefined).slice(0, cols);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-3`}>
      {filtered.map(({ key, label, icon: Icon, color, bg }) => (
        <Card key={key} className="overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-bold text-slate-900">{kpis[key]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}