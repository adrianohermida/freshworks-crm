import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsGrid({ stats = {} }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(stats).map(([key, { label, value, color = 'blue' }]) => (
        <Card key={key} className="dark:bg-slate-900 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
              {value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}