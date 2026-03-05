import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar } from 'lucide-react';

export default function DeadlineFromPublication({ publication, processId }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: `Prazo: Publicação ${publication?.date || ''}`,
    deadline_date: '',
    description: publication?.summary || ''
  });
  const queryClient = useQueryClient();

  const createDeadlineMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.Deadline.create({
        ...data,
        process_id: processId,
        publication_id: publication.id,
        status: 'active'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', processId] });
      setOpen(false);
      setFormData({ 
        title: `Prazo: Publicação ${publication?.date}`, 
        deadline_date: '', 
        description: publication?.summary || '' 
      });
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.deadline_date) return;
    createDeadlineMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Criar Prazo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Prazo da Publicação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            placeholder="Título do prazo"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <Input
            type="date"
            value={formData.deadline_date}
            onChange={(e) => setFormData({...formData, deadline_date: e.target.value})}
            required
          />
          <textarea
            placeholder="Descrição/notas"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border rounded text-sm"
            rows="3"
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Criar</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}