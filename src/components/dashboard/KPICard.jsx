import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function KPICard({ icon, label, value, color, textColor, sublabel }) {
  return (
    <Card className={`${color} border-0`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</p>
            <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
            {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
          </div>
          <div className={`${textColor} opacity-20`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}