import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { useAllTPUMetrics } from './useTPUSynchronization';

const TABELAS_INFO = {
  classes: { label: 'Classes Processuais', icon: '📋', cor: 'blue' },
  assuntos: { label: 'Assuntos Processuais', icon: '📚', cor: 'purple' },
  movimentos: { label: 'Movimentos Processuais', icon: '⚙️', cor: 'amber' },
  documentos: { label: 'Documentos Processuais', icon: '📄', cor: 'green' }
};

export default function TPUStatusDashboard() {
  const { metricas, isLoading } = useAllTPUMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Database className="w-5 h-5 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-600">Carregando status...</span>
        </CardContent>
      </Card>
    );
  }

  const total = Object.values(metricas).reduce((sum, m) => sum + (m.total || 0), 0);
  const sinc = Object.values(metricas).reduce((sum, m) => sum + (m.local_count || 0), 0);
  const progresso = total > 0 ? Math.round((sinc / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Status Geral */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Status Geral TPU</span>
            <Badge variant={progresso === 100 ? 'default' : 'outline'}>
              {progresso}% Sincronizado
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={progresso} className="h-2" />
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
            <div>
              <p className="font-medium">{sinc.toLocaleString('pt-BR')}</p>
              <p>Sincronizados</p>
            </div>
            <div>
              <p className="font-medium">{total.toLocaleString('pt-BR')}</p>
              <p>Total CNJ</p>
            </div>
            <div>
              <p className="font-medium">{(total - sinc).toLocaleString('pt-BR')}</p>
              <p>Faltam</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Por Tabela */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(TABELAS_INFO).map(([tipo, info]) => {
          const m = metricas[tipo] || {};
          const localCount = m.local_count || 0;
          const total = m.total || 0;
          const prog = total > 0 ? Math.round((localCount / total) * 100) : 0;

          return (
            <Card key={tipo} className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{info.icon} {info.label}</span>
                  {prog === 100 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : prog > 0 ? (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={prog} className="h-1.5" />
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{localCount.toLocaleString('pt-BR')} / {total.toLocaleString('pt-BR')}</span>
                  <span className="font-medium">{prog}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}