import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ResponseHistory({ ticket }) {
  if (!ticket.notes) return null;

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-turquoise-600" />
          <h3 className="font-semibold text-lg">Histórico de Respostas</h3>
        </div>
        <div className="bg-slate-50 rounded-lg p-4 text-sm text-gray-700 border border-slate-200">
          {ticket.notes}
        </div>
      </CardContent>
    </Card>
  );
}