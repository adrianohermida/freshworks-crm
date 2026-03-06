import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, MessageSquare, Frown, Meh, Smile } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
};

const sentimentIcons = {
  positive: Smile,
  neutral: Meh,
  negative: Frown
};

export default function TicketCard({ ticket, onAnalyze }) {
  const navigate = useNavigate();

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={() => navigate(createPageUrl('TicketDetail') + '?id=' + ticket.id)}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(createPageUrl('TicketDetail') + '?id=' + ticket.id);
        }
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-base line-clamp-2">{ticket.subject}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{ticket.customer_name}</p>
          </div>
          {ticket.ai_sentiment && 
            React.createElement(sentimentIcons[ticket.ai_sentiment], {
              className: 'w-6 h-6 text-turquoise-600',
              'aria-label': `Sentimento: ${ticket.ai_sentiment}`
            })
          }
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Badge className={statusColors[ticket.status]}>
            {ticket.status}
          </Badge>
          <Badge className={priorityColors[ticket.priority]}>
            {ticket.priority}
          </Badge>
        </div>

        {ticket.ai_summary && (
          <p className="text-sm text-gray-700 line-clamp-2">{ticket.ai_summary}</p>
        )}

        <div className="flex gap-2 pt-2">
          {!ticket.ai_summary && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze(ticket.id);
              }}
              className="gap-2 flex-1"
            >
              <Zap className="w-4 h-4" />
              Analisar com IA
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => e.stopPropagation()}
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Responder
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {format(new Date(ticket.created_date), 'PPP p', { locale: ptBR })}
        </p>
      </CardContent>
    </Card>
  );
}