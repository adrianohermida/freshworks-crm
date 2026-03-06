import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ModuleCard from '@/components/shared/ModuleCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, MapPin, Plus, Trash2, Link2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AgendaModule() {
  const [activeTab, setActiveTab] = useState('agendado');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'audiencia',
    start_date: '',
    location: '',
    description: '',
    deadline_id: null
  });
  const [linkedDeadline, setLinkedDeadline] = useState(null);
  const queryClient = useQueryClient();

  const { data: agendaItems = [] } = useQuery({
    queryKey: ['agenda'],
    queryFn: () => base44.entities.Agenda.list('-start_date', 100)
  });

  const { data: deadlines = [] } = useQuery({
    queryKey: ['deadlines'],
    queryFn: () => base44.entities.Deadline.filter({ status: 'active' }, '-deadline_date', 50)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Agenda.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      setFormData({ title: '', type: 'audiencia', start_date: '', location: '', description: '', deadline_id: null });
      setIsCreating(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Agenda.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agenda'] })
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.start_date) return;
    createMutation.mutate({
      ...formData,
      status: 'agendado',
      reminder_sent: false
    });
  };

  const filteredItems = agendaItems.filter(item => 
    activeTab === 'all' || item.status === activeTab
  );

  const typeIcons = {
    audiencia: '⚖️',
    reuniao: '👥',
    despacho: '📋',
    sentenca: '✅',
    outro: '📌'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ModuleCard
      title="Agenda"
      icon={Calendar}
      action={<Button size="sm" onClick={() => setIsCreating(!isCreating)}><Plus className="w-4 h-4 mr-1" />Novo Evento</Button>}
    >
      <div className="space-y-4">
      {/* Create Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg space-y-3 border border-cyan-200 dark:border-cyan-800">
            <Input
              placeholder="Título do evento"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value="audiencia">Audiência</option>
              <option value="reuniao">Reunião</option>
              <option value="despacho">Despacho</option>
              <option value="sentenca">Sentença</option>
              <option value="outro">Outro</option>
            </select>
            <Input
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              required
            />
            <Input
              placeholder="Local (sala, fórum, online, etc)"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <textarea
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded text-sm"
              rows="3"
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Criar Evento</Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
            </div>
          </form>
        )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="agendado">Agendados</TabsTrigger>
          <TabsTrigger value="concluido">Concluídos</TabsTrigger>
          <TabsTrigger value="adiado">Adiados</TabsTrigger>
          <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3 mt-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum evento
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{typeIcons[item.type]}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold dark:text-white">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {formatDate(item.start_date)}
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </div>
                      )}
                      {item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.status}</Badge>
                    {item.deadline_id && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">Prazo</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setLinkedDeadline(item.deadline_id)}
                      title="Ver prazo vinculado"
                      className="text-blue-600"
                    >
                      <Link2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
    </ModuleCard>
  );
}