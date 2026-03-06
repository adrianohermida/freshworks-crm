import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AlertasPrazos({ tarefas = [] }) {
  const getDiasRestantes = (data) => {
    if (!data) return null;
    const hoje = new Date();
    const prazo = new Date(data);
    return Math.ceil((prazo - hoje) / (1000 * 60 * 60 * 24));
  };

  // Filtrar tarefas com alerta
  const tarefasAlerta = tarefas.filter(t => {
    const dias = getDiasRestantes(t.dataPrazo);
    return dias !== null && dias <= 7;
  }).sort((a, b) => getDiasRestantes(a.dataPrazo) - getDiasRestantes(b.dataPrazo));

  if (tarefasAlerta.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Alertas de Prazos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-6">Nenhum prazo crítico</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-orange-900">
          <AlertTriangle className="w-5 h-5" />
          Alertas de Prazos ({tarefasAlerta.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tarefasAlerta.map(tarefa => {
            const dias = getDiasRestantes(tarefa.dataPrazo);
            const urgencia = dias < 0 ? 'vencido' : dias <= 3 ? 'critico' : 'aviso';

            const coresUrgencia = {
              vencido: 'bg-red-100 text-red-800 border-red-300',
              critico: 'bg-orange-100 text-orange-800 border-orange-300',
              aviso: 'bg-yellow-100 text-yellow-800 border-yellow-300'
            };

            return (
              <div
                key={tarefa.id}
                className={`p-3 rounded-lg border ${coresUrgencia[urgencia]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tarefa.numeroProcesso}</p>
                    <p className="text-xs opacity-90 mt-1">{tarefa.titulo}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm">
                      {dias < 0 ? `${Math.abs(dias)}d atrás` : `${dias}d`}
                    </p>
                    {tarefa.dataPrazo && (
                      <p className="text-xs opacity-75">
                        {format(new Date(tarefa.dataPrazo), 'dd/MM')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}