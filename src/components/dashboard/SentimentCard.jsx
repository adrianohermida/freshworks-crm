import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Frown, Meh, Smile } from 'lucide-react';

const ICONS = {
  positive: <Smile className="w-5 h-5" />,
  neutral: <Meh className="w-5 h-5" />,
  negative: <Frown className="w-5 h-5" />
};

export default function SentimentCard({ type, count, percentage }) {
  const bgColors = {
    positive: 'bg-green-100 dark:bg-green-900/20',
    neutral: 'bg-blue-100 dark:bg-blue-900/20',
    negative: 'bg-red-100 dark:bg-red-900/20'
  };

  const textColors = {
    positive: 'text-green-600',
    neutral: 'text-blue-600',
    negative: 'text-red-600'
  };

  const labels = {
    positive: 'Positivo',
    neutral: 'Neutro',
    negative: 'Negativo'
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center">
          <div className={`p-3 rounded-full mb-3 ${bgColors[type]}`}>
            <div className={textColors[type]}>
              {ICONS[type]}
            </div>
          </div>
          <p className="text-center font-medium text-sm">{labels[type]}</p>
          <Badge variant="outline" className="mt-2">{percentage}%</Badge>
          <p className="text-xs text-gray-500 mt-2">{count} tickets</p>
        </div>
      </CardContent>
    </Card>
  );
}