import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const tiposIncidente = ['suspeicao', 'impedimento', 'conflito_competencia', 'terceirizacao', 'julgamento_antecipado', 'outro'];
const tiposRecurso = ['apelacao', 'recurso_especial', 'recurso_extraordinario', 'agravo', 'embargos', 'recurso_adesivo', 'outro'];
const statusIncidente = ['pendente', 'julgado', 'provido', 'desprovido', 'desistencia', 'arquivado'];
const statusRecurso = ['pendente', 'em_andamento', 'julgado', 'provido', 'desprovido', 'parcialmente_provido', 'desistencia', 'prescrito'];

function FormIncidente({ incidente, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(incidente || {
    tipo: 'suspeicao',
    titulo: '',
    descricao: '',
    status: 'pendente',
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Tipo *</label>
          <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tiposIncidente.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Status *</label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusIncidente.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Título *</label>
        <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título do incidente" required />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Descrição</label>
        <Textarea value={form.descricao || ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </form>
  );
}

function FormRecurso({ recurso, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(recurso || {
    tipo: 'apelacao',
    titulo: '',
    descricao: '',
    status: 'pendente',
    data_interposicao: new Date().toISOString().split('T')[0],
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Tipo *</label>
          <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tiposRecurso.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Status *</label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusRecurso.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Título *</label>
        <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Motivo do recurso" required />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Data Interposição</label>
        <Input type="date" value={form.data_interposicao} onChange={(e) => setForm({ ...form, data_interposicao: e.target.value })} />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Descrição</label>
        <Textarea value={form.descricao || ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </form>
  );
}

export default function GerenciadorIncidentesRecursos({ processo }) {
  const [showIncidenteForm, setShowIncidenteForm] = useState(false);
  const [showRecursoForm, setShowRecursoForm] = useState(false);
  const [editingIncidente, setEditingIncidente] = useState(null);
  const [editingRecurso, setEditingRecurso] = useState(null);
  const queryClient = useQueryClient();

  // Buscar incidentes
  const { data: incidentes = [], isLoading: loadingIncidentes } = useQuery({
    queryKey: ['incidentes', processo?.id],
    queryFn: () => base44.entities.IncidenteProcessual.filter({ processo_id: processo?.id }),
    enabled: !!processo?.id,
  });

  // Buscar recursos
  const { data: recursos = [], isLoading: loadingRecursos } = useQuery({
    queryKey: ['recursos', processo?.id],
    queryFn: () => base44.entities.RecursoProcessual.filter({ processo_id: processo?.id }),
    enabled: !!processo?.id,
  });

  // Mutations
  const criarIncidenteMutation = useMutation({
    mutationFn: (data) => base44.entities.IncidenteProcessual.create({
      ...data,
      processo_id: processo.id,
      processo_numero: processo.numero_processo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentes', processo?.id] });
      setShowIncidenteForm(false);
      setEditingIncidente(null);
      toast.success('Incidente criado');
    },
  });

  const atualizarIncidenteMutation = useMutation({
    mutationFn: (data) => base44.entities.IncidenteProcessual.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentes', processo?.id] });
      setEditingIncidente(null);
      toast.success('Incidente atualizado');
    },
  });

  const criarRecursoMutation = useMutation({
    mutationFn: (data) => base44.entities.RecursoProcessual.create({
      ...data,
      processo_id: processo.id,
      processo_numero: processo.numero_processo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recursos', processo?.id] });
      setShowRecursoForm(false);
      setEditingRecurso(null);
      toast.success('Recurso criado');
    },
  });

  const atualizarRecursoMutation = useMutation({
    mutationFn: (data) => base44.entities.RecursoProcessual.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recursos', processo?.id] });
      setEditingRecurso(null);
      toast.success('Recurso atualizado');
    },
  });

  const deletarMutation = useMutation({
    mutationFn: ({ entity, id }) => base44.entities[entity].delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentes', processo?.id] });
      queryClient.invalidateQueries({ queryKey: ['recursos', processo?.id] });
      toast.success('Deletado com sucesso');
    },
  });

  if (!processo) return <p className="text-slate-500">Selecione um processo</p>;

  return (
    <Tabs defaultValue="incidentes" className="space-y-4">
      <TabsList>
        <TabsTrigger value="incidentes" className="gap-1">
          <AlertTriangle className="w-4 h-4" /> Incidentes ({incidentes.length})
        </TabsTrigger>
        <TabsTrigger value="recursos" className="gap-1">
          <TrendingUp className="w-4 h-4" /> Recursos ({recursos.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="incidentes" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Incidentes Processuais</h3>
          <Dialog open={showIncidenteForm} onOpenChange={setShowIncidenteForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> Novo Incidente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingIncidente ? 'Editar' : 'Novo'} Incidente</DialogTitle>
              </DialogHeader>
              <FormIncidente
                incidente={editingIncidente}
                onSubmit={(data) => {
                  if (editingIncidente) {
                    atualizarIncidenteMutation.mutate({ ...data, id: editingIncidente.id });
                  } else {
                    criarIncidenteMutation.mutate(data);
                  }
                }}
                onCancel={() => { setShowIncidenteForm(false); setEditingIncidente(null); }}
                isLoading={criarIncidenteMutation.isPending || atualizarIncidenteMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {loadingIncidentes ? (
          <p className="text-slate-500">Carregando...</p>
        ) : incidentes.length === 0 ? (
          <Card className="bg-slate-50">
            <CardContent className="py-6 text-center text-slate-500 text-sm">
              Nenhum incidente registrado
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {incidentes.map((inc) => (
              <Card key={inc.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{inc.titulo}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{inc.tipo}</Badge>
                        <Badge className={`text-xs ${inc.status === 'provido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {inc.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditingIncidente(inc)} className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deletarMutation.mutate({ entity: 'IncidenteProcessual', id: inc.id })} className="h-8 w-8 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="recursos" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Recursos Processuais</h3>
          <Dialog open={showRecursoForm} onOpenChange={setShowRecursoForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> Novo Recurso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRecurso ? 'Editar' : 'Novo'} Recurso</DialogTitle>
              </DialogHeader>
              <FormRecurso
                recurso={editingRecurso}
                onSubmit={(data) => {
                  if (editingRecurso) {
                    atualizarRecursoMutation.mutate({ ...data, id: editingRecurso.id });
                  } else {
                    criarRecursoMutation.mutate(data);
                  }
                }}
                onCancel={() => { setShowRecursoForm(false); setEditingRecurso(null); }}
                isLoading={criarRecursoMutation.isPending || atualizarRecursoMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {loadingRecursos ? (
          <p className="text-slate-500">Carregando...</p>
        ) : recursos.length === 0 ? (
          <Card className="bg-slate-50">
            <CardContent className="py-6 text-center text-slate-500 text-sm">
              Nenhum recurso registrado
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recursos.map((rec) => (
              <Card key={rec.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{rec.titulo}</p>
                      <p className="text-xs text-slate-600 mt-1">{rec.data_interposicao}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{rec.tipo}</Badge>
                        <Badge className={`text-xs ${rec.status === 'provido' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {rec.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditingRecurso(rec)} className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deletarMutation.mutate({ entity: 'RecursoProcessual', id: rec.id })} className="h-8 w-8 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}