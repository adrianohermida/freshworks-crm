import React from 'react';
import { formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Calendar, Trash2, Edit2, CheckCircle } from 'lucide-react';

export default function DeadlineCard({ deadline, onEdit, onDelete, onComplete }) {
  const deadlineDate = new Date(deadline.deadline_date);
  const isOverdue = isPast(deadlineDate) && !isToday(deadlineDate);
  const isDueToday = isToday(deadlineDate);
  const isDueTomorrow = isTomorrow(deadlineDate);
  
  const statusColors = {
    pending: 'bg-blue-50 border-blue-200',
    alert: 'bg-yellow-50 border-yellow-200',
    overdue: 'bg-red-50 border-red-200',
    completed: 'bg-green-50 border-green-200',
  };

  const priorityBadgeColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const daysUntil = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`border rounded-lg p-4 ${statusColors[deadline.status]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{deadline.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{deadline.notes}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(deadline)}
            className="p-2 hover:bg-white rounded transition"
            title="Editar"
          >
            <Edit2 size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(deadline.id)}
            className="p-2 hover:bg-white rounded transition"
            title="Deletar"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Calendar size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {isDueToday ? '🔴 Vence hoje' : isDueTomorrow ? '🟡 Vence amanhã' : isOverdue ? '⚠️ VENCIDO' : `Vence em ${daysUntil} dias`}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityBadgeColors[deadline.priority]}`}>
            {deadline.priority === 'high' ? '🔴 Alta' : deadline.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'} Prioridade
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800">
            {deadline.status === 'completed' ? '✓ Completo' : deadline.status === 'overdue' ? 'Vencido' : deadline.status === 'alert' ? 'Alerta' : 'Pendente'}
          </span>
        </div>
        {deadline.status !== 'completed' && (
          <button
            onClick={() => onComplete(deadline)}
            className="text-sm px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
          >
            <CheckCircle size={14} className="inline mr-1" /> Marcar completo
          </button>
        )}
      </div>
    </div>
  );
}