import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

export function ConfirmActionDialog({
  isOpen,
  title = 'Confirmar ação',
  description = 'Esta ação não pode ser desfeita.',
  actionLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  isDangerous = false,
  isLoading = false
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open) onCancel?.();
    }}>
      <AlertDialogContent className="dark:bg-slate-900 dark:border-slate-700">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {isDangerous && (
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <AlertDialogTitle className="dark:text-white">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="dark:text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end pt-4">
          <AlertDialogCancel 
            className="dark:bg-slate-800 dark:text-white dark:border-slate-700"
            disabled={isLoading}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={isDangerous ? 'bg-red-600 hover:bg-red-700' : ''}
            aria-busy={isLoading}
          >
            {isLoading ? 'Processando...' : actionLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}