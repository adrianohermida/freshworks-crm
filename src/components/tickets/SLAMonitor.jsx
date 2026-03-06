import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { differenceInHours, differenceInMinutes } from 'date-fns';

export default function SLAMonitor({ tickets }) {
  const SLA_HOURS = {
    urgent: 1,
    high: 4,
    medium: 8,
    low: 24
  };

  const getSLAStatus = (ticket) => {
    if (ticket.status === 'closed' || ticket.status === 'resolved') {
      return { status: 'completed', color: 'bg-green-100 text-green-800', icon: '✓' };
    }

    const now = new Date();
    const createdDate = new Date(ticket.created_date);
    const hoursElapsed = differenceInHours(now, createdDate);
    const slaHours = SLA_HOURS[ticket.priority] || 24;

    if (hoursElapsed >= slaHours) {
      return { status: 'breached', color: 'bg-red-100 text-red-800', icon: '⚠️' };
    }

    const percentageUsed = (hoursElapsed / slaHours) * 100;
    if (percentageUsed >= 80) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', icon: '⏱️' };
    }

    return { status: 'healthy', color: 'bg-green-100 text-green-800', icon: '✓' };
  };

  const getTimeRemaining = (ticket) => {
    const now = new Date();
    const createdDate = new Date(ticket.created_date);
    const hoursElapsed = differenceInHours(now, createdDate);
    const slaHours = SLA_HOURS[ticket.priority] || 24;
    const hoursRemaining = slaHours - hoursElapsed;

    if (hoursRemaining <= 0) {
      const minutesOver = Math.abs(differenceInMinutes(now, new Date(createdDate.getTime() + slaHours * 3600000)));
      return `Vencido há ${minutesOver > 60 ? Math.floor(minutesOver / 60) + 'h' : minutesOver + 'm'}`;
    }

    return `${Math.round(hoursRemaining)}h restantes`;
  };

  const slaTickets = tickets
    .filter(t => t.status !== 'closed')
    .map(ticket => ({
      ...ticket,
      slaStatus: getSLAStatus(ticket)
    }))
    .sort((a, b) => {
      if (a.slaStatus.status === 'breached') return -1;
      if (b.slaStatus.status === 'breached') return 1;
      return 0;
    });

  const breachedCount = slaTickets.filter(t => t.slaStatus.status === 'breached').length;
  const warningCount = slaTickets.filter(t => t.slaStatus.status === 'warning').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Monitoramento de SLA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Vencidos</p>
            <p className="text-2xl font-bold text-red-600">{breachedCount}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Aviso</p>
            <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">OK</p>
            <p className="text-2xl font-bold text-green-600">
              {slaTickets.length - breachedCount - warningCount}
            </p>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {slaTickets.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum ticket aberto</p>
          ) : (
            slaTickets.slice(0, 10).map(ticket => (
              <div
                key={ticket.id}
                className={`p-3 rounded-lg border-l-4 ${ticket.slaStatus.color}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{ticket.subject}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {ticket.customer_name} • {ticket.priority}
                    </p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <Badge variant="outline" className="text-xs mb-1">
                      {getTimeRemaining(ticket)}
                    </Badge>
                    <span className="text-lg">{ticket.slaStatus.icon}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {slaTickets.length > 10 && (
          <p className="text-xs text-gray-500 text-center">
            +{slaTickets.length - 10} tickets
          </p>
        )}
      </CardContent>
    </Card>
  );
}