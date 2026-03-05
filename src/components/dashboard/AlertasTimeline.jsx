import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, CheckCircle2, Clock, Zap, Loader2 } from 'lucide-react';

export default function AlertasTimeline() {
  const [filtroSeveridade, setFiltroSeveridade] = useState('todos');

  // Buscar alertas
  const { data: alertas = [], isLoading } = useQuery({
    queryKey: ['alertas-timeline'],
    queryFn: () => base44.entities.Alerta.list('-dataOcorrencia', 50)
  });

  const filtrados = alertas
    .filter(a => filtroSeveridade === 'todos' || a.severidade === filtroSeveridade)
    .sort((a, b) => new Date(b.dataOcorrencia) - new Date(a.dataOcorrencia));

  const icons = {
    prazo: '⏰',
    movimentacao: '📬',
    documento: '📄',
    audiencia: '⚖️',
    intimacao: '📨',
    vencimento: '⏳',
    importante: '⭐',
    informacao: 'ℹ️'
  };

  const colors = {
    critica: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    alta: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    media: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    baixa: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' }
  };

  const getStatusIcon = (alerta) => {
    if (alerta.resolvido) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (alerta.lido) return <Clock className="w-5 h-5 text-blue-600" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Timeline de Alertas
          </CardTitle>
          <select
            value={filtroSeveridade}
            onChange={(e) => setFiltroSeveridade(e.target.value)}
            className="text-sm px-2 py-1 border rounded"
          >
            <option value="todos">Todas severidades</option>
            <option value="critica">Crítico</option>
            <option value="alta">Alto</option>
            <option value="media">Médio</option>
            <option value="baixa">Baixo</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {filtrados.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum alerta encontrado</p>
        ) : (
          <div className="space-y-4">
            {filtrados.map((alerta, idx) => {
              const color = colors[alerta.severidade] || colors.baixa;
              
              return (
                <div key={alerta.id} className="flex gap-4">
                  {/* Linha temporal */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center border-2 ${color.border}`}>
                      {getStatusIcon(alerta)}
                    </div>
                    {idx !== filtrados.length - 1 && (
                      <div className="w-1 h-16 bg-gray-200 my-2" />
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">
                          {icons[alerta.tipo] && <span className="mr-1">{icons[alerta.tipo]}</span>}
                          {alerta.titulo}
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5">{alerta.descricao}</p>
                      </div>
                      <Badge className={`${color.bg} ${color.text} whitespace-nowrap`}>
                        {alerta.severidade}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>
                        {format(new Date(alerta.dataOcorrencia), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                      {alerta.numeroProcesso && (
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {alerta.numeroProcesso}
                        </span>
                      )}
                      {alerta.resolvido && (
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          ✓ Resolvido
                        </Badge>
                      )}
                      {alerta.lido && !alerta.resolvido && (
                        <Badge variant="outline">✓ Lido</Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}