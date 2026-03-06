import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

const MODALIDADE_LABELS = {
  fixo: 'Honorário Fixo',
  percentual: 'Percentual',
  hibrido: 'Híbrido',
  pro_labore: 'Pro Labore'
};

export default function GestaoHonorarios() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [detalhesModal, setDetalhesModal] = useState(null);
  const [formData, setFormData] = useState({
    cliente_id: '',
    processo_id: '',
    modalidade: 'fixo',
    valor_total: '',
    percentual: '',
    forma_pagamento: 'avista'
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  if (userLoading || user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 font-medium">Acesso restrito ao administrativo</p>
      </div>
    );
  }

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => base44.entities.Cliente.filter({
      escritorio_id: escritorio?.[0]?.id
    }),
    enabled: !!escritorio?.[0]?.id
  });

  const { data: honorarios = [] } = useQuery({
    queryKey: ['honorarios'],
    queryFn: () => base44.entities.Honorario.filter({
      escritorio_id: escritorio?.[0]?.id
    }),
    enabled: !!escritorio?.[0]?.id
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Honorario.create({
      ...data,
      escritorio_id: escritorio[0].id,
      valor_total: parseFloat(data.valor_total),
      percentual: data.percentual ? parseFloat(data.percentual) : null,
      valor_pendente: parseFloat(data.valor_total),
      valor_pago: 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['honorarios'] });
      toast.success('Honorário cadastrado');
      setShowForm(false);
      setFormData({
        cliente_id: '',
        processo_id: '',
        modalidade: 'fixo',
        valor_total: '',
        percentual: '',
        forma_pagamento: 'avista'
      });
    },
    onError: () => toast.error('Erro ao cadastrar')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Honorario.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['honorarios'] });
      toast.success('Honorário removido');
    }
  });

  const totalHonorarios = honorarios.reduce((sum, h) => sum + (h.valor_total || 0), 0);
  const totalPago = honorarios.reduce((sum, h) => sum + (h.valor_pago || 0), 0);
  const totalPendente = totalHonorarios - totalPago;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Gestão de Honorários</h1>
        <Button className="bg-[var(--brand-primary)]" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Honorário
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[var(--text-secondary)]">Total</p>
            <p className="text-2xl font-bold">R$ {totalHonorarios.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-700">Pago</p>
            <p className="text-2xl font-bold text-green-600">R$ {totalPago.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-700">Pendente</p>
            <p className="text-2xl font-bold text-yellow-600">R$ {totalPendente.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Novo Honorário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!formData.cliente_id || !formData.valor_total) {
                toast.error('Preencha os campos obrigatórios');
                return;
              }
              createMutation.mutate(formData);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Cliente*</label>
                  <select
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)] mt-1"
                  >
                    <option value="">Selecione...</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome_completo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Modalidade*</label>
                  <select
                    value={formData.modalidade}
                    onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)] mt-1"
                  >
                    {Object.entries(MODALIDADE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Valor Total*</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.valor_total}
                    onChange={(e) => setFormData({ ...formData, valor_total: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                {formData.modalidade === 'percentual' && (
                  <div>
                    <label className="text-sm font-medium">Percentual (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.percentual}
                      onChange={(e) => setFormData({ ...formData, percentual: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Forma de Pagamento</label>
                  <select
                    value={formData.forma_pagamento}
                    onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)] mt-1"
                  >
                    <option value="avista">À Vista</option>
                    <option value="parcelado">Parcelado</option>
                    <option value="recorrente">Recorrente</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" disabled={createMutation.isPending} className="flex-1">
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                  Salvar
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {honorarios.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-[var(--text-secondary)]">Nenhum honorário cadastrado</p>
            </CardContent>
          </Card>
        ) : (
          honorarios.map((h) => {
            const cliente = clientes.find(c => c.id === h.cliente_id);
            return (
              <Card key={h.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{cliente?.nome_completo}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{MODALIDADE_LABELS[h.modalidade]}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {h.valor_pago > 0 && `Pago: R$ ${h.valor_pago.toFixed(2)} | `}
                        Pendente: R$ {(h.valor_total - h.valor_pago).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-xl font-bold">R$ {h.valor_total?.toFixed(2)}</p>
                      <p className={`text-xs font-medium mt-1 ${
                        h.status === 'pago' ? 'text-green-600' :
                        h.status === 'parcialmente_pago' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {h.status === 'pago' ? 'Pago' :
                         h.status === 'parcialmente_pago' ? 'Parcial' :
                         'Pendente'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDetalhesModal(h)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja remover?')) {
                            deleteMutation.mutate(h.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-red-600"
                      >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {detalhesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Detalhes do Honorário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Modalidade</p>
                  <p className="font-medium">{MODALIDADE_LABELS[detalhesModal.modalidade]}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Valor Total</p>
                  <p className="font-medium">R$ {detalhesModal.valor_total?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Pago</p>
                  <p className="font-medium text-green-600">R$ {detalhesModal.valor_pago?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Pendente</p>
                  <p className="font-medium text-yellow-600">R$ {(detalhesModal.valor_total - detalhesModal.valor_pago).toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Status</p>
                <p className="font-medium capitalize">{detalhesModal.status}</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setDetalhesModal(null)}>
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}