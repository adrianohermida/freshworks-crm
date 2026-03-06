import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DealDialog({ deal = null, tenantId, contactId }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    value: 0,
    stage: 'qualification',
    status: 'new',
    probability: 50,
    expected_close_date: '',
    owner_id: '',
    notes: ''
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        value: deal.value || 0,
        stage: deal.stage || 'qualification',
        status: deal.status || 'new',
        probability: deal.probability || 50,
        expected_close_date: deal.expected_close_date ? deal.expected_close_date.split('T')[0] : '',
        owner_id: deal.owner_id || '',
        notes: deal.notes || ''
      });
    } else {
      setFormData({
        title: '',
        value: 0,
        stage: 'qualification',
        status: 'new',
        probability: 50,
        expected_close_date: '',
        owner_id: '',
        notes: ''
      });
    }
  }, [deal, open]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        contact_id: contactId,
        freshsales_id: deal?.freshsales_id || `manual-${Date.now()}`,
        tenant_id: tenantId,
        expected_close_date: data.expected_close_date ? new Date(data.expected_close_date).toISOString() : null
      };
      
      if (deal) {
        await base44.entities.FreshsalesLead.update(deal.id, payload);
      } else {
        await base44.entities.FreshsalesLead.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (deal) {
        await base44.entities.FreshsalesLead.delete(deal.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setOpen(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja deletar este deal?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {deal ? (
          <Button variant="ghost" size="sm" className="text-xs">
            <Pencil className="w-3 h-3 mr-1" />
            Editar
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Deal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{deal ? 'Editar Deal' : 'Novo Deal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Título do Deal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Valor (R$)"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              step="0.01"
            />
            <Input
              type="number"
              placeholder="Probabilidade %"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
              min="0"
              max="100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select value={formData.stage} onValueChange={(val) => setFormData({ ...formData, stage: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Estágio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qualification">Qualification</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            type="date"
            placeholder="Data de Fechamento"
            value={formData.expected_close_date}
            onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
          />
          <Input
            placeholder="Owner ID"
            value={formData.owner_id}
            onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
          />
          <Textarea
            placeholder="Notas"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="h-20"
          />
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Salvando...' : deal ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
            {deal && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Deletar
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}