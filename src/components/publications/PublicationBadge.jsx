import React from 'react';
import { CheckCircle2, Clock, Archive } from 'lucide-react';

const statusConfig = {
  pending: {
    bg: 'bg-blue-50 dark:bg-blue-900',
    border: 'border-blue-200 dark:border-blue-700',
    text: 'text-blue-800 dark:text-blue-200',
    icon: Clock,
    label: 'Pendente'
  },
  published: {
    bg: 'bg-green-50 dark:bg-green-900',
    border: 'border-green-200 dark:border-green-700',
    text: 'text-green-800 dark:text-green-200',
    icon: CheckCircle2,
    label: 'Publicado'
  },
  archived: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-800 dark:text-gray-200',
    icon: Archive,
    label: 'Arquivado'
  }
};

export default function PublicationBadge({ status = 'pending' }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      <Icon className={`w-4 h-4 ${config.text}`} aria-hidden="true" />
      <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
    </div>
  );
}