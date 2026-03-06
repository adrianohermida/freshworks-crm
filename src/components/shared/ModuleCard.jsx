import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ModuleCardHeader({ title, icon: Icon, action, subtitle }) {
  return (
    <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-cyan-600" />}
          <div>
            <CardTitle className="text-base md:text-lg">{title}</CardTitle>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
    </CardHeader>
  );
}

export function ModuleCardContent({ children, className = '' }) {
  return (
    <CardContent className={`pt-4 ${className}`}>
      {children}
    </CardContent>
  );
}

export default function ModuleCard({ title, icon, action, subtitle, children, className = '' }) {
  return (
    <Card className={`border-gray-200 dark:border-gray-700 ${className}`}>
      <ModuleCardHeader title={title} icon={icon} action={action} subtitle={subtitle} />
      <ModuleCardContent>{children}</ModuleCardContent>
    </Card>
  );
}