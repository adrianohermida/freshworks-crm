import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Filter, Trash2 } from 'lucide-react';
import DealDialog from './DealDialog';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const stageColors = {
  qualification: 'bg-blue-100 text-blue-800',
  proposal: 'bg-indigo-100 text-indigo-800',
  negotiation: 'bg-amber-100 text-amber-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800'
};

export default function DealsFiltered({ deals = [], isLoading, tenantId, contactId }) {
  const [dealsByStage, setDealsByStage] = useState({});
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.FreshsalesLead.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });

  useEffect(() => {
    if (deals.length > 0) {
      const grouped = deals.reduce((acc, deal) => {
        const stage = deal.stage || 'unknown';
        if (!acc[stage]) acc[stage] = [];
        acc[stage].push(deal);
        return acc;
      }, {});
      setDealsByStage(grouped);
    }
  }, [deals]);

  if (isLoading) return <p className="text-slate-500">Carregando deals...</p>;
  if (!deals.length) return <p className="text-slate-500">Nenhum deal encontrado</p>;

  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="space-y-4">
      {contactId && (
        <div className="flex justify-end">
          <DealDialog tenantId={tenantId} contactId={contactId} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500">Total de Deals</div>
            <div className="text-2xl font-bold">{deals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500">Valor Total</div>
            <div className="text-2xl font-bold">R$ {(totalValue / 1000).toFixed(0)}k</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500">Valor Médio</div>
            <div className="text-2xl font-bold">R$ {(totalValue / deals.length / 1000).toFixed(0)}k</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {Object.entries(dealsByStage).map(([stage, stageDeal]) => {
          const stageValue = stageDeal.reduce((sum, d) => sum + (d.value || 0), 0);
          return (
            <Card key={stage}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge className={stageColors[stage] || 'bg-gray-100 text-gray-800'}>
                    {stage}
                  </Badge>
                  <span className="text-sm font-normal text-slate-500">
                    {stageDeal.length} deal{stageDeal.length !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                   {stageDeal.map(deal => (
                     <div key={deal.id} className="flex justify-between items-center p-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                       <div className="flex-1">
                         <div className="font-medium text-slate-900">{deal.title}</div>
                         {deal.probability && (
                           <div className="text-xs text-slate-500">{deal.probability}% probabilidade</div>
                         )}
                       </div>
                       <div className="text-right mr-3">
                         <div className="font-semibold">R$ {(deal.value / 1000).toFixed(0)}k</div>
                       </div>
                       <div className="flex gap-1">
                         <DealDialog deal={deal} tenantId={tenantId} contactId={contactId} />
                         <Button
                           variant="ghost"
                           size="sm"
                           className="text-xs text-red-600 hover:text-red-700 h-7 w-7 p-0"
                           onClick={() => {
                             if (window.confirm('Tem certeza?')) {
                               deleteMutation.mutate(deal.id);
                             }
                           }}
                           disabled={deleteMutation.isPending}
                         >
                           <Trash2 className="w-3 h-3" />
                         </Button>
                       </div>
                     </div>
                   ))}
                 </div>
                <div className="mt-3 pt-3 border-t text-right font-semibold">
                  Subtotal: R$ {(stageValue / 1000).toFixed(0)}k
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}