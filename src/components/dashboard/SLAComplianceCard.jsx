import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function SLAComplianceCard({ tickets = [] }) {
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
  const onTime = resolved.filter(t => {
    if (!t.due_by || !t.resolved_at) return false;
    return new Date(t.resolved_at) <= new Date(t.due_by);
  });

  const complianceRate = resolved.length > 0 
    ? Math.round((onTime.length / resolved.length) * 100) 
    : 0;

  const status = complianceRate >= 95 ? 'excellent' : complianceRate >= 80 ? 'good' : 'warning';
  const statusColor = {
    excellent: 'bg-green-50 border-green-200',
    good: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200'
  }[status];

  const statusIcon = {
    excellent: <CheckCircle2 className="w-6 h-6 text-green-600" />,
    good: <Clock className="w-6 h-6 text-blue-600" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-600" />
  }[status];

  return (
    <Card className={statusColor}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold">{complianceRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {onTime.length} de {resolved.length} resolvidos no prazo
            </p>
          </div>
          {statusIcon}
        </div>
      </CardContent>
    </Card>
  );
}