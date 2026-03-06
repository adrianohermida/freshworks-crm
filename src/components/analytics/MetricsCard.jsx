import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricsCard({
  title,
  value,
  unit = '',
  trend = null,
  description,
  icon: Icon,
  color = 'cyan'
}) {
  const colorMap = {
    cyan: 'bg-cyan-50 dark:bg-cyan-900 border-l-cyan-500 text-cyan-600',
    green: 'bg-green-50 dark:bg-green-900 border-l-green-500 text-green-600',
    blue: 'bg-blue-50 dark:bg-blue-900 border-l-blue-500 text-blue-600',
    purple: 'bg-purple-50 dark:bg-purple-900 border-l-purple-500 text-purple-600',
    red: 'bg-red-50 dark:bg-red-900 border-l-red-500 text-red-600'
  };

  return (
    <Card className={`p-6 border-l-4 ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {unit && <span className="text-sm text-gray-600 dark:text-gray-400">{unit}</span>}
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{description}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-white dark:bg-gray-800`}>
            <Icon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          {trend > 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">+{trend}%</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-red-600">{trend}%</span>
            </>
          )}
        </div>
      )}
    </Card>
  );
}