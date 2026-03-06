import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, AlertCircle, Clock, User, Trash2 } from 'lucide-react';
import ActivityDialog from './ActivityDialog';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const typeIcons = {
  task: Circle,
  call: AlertCircle,
  meeting: Clock,
  note: AlertCircle
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-800'
};

export default function ActivitiesList({ activities = [], isLoading, tenantId, contactId }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.FreshsalesActivity.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });

  if (isLoading) return <p className="text-slate-500">Carregando atividades...</p>;

  return (
    <div className="space-y-3">
      {!activities.length && <p className="text-slate-500">Nenhuma atividade encontrada</p>}
      {contactId && (
        <div className="flex justify-end mb-4">
          <ActivityDialog tenantId={tenantId} contactId={contactId} />
        </div>
      )}
      {activities.map(activity => {
        const Icon = typeIcons[activity.type] || Circle;
        const dueDate = activity.due_date ? new Date(activity.due_date) : null;
        const isOverdue = dueDate && dueDate < new Date() && activity.status !== 'completed';

        return (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="w-5 h-5 mt-1 text-slate-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">{activity.title}</h3>
                      {activity.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    {activity.description && (
                      <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={statusColors[activity.status]}>
                        {activity.status}
                      </Badge>
                      <Badge className={priorityColors[activity.priority]}>
                        {activity.priority}
                      </Badge>
                      {activity.type && (
                        <Badge variant="outline">{activity.type}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm space-y-2">
                   <div>
                     {dueDate && (
                       <div className={isOverdue ? 'text-red-600 font-semibold' : 'text-slate-500'}>
                         {dueDate.toLocaleDateString('pt-BR')}
                       </div>
                     )}
                     {activity.assigned_to && (
                       <div className="flex items-center gap-1 justify-end text-slate-500 mt-1">
                         <User className="w-3 h-3" />
                         <span className="text-xs">{activity.assigned_to}</span>
                       </div>
                     )}
                   </div>
                   <div className="flex gap-1 justify-end">
                     <ActivityDialog activity={activity} tenantId={tenantId} contactId={contactId} />
                     <Button
                       variant="ghost"
                       size="sm"
                       className="text-xs text-red-600 hover:text-red-700 h-8 w-8 p-0"
                       onClick={() => {
                         if (window.confirm('Tem certeza?')) {
                           deleteMutation.mutate(activity.id);
                         }
                       }}
                       disabled={deleteMutation.isPending}
                     >
                       <Trash2 className="w-3 h-3" />
                     </Button>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}