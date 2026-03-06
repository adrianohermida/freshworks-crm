import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User, Mail, Phone, MapPin, FileText, Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';
import { useTheme } from '@/components/hooks/useTheme';
import Breadcrumb from '@/components/seo/Breadcrumb';
import AdicionarInscricaoOABForm from '@/components/perfil/AdicionarInscricaoOABForm';
import { toast } from 'sonner';

export default function MeuPerfil() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('perfil');
  const [editMode, setEditMode] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente', user?.email],
    queryFn: async () => {
      const clientes = await base44.entities.Cliente.filter({ email: user?.email });
      return clientes?.[0];
    },
    enabled: !!user?.email
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user
  });

  const { data: inscricoes = [] } = useQuery({
    queryKey: ['inscricoes', escritorio?.id],
    queryFn: async () => {
      if (user?.role !== 'admin' || !escritorio?.id) return [];
      return base44.entities.InscricaoOAB.filter({ escritorio_id: escritorio.id });
    },
    enabled: !!user && user.role === 'admin' && !!escritorio?.id
  });

  const { data: documentos = [] } = useQuery({
    queryKey: ['documentos', user?.email],
    queryFn: () => base44.entities.ValidacaoDocumento.filter({
      cliente_email: user?.email
    }),
    enabled: !!user?.email
  });

  // Mutations
  const updateClienteMutation = useMutation({
    mutationFn: (data) => base44.entities.Cliente.update(cliente.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cliente'] });
      toast.success('Dados atualizado com sucesso');
      setEditMode(false);
    },
    onError: (error) => toast.error('Erro ao atualizar: ' + error.message)
  });

  const handleFotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFoto(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await updateClienteMutation.mutateAsync({ foto_url: file_url });
      toast.success('Foto atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer upload da foto');
    } finally {
      setUploadingFoto(false);
    }
  };

  const addContatoMutation = useMutation({
    mutationFn: (telefone) => {
      const novos = [...(cliente.telefones_adicionais || []), telefone];
      return base44.entities.Cliente.update(cliente.id, { telefones_adicionais: novos });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cliente'] });
      toast.success('Contato adicionado');
    }
  });

  const addEmailMutation = useMutation({
    mutationFn: (email) => {
      const novos = [...(cliente.emails_adicionais || []), email];
      return base44.entities.Cliente.update(cliente.id, { emails_adicionais: novos });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cliente'] });
      toast.success('Email adicionado');
    }
  });

  const addEndereceMutation = useMutation({
    mutationFn: (endereco) => {
      const novos = [...(cliente.enderecos_adicionais || []), endereco];
      return base44.entities.Cliente.update(cliente.id, { enderecos_adicionais: novos });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cliente'] });
      toast.success('Endereço adicionado');
    }
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Faça login para acessar</h1>
        <Button 
          onClick={() => base44.auth.redirectToLogin(createPageUrl('MeuPerfil'))} 
          className="bg-[var(--brand-primary)]"
        >
          Ir para Login
        </Button>
      </div>
    );
  }

  if (user.role === 'admin') {
    return navigate(createPageUrl("Profile"));
  }

  return (
      <div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumb items={[{ label: 'Meu Perfil' }]} />

          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <label className="relative cursor-pointer group">
                {cliente?.foto_url ? (
                  <img
                    src={cliente.foto_url}
                    alt={user.full_name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-[var(--brand-primary)]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-[var(--brand-primary)] flex items-center justify-center text-4xl font-bold text-white">
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploadingFoto ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <span className="text-white text-xs">Mudar foto</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoUpload}
                  disabled={uploadingFoto}
                  className="hidden"
                />
              </label>
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">{user.full_name}</h1>
                <p className="text-[var(--text-secondary)]">{user.email}</p>
                {cliente && <p className="text-xs text-green-600 mt-2">✓ Perfil Completo</p>}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${['admin', 'equipe'].includes(user.role) ? 'grid-cols-5' : 'grid-cols-4'} mb-8`}>
              <TabsTrigger value="perfil"><User size={16} /></TabsTrigger>
              <TabsTrigger value="emails"><Mail size={16} /></TabsTrigger>
              <TabsTrigger value="telefones"><Phone size={16} /></TabsTrigger>
              <TabsTrigger value="enderecos"><MapPin size={16} /></TabsTrigger>
              {['admin', 'equipe'].includes(user.role) && <TabsTrigger value="oab"><FileText size={16} /></TabsTrigger>}
            </TabsList>

            {/* Perfil Tab */}
            <TabsContent value="perfil" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Dados Pessoais</CardTitle>
                  {!editMode && (
                    <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {editMode ? (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      updateClienteMutation.mutate({
                        nome_completo: e.target.nome.value,
                        profissao: e.target.profissao.value,
                        data_nascimento: e.target.data_nascimento.value
                      });
                    }} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Nome Completo</label>
                        <Input name="nome" defaultValue={cliente?.nome_completo || user.full_name} required />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Profissão</label>
                        <Input name="profissao" defaultValue={cliente?.profissao || ''} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Data de Nascimento</label>
                        <Input name="data_nascimento" type="date" defaultValue={cliente?.data_nascimento || ''} />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={updateClienteMutation.isPending} className="flex-1">
                          {updateClienteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                          Salvar
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditMode(false)} className="flex-1">
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Nome</p>
                        <p className="font-medium">{cliente?.nome_completo || user.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Email Principal</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Profissão</p>
                        <p className="font-medium">{cliente?.profissao || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Data de Nascimento</p>
                        <p className="font-medium">{cliente?.data_nascimento ? new Date(cliente.data_nascimento).toLocaleDateString('pt-BR') : '—'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emails Tab */}
            <TabsContent value="emails" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emails</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                    <p className="text-sm text-[var(--text-secondary)]">Email Principal</p>
                    <p className="font-medium">{user.email}</p>
                  </div>

                  {cliente?.emails_adicionais?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Emails Adicionais</p>
                      {cliente.emails_adicionais.map((e, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-primary)]">
                          <p className="font-medium">{e.email}</p>
                          <Button size="sm" variant="ghost" onClick={() => {
                            const novos = cliente.emails_adicionais.filter((_, idx) => idx !== i);
                            updateClienteMutation.mutate({ emails_adicionais: novos });
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const email = e.target.email.value.trim();
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      toast.error('Email inválido');
                      return;
                    }
                    addEmailMutation.mutate({
                      email,
                      tipo: e.target.tipo.value
                    });
                    e.target.reset();
                  }} className="space-y-3 pt-4 border-t">
                    <Input name="email" type="email" placeholder="Novo email" required />
                    <select name="tipo" defaultValue="pessoal" className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)]">
                      <option value="pessoal">Pessoal</option>
                      <option value="profissional">Profissional</option>
                    </select>
                    <Button type="submit" disabled={addEmailMutation.isPending} className="w-full">
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Email
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Telefones Tab */}
            <TabsContent value="telefones" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Telefones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cliente?.telefone && (
                    <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                      <p className="text-sm text-[var(--text-secondary)]">Telefone Principal</p>
                      <p className="font-medium">{cliente.telefone}</p>
                    </div>
                  )}

                  {cliente?.telefones_adicionais?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Telefones Adicionais</p>
                      {cliente.telefones_adicionais.map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-primary)]">
                          <div>
                            <p className="font-medium">{t.telefone}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{t.tipo} {t.whatsapp && '(WhatsApp)'}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => {
                            const novos = cliente.telefones_adicionais.filter((_, idx) => idx !== i);
                            updateClienteMutation.mutate({ telefones_adicionais: novos });
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    let tel = e.target.telefone.value.replace(/\D/g, '');
                    if (tel.length < 10) {
                      toast.error('Telefone deve ter no mínimo 10 dígitos');
                      return;
                    }
                    if (!tel.startsWith('55')) tel = '55' + tel;
                    if (!tel.startsWith('+')) tel = '+' + tel;
                    addContatoMutation.mutate({
                      telefone: tel,
                      tipo: e.target.tipo.value,
                      whatsapp: e.target.whatsapp.checked
                    });
                    e.target.reset();
                  }} className="space-y-3 pt-4 border-t">
                    <Input name="telefone" placeholder="Telefone (ex: +55 11 99999-9999)" required />
                    <select name="tipo" defaultValue="celular" className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)]">
                      <option value="celular">Celular</option>
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                    </select>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="whatsapp" />
                      <span className="text-sm">É WhatsApp?</span>
                    </label>
                    <Button type="submit" disabled={addContatoMutation.isPending} className="w-full">
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Telefone
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Endereços Tab */}
            <TabsContent value="enderecos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Endereços</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cliente?.endereco && (
                    <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                      <p className="text-sm text-[var(--text-secondary)]">Endereço Principal</p>
                      <p className="font-medium">{cliente.endereco.logradouro}, {cliente.endereco.numero}</p>
                      <p className="text-sm">{cliente.endereco.bairro}, {cliente.endereco.cidade} - {cliente.endereco.estado}</p>
                    </div>
                  )}

                  {cliente?.enderecos_adicionais?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Endereços Adicionais</p>
                      {cliente.enderecos_adicionais.map((e, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-primary)]">
                          <div>
                            <p className="font-medium">{e.logradouro}, {e.numero}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{e.tipo}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => {
                            const novos = cliente.enderecos_adicionais.filter((_, idx) => idx !== i);
                            updateClienteMutation.mutate({ enderecos_adicionais: novos });
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    addEndereceMutation.mutate({
                      tipo: e.target.tipo.value,
                      logradouro: e.target.logradouro.value,
                      numero: e.target.numero.value,
                      complemento: e.target.complemento.value,
                      bairro: e.target.bairro.value,
                      cidade: e.target.cidade.value,
                      estado: e.target.estado.value,
                      cep: e.target.cep.value
                    });
                    e.target.reset();
                  }} className="space-y-3 pt-4 border-t">
                    <select name="tipo" defaultValue="residencial" className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)]">
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                      <option value="correspondencia">Correspondência</option>
                    </select>
                    <Input name="logradouro" placeholder="Logradouro" required />
                    <Input name="numero" placeholder="Número" required />
                    <Input name="complemento" placeholder="Complemento (opcional)" />
                    <Input name="bairro" placeholder="Bairro" required />
                    <Input name="cidade" placeholder="Cidade" required />
                    <Input name="estado" placeholder="Estado" required />
                    <Input name="cep" placeholder="CEP" pattern="[0-9-]+" />
                    <Button type="submit" disabled={addEndereceMutation.isPending} className="w-full">
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Endereço
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inscrição OAB Tab (Admin/Equipe) */}
            {['admin', 'equipe'].includes(user.role) && (
              <TabsContent value="oab" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inscrições OAB</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {inscricoes.length === 0 ? (
                      <p className="text-sm text-[var(--text-secondary)]">Nenhuma inscrição OAB cadastrada</p>
                    ) : (
                      <div className="space-y-2">
                        {inscricoes.map((insc) => (
                          <div key={insc.id} className="p-3 rounded-lg border border-[var(--border-primary)]">
                            <p className="font-medium">{insc.numero}</p>
                            <p className="text-sm text-[var(--text-secondary)]">{insc.uf} • {insc.tipo}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <AdicionarInscricaoOABForm
                      escritorioId={escritorio?.id}
                      onSuccess={() => queryClient.invalidateQueries({ queryKey: ['inscricoes'] })}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          {/* Footer */}
          <div className="flex justify-between mt-8 pt-8 border-t border-[var(--border-primary)]">
            <Button variant="outline" onClick={() => navigate(createPageUrl('MeuPainel'))}>
              Voltar ao Painel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => base44.auth.logout(createPageUrl('Home'))}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
  );
}