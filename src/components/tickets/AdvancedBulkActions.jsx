import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Zap, Clock, Trash2 } from 'lucide-react';

const OPERATIONS = {
  status_change: { label: '📊 Alterar Status', color: 'bg-blue-100' },
  priority_change: { label: '🔴 Alterar Prioridade', color: 'bg-red-100' },
  assignment: { label: '👤 Atribuir Agente', color: 'bg-green-100' },
  tag_add: { label: '🏷️ Adicionar Tag', color: 'bg-purple-100' },
  category_change: { label: '📂 Alterar Categoria', color: 'bg-yellow-100' },
  delete: { label: '🗑️ Deletar', color: 'bg-red-100' }
};

export default function AdvancedBulkActions({ selectedTickets = [], onComplete }) {
  const queryClient = useQueryClient();
  const [operationType, setOperationType] = useState('status_change');
  const [targetValue, setTargetValue] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const executeMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('executeBulkOperation', data),
    onSuccess: (response) => {
      const msg = response.data;
      toast.success(`✅ ${msg.message || 'Operação concluída com sucesso!'}`);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      resetForm();
      onComplete?.();
    },
    onError: (error) => {
      toast.error('❌ Erro: ' + (error.message || 'Erro ao executar operação'));
    }
  });

  const resetForm = () => {
    setOperationType('status_change');
    setTargetValue('');
    setScheduleTime('');
  };

  const handleExecute = () => {
    if (!targetValue.trim()) {
      toast.error('Selecione um valor');
      return;
    }

    if (selectedTickets.length === 0) {
      toast.error('Selecione pelo menos um ticket');
      return;
    }

    executeMutation.mutate({
      operation_type: operationType,
      ticket_ids: selectedTickets,
      target_value: targetValue,
      scheduled_for: scheduleTime || null
    });
    setShowConfirm(false);
  };

  const getTargetOptions = () => {
    switch (operationType) {
      case 'status_change':
        return [
          { value: 'open', label: 'Aberto' },
          { value: 'pending', label: 'Pendente' },
          { value: 'resolved', label: 'Resolvido' },
          { value: 'closed', label: 'Fechado' }
        ];
      case 'priority_change':
        return [
          { value: 'low', label: 'Baixa' },
          { value: 'medium', label: 'Média' },
          { value: 'high', label: 'Alta' },
          { value: 'urgent', label: 'Urgente' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Ações em Massa ({selectedTickets.length} selecionados)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedTickets.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">Selecione tickets para executar ações em massa</p>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Operação</label>
                <select
                  value={operationType}
                  onChange={(e) => {
                    setOperationType(e.target.value);
                    setTargetValue('');
                  }}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  {Object.entries(OPERATIONS).map(([key, op]) => (
                    <option key={key} value={key}>{op.label}</option>
                  ))}
                </select>
              </div>

              {getTargetOptions().length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Novo Valor</label>
                  <select
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">-- Selecione --</option>
                    {getTargetOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {(operationType === 'tag_add' || operationType === 'assignment') && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {operationType === 'tag_add' ? 'Nome da Tag' : 'Nome do Agente'}
                  </label>
                  <input
                    type="text"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder={operationType === 'tag_add' ? 'Digite a tag' : 'Digite o nome do agente'}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Agendar para depois (opcional)
                </label>
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <p className="text-xs text-amber-800">
                  ⚠️ Esta ação afetará <strong>{selectedTickets.length}</strong> ticket(s)
                  {scheduleTime && ' e será executada na data agendada'}
                </p>
              </div>

              <Button
                onClick={() => setShowConfirm(true)}
                disabled={executeMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {executeMutation.isPending ? 'Processando...' : '⚡ Executar Operação'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirmar Operação em Massa</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a {OPERATIONS[operationType].label.toLowerCase()} em <strong>{selectedTickets.length}</strong> ticket(s).
            {scheduleTime && <p>Esta operação será executada em: <strong>{new Date(scheduleTime).toLocaleString()}</strong></p>}
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExecute}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}