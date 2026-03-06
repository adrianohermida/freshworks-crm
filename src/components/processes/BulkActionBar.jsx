import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle2, Trash2, Download, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/**
 * Bulk Action Bar - Selecionar múltiplos processos e executar ações em batch
 */

export default function BulkActionBar({ selectedCount, selectedIds, onDeselectAll, processes }) {
  const [action, setAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const actions = [
    { value: 'sync', label: '⚡ Sincronizar Todos', icon: Zap },
    { value: 'export', label: '📥 Exportar CSV', icon: Download },
    { value: 'delete', label: '🗑️ Deletar', icon: Trash2 }
  ];

  const handleExecuteAction = async () => {
    setIsLoading(true);
    try {
      const result = await base44.functions.invoke('bulkProcessActions', {
        action,
        process_ids: selectedIds
      });

      // Log analytics
      await base44.entities.Analytics.create({
        user_id: (await base44.auth.me()).email,
        event_type: 'bulk_action',
        entity_type: 'processes',
        action: `${action} on ${selectedIds.length} processes`,
        timestamp: new Date().toISOString(),
        value: selectedIds.length,
        status: 'success'
      });

      setAction('');
      onDeselectAll();
      setShowConfirm(false);
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <Card className="p-4 dark:bg-gray-800 bg-cyan-50 dark:bg-cyan-900 border-cyan-200 dark:border-cyan-700 sticky bottom-0 z-30">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-600" />
            <span className="font-semibold text-cyan-900 dark:text-cyan-100">
              {selectedCount} processo{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="w-48 dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Escolha uma ação..." />
              </SelectTrigger>
              <SelectContent>
                {actions.map(a => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => setShowConfirm(true)}
              disabled={!action || isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
            >
              {isLoading ? 'Processando...' : 'Executar'}
            </Button>

            <Button
              variant="outline"
              onClick={onDeselectAll}
              className="dark:border-gray-600"
            >
              Desselecionar
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Ação em Massa</AlertDialogTitle>
            <AlertDialogDescription>
              Você vai {actions.find(a => a.value === action)?.label.toLowerCase()} {selectedCount} processo(s). Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded p-4 my-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Certifique-se de que tem backup de dados antes de continuar.
            </p>
          </div>
          <div className="flex gap-4">
            <AlertDialogCancel className="dark:border-gray-600">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExecuteAction}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isLoading ? 'Processando...' : 'Confirmar'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}