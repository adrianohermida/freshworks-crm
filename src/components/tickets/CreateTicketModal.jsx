import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateTicketModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    email: '',
    name: '',
    priority: 'medium',
    category: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await base44.functions.invoke('createTicket', formData);
      
      if (response.data?.success) {
        toast.success('Ticket criado com sucesso!');
        setFormData({ subject: '', description: '', email: '', name: '', priority: 'medium', category: '' });
        onSuccess?.();
        onClose?.();
      } else {
        toast.error(response.data?.error || 'Erro ao criar ticket');
      }
    } catch (error) {
      toast.error('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-2xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Novo Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            placeholder="Assunto *"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />

          <Textarea
            placeholder="Descrição *"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="h-24"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="email"
              placeholder="Email do cliente *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              placeholder="Nome do cliente"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Prioridade</label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Categoria"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button disabled={loading}>
              {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              Criar Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}