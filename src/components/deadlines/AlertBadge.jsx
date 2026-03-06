import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const statusConfig = {
  pending: {
    bg: 'bg-blue-50 dark:bg-blue-900',
    border: 'border-blue-200 dark:border-blue-700',
    text: 'text-blue-800 dark:text-blue-200',
    icon: Clock,
    label: 'Pendente'
  },
  alert: {
    bg: 'bg-yellow-50 dark:bg-yellow-900',
    border: 'border-yellow-200 dark:border-yellow-700',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: AlertCircle,
    label: 'Alerta'
  },
  overdue: {
    bg: 'bg-red-50 dark:bg-red-900',
    border: 'border-red-200 dark:border-red-700',
    text: 'text-red-800 dark:text-red-200',
    icon: AlertCircle,
    label: 'Vencido'
  },
  completed: {
    bg: 'bg-green-50 dark:bg-green-900',
    border: 'border-green-200 dark:border-green-700',
    text: 'text-green-800 dark:text-green-200',
    icon: CheckCircle2,
    label: 'Completo'
  }
};

export default function AlertBadge({ status = 'pending', daysUntil, compact = false }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const getLabel = () => {
    if (compact) return config.label;
    if (status === 'overdue') return `${Math.abs(daysUntil)} dias vencido`;
    if (status === 'alert') return `${daysUntil} dias restantes`;
    if (status === 'pending') return `${daysUntil} dias`;
    return config.label;
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}
      role="status"
      aria-label={`Status: ${getLabel()}`}
    >
      <Icon className={`w-4 h-4 ${config.text}`} aria-hidden="true" />
      <span className={`text-xs font-medium ${config.text}`}>{getLabel()}</span>
    </div>
  );
}