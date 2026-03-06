import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Plus, Loader2, X, Clock, Calendar, FileText, Send,
  Bell, BellOff, ChevronDown, ChevronRight, Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const TIPOS_ATO = [
  { value: 'abertura_prazo',         label: 'Abertura de Prazo',                 emoji: '⏰', urgente: true  },
  { value: 'emenda',                 label: 'Prazo para Emenda da Petição',       emoji: '📝', urgente: true  },
  { value: 'apresentacao_documentos',label: 'Apresentação de Documentos',         emoji: '📄', urgente: true  },
  { value: 'plano_pagamento',        label: 'Plano de Pagamento',                 emoji: '💰', urgente: false },
  { value: 'designacao_audiencia',   label: 'Designação de Audiência',            emoji: '🗓️', urgente: false },
  { value: 'redesignacao_audiencia', label: 'Redesignação de Audiência',          emoji: '🔄', urgente: false },
  { value: 'cancelamento_audiencia', label: 'Cancelamento de Audiência',          emoji: '❌', urgente: false },
  { value: 'certidao_ata',           label: 'Certidão/Ata de Audiência',          emoji: '📋', urgente: false },
  { value: 'acordo',                 label: 'Acordo',                             emoji: '🤝', urgente: false },
  { value: 'encerramento',           label: 'Encerramento do Processo',           emoji: '✅', urgente: false },
  { value: 'despacho',               label: 'Despacho',                           emoji: '⚖️', urgente: false },
  { value: 'sentenca',               label: 'Sentença',                           emoji: '⚖️', urgente: false },
  { value: 'recurso',                label: 'Recurso',                            emoji: '📌', urgente: false },
  { value: 'outro',                  label: 'Outro',                              emoji: '📌', urgente: false },
];

