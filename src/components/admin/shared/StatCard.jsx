import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className = ''
}) {
  const isTrendingUp = trend === 'up';
  const TrendIcon = isTrendingUp ? TrendingUp : TrendingDown;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
            <Icon className="w-6 h-6 text-cyan-600" />
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${isTrendingUp ? 'text-green-600' : 'text-red-600'}`}>
          <TrendIcon className="w-4 h-4" />
          {trendValue}
        </div>
      )}
    </Card>
  );
}