import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle2, HelpCircle } from 'lucide-react';

export default function TicketsBoard({ tickets, isLoading }) {
  if (isLoading) {
    return <div className="text-center py-8 text-slate-500">Carregando tickets...</div>;
  }

  const statusIcons = {
    open: <AlertCircle className="w-4 h-4 text-red-500" />,
    pending: <Clock className="w-4 h-4 text-orange-500" />,
    resolved: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    closed: <CheckCircle2 className="w-4 h-4 text-slate-500" />,
    on_hold: <HelpCircle className="w-4 h-4 text-blue-500" />
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const openTickets = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved');

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        {openTickets.length} ticket(s) aberto(s) | Total: {tickets.length}
      </div>
      
      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="pt-6 text-center text-slate-500">
              Nenhum ticket encontrado
            </CardContent>
          </Card>
        ) : (
          tickets.map(ticket => (
            <Card key={ticket.id} className="bg-white dark:bg-slate-800 hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {statusIcons[ticket.status]}
                    <div>
                      <CardTitle className="text-sm">{ticket.subject}</CardTitle>
                      <p className="text-xs text-slate-500 mt-1">#{ticket.freshdesk_id}</p>
                    </div>
                  </div>
                  <Badge className={priorityColors[ticket.priority]}>
                    {ticket.priority}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2 text-xs">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Solicitante:</strong> {ticket.requester_name} ({ticket.requester_email})
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Status:</strong> {ticket.status} • <strong>Tipo:</strong> {ticket.type}
                </p>
                {ticket.agent_name && (
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Agente:</strong> {ticket.agent_name}
                  </p>
                )}
                {ticket.tags?.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {ticket.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}