function AndamentoForm({ processo, podeEditar, onClose, onCreated }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    tipo_ato: '',
    data_ato: new Date().toISOString().split('T')[0],
    prazo_limite: '',
    descricao: '',
    observacoes_internas: '',
    notificar_cliente: true,
    notificar_consultor: true,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const andamento = await base44.entities.AndamentoProcessual.create({
        processo_id: processo.id,
        processo_numero: processo.numero_processo,
        processo_tipo: processo.tipo,
        cliente_id: processo.cliente_id,
        cliente_nome: processo.cliente_nome,
        cliente_email: data.cliente_email,
        consultor_email: processo.consultor_responsavel_email,
        consultor_nome: processo.consultor_responsavel_nome,
        tipo_ato: data.tipo_ato,
        data_ato: data.data_ato,
        prazo_limite: data.prazo_limite || undefined,
        descricao: data.descricao,
        observacoes_internas: data.observacoes_internas,
      });

      // Enviar notificações automaticamente
      if (data.notificar_cliente || data.notificar_consultor) {
        await base44.functions.invoke('enviarNotificacaoAndamento', {
          andamento_id: andamento.id,
          notificar_cliente: data.notificar_cliente,
          notificar_consultor: data.notificar_consultor,
        });
      }

      return andamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['andamentos', processo.id] });
      toast.success('Andamento registrado e notificações enviadas');
      onCreated?.();
      onClose();
    },
    onError: (e) => toast.error('Erro: ' + e.message),
  });

  const tipoSelecionado = TIPOS_ATO.find(t => t.value === form.tipo_ato);

  return (
    <Card className="border-[#212373]/20 shadow-md">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-[#212373] flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Andamento
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <Label className="text-xs text-slate-600">Tipo do Ato *</Label>
            <Select value={form.tipo_ato} onValueChange={v => set('tipo_ato', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o tipo de ato..." />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_ATO.map(t => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.emoji} {t.label}
                    {t.urgente && <span className="ml-2 text-xs text-amber-600">(prazo)</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-slate-600">Data do Ato *</Label>
            <Input type="date" value={form.data_ato} onChange={e => set('data_ato', e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label className="text-xs text-slate-600">Prazo Limite</Label>
            <Input type="date" value={form.prazo_limite} onChange={e => set('prazo_limite', e.target.value)} className="mt-1" />
          </div>

          <div className="md:col-span-2">
            <Label className="text-xs text-slate-600">Descrição (visível ao cliente)</Label>
            <textarea
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              placeholder="Descreva o andamento para o cliente..."
              className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm resize-none h-20 focus:border-[#212373] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <Label className="text-xs text-slate-600">Observações Internas (não visíveis ao cliente)</Label>
            <Input
              value={form.observacoes_internas}
              onChange={e => set('observacoes_internas', e.target.value)}
              placeholder="Notas internas..."
              className="mt-1"
            />
          </div>
        </div>

        {/* Notificações */}
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1">
            <Bell className="w-3 h-3" /> Notificações automáticas
          </p>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.notificar_cliente} onChange={e => set('notificar_cliente', e.target.checked)} className="rounded" />
            <span>Enviar email ao cliente</span>
            {processo.cliente_nome && <span className="text-xs text-slate-400">({processo.cliente_nome})</span>}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.notificar_consultor} onChange={e => set('notificar_consultor', e.target.checked)} className="rounded" />
            <span>Notificar consultor</span>
            {processo.consultor_responsavel_email && <span className="text-xs text-slate-400">({processo.consultor_responsavel_email})</span>}
          </label>
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button
            size="sm"
            onClick={() => createMutation.mutate(form)}
            disabled={!form.tipo_ato || !form.data_ato || createMutation.isPending}
            className="bg-[#212373] hover:bg-[#1a1b5e] text-white gap-1"
          >
            {createMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            Registrar e Notificar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AndamentoItem({ andamento, podeEditar, onReenviar }) {
  const tipo = TIPOS_ATO.find(t => t.value === andamento.tipo_ato);
  const isUrgente = tipo?.urgente;
  const prazoPassado = andamento.prazo_limite && new Date(andamento.prazo_limite + 'T23:59:00') < new Date();

  return (
    <div className={`border rounded-lg p-3 bg-white ${isUrgente ? 'border-amber-200' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{tipo?.emoji || '📌'}</span>
            <span className="font-semibold text-slate-800 text-sm">{tipo?.label || andamento.tipo_ato}</span>
            {isUrgente && <Badge className="bg-amber-100 text-amber-800 text-xs">Com Prazo</Badge>}
            {andamento.notificacao_cliente_enviada && (
              <Badge className="bg-green-100 text-green-700 text-xs flex items-center gap-1">
                <Bell className="w-2.5 h-2.5" /> Notificado
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ato em: {andamento.data_ato ? format(new Date(andamento.data_ato + 'T12:00:00'), 'dd/MM/yyyy') : '—'}
            {andamento.prazo_limite && (
              <span className={`ml-3 font-medium ${prazoPassado ? 'text-red-600' : 'text-amber-600'}`}>
                Prazo: {format(new Date(andamento.prazo_limite + 'T12:00:00'), 'dd/MM/yyyy')}
                {prazoPassado && ' ⚠️ Vencido'}
              </span>
            )}
          </p>
          {andamento.descricao && <p className="text-xs text-slate-600 mt-1">{andamento.descricao}</p>}
        </div>
        {podeEditar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReenviar(andamento)}
            className="text-xs text-slate-400 hover:text-[#212373] gap-1 flex-shrink-0"
            title="Reenviar notificação"
          >
            <Send className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AndamentosManager({ processo, userRole }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const podeEditar = userRole === 'admin' || userRole === 'consultant' || userRole === 'consultor';

  const { data: andamentos = [], isLoading } = useQuery({
    queryKey: ['andamentos', processo.id],
    queryFn: () => base44.entities.AndamentoProcessual.filter({ processo_id: processo.id }, '-data_ato', 100),
    enabled: !!processo.id,
  });

  const reenviarMutation = useMutation({
    mutationFn: (andamento) => base44.functions.invoke('enviarNotificacaoAndamento', {
      andamento_id: andamento.id,
      notificar_cliente: true,
      notificar_consultor: true,
    }),
    onSuccess: () => toast.success('Notificações reenviadas'),
    onError: (e) => toast.error('Erro ao reenviar: ' + e.message),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-[#212373]" />
          Andamentos Processuais
          <Badge variant="secondary" className="text-xs">{andamentos.length}</Badge>
        </h3>
        {podeEditar && !showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-1 text-xs bg-[#212373] hover:bg-[#1a1b5e] text-white">
            <Plus className="w-3 h-3" /> Registrar Andamento
          </Button>
        )}
      </div>

      {showForm && (
        <AndamentoForm
          processo={processo}
          podeEditar={podeEditar}
          onClose={() => setShowForm(false)}
          onCreated={() => queryClient.invalidateQueries({ queryKey: ['andamentos', processo.id] })}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
      ) : andamentos.length === 0 ? (
        <div className="text-center py-6 text-slate-400 border-dashed border-2 rounded-lg">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Nenhum andamento registrado</p>
          {podeEditar && (
            <Button size="sm" variant="ghost" onClick={() => setShowForm(true)} className="mt-2 text-[#212373]">
              + Registrar primeiro andamento
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {andamentos.map(a => (
            <AndamentoItem
              key={a.id}
              andamento={a}
              podeEditar={podeEditar}
              onReenviar={(and) => reenviarMutation.mutate(and)}
            />
          ))}
        </div>
      )}
    </div>
  );
}