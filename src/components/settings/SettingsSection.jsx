import React from 'react';
import { Card } from '@/components/ui/card';

export default function SettingsSection({ title, children }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      <Card>{children}</Card>
    </div>
  );
}