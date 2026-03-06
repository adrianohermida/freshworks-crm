import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Download, Loader } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const DEFAULT_FIELDS = [
  { id: 'id', label: 'ID' },
  { id: 'subject', label: 'Assunto' },
  { id: 'description', label: 'Descrição' },
  { id: 'status', label: 'Status' },
  { id: 'priority', label: 'Prioridade' },
  { id: 'customer_name', label: 'Cliente' },
  { id: 'customer_email', label: 'Email Cliente' },
  { id: 'assigned_agent_name', label: 'Agente' },
  { id: 'created_date', label: 'Data Criação' },
  { id: 'updated_date', label: 'Última Atualização' },
];

export default function ExportCSVButton() {
  const [open, setOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState(
    DEFAULT_FIELDS.map(f => f.id)
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleField = (fieldId) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(f => f !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast.error('Selecione pelo menos um campo');
      return;
    }

    setIsLoading(true);
    try {
      const response = await base44.functions.invoke('exportTicketsCSV', {
        fields: selectedFields
      });

      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success('Dados exportados com sucesso!');
      setOpen(false);
    } catch (error) {
      toast.error('Erro ao exportar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar CSV
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Tickets em CSV</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {DEFAULT_FIELDS.map(field => (
              <div key={field.id} className="flex items-center gap-3">
                <Checkbox
                  id={field.id}
                  checked={selectedFields.includes(field.id)}
                  onCheckedChange={() => handleToggleField(field.id)}
                />
                <label
                  htmlFor={field.id}
                  className="text-sm cursor-pointer flex-1"
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              disabled={isLoading || selectedFields.length === 0}
              className="gap-2"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isLoading ? 'Exportando...' : 'Exportar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}