import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Copy, Trash2, Plus, RefreshCw } from 'lucide-react';

const AVAILABLE_SCOPES = [
  { id: 'tickets:read', label: 'Ler Tickets' },
  { id: 'tickets:write', label: 'Criar/Editar Tickets' },
  { id: 'tickets:delete', label: 'Deletar Tickets' },
  { id: 'reports:read', label: 'Ler Relatórios' },
  { id: 'analytics:read', label: 'Ler Analytics' },
  { id: 'admin:write', label: 'Acesso Admin' }
];

export default function APIKeyManager() {
  const queryClient = useQueryClient();
  const [showNewForm, setShowNewForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [copied, setCopied] = useState(null);
  const [newKey, setNewKey] = useState({
    name: '',
    description: '',
    scopes: ['tickets:read'],
    rate_limit: 1000
  });

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => base44.entities.APIKey.list(),
    initialData: []
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.APIKey.create({
      ...data,
      created_by: user?.email
    }),
    onSuccess: (result) => {
      toast.success('✅ Chave API criada!');
      toast(`🔑 Guarde em segurança: ${result.key.slice(0, 10)}...`, {
        duration: 10000
      });
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      setNewKey({
        name: '',
        description: '',
        scopes: ['tickets:read'],
        rate_limit: 1000
      });
      setShowNewForm(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.APIKey.delete(id),
    onSuccess: () => {
      toast.success('❌ Chave removida');
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id) => {
      const key = apiKeys.find(k => k.id === id);
      return base44.entities.APIKey.update(id, { is_active: !key.is_active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    }
  });

  const toggleScope = (scope) => {
    setNewKey({
      ...newKey,
      scopes: newKey.scopes.includes(scope)
        ? newKey.scopes.filter(s => s !== scope)
        : [...newKey.scopes, scope]
    });
  };

  const handleCreateKey = () => {
    if (!newKey.name.trim()) {
      toast.error('Digite um nome para a chave');
      return;
    }
    if (newKey.scopes.length === 0) {
      toast.error('Selecione pelo menos uma permissão');
      return;
    }
    createMutation.mutate(newKey);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Create New Key */}
      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>🔑 Nova Chave API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome da Chave</label>
                <Input
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  placeholder="Ex: Integração com app X"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Limite de Requisições/hora</label>
                <Input
                  type="number"
                  value={newKey.rate_limit}
                  onChange={(e) => setNewKey({ ...newKey, rate_limit: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Input
                value={newKey.description}
                onChange={(e) => setNewKey({ ...newKey, description: e.target.value })}
                placeholder="Para que serve esta chave?"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Permissões</label>
              <div className="space-y-2">
                {AVAILABLE_SCOPES.map(scope => (
                  <label key={scope.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newKey.scopes.includes(scope.id)}
                      onCheckedChange={() => toggleScope(scope.id)}
                    />
                    <span className="text-sm">{scope.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleCreateKey}
                disabled={createMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Criar Chave
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keys List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Chaves API ({apiKeys.length})</h3>
          {!showNewForm && (
            <Button
              onClick={() => setShowNewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Chave
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500 py-4">Carregando chaves...</p>
        ) : apiKeys.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhuma chave API criada</p>
        ) : (
          <div className="space-y-2">
            {apiKeys.map(key => (
              <Card key={key.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{key.name}</p>
                        <Badge variant={key.is_active ? 'default' : 'secondary'}>
                          {key.is_active ? '✓ Ativa' : '○ Inativa'}
                        </Badge>
                      </div>
                      {key.description && (
                        <p className="text-xs text-gray-600 mb-2">{key.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Key Display */}
                  <div className="bg-gray-100 rounded p-3 font-mono text-sm mb-3 flex items-center justify-between">
                    <span className="break-all">
                      {visibleKeys[key.id] ? key.key : `${key.key?.slice(0, 10)}...${key.key?.slice(-4)}`}
                    </span>
                    <div className="flex gap-2 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setVisibleKeys({
                          ...visibleKeys,
                          [key.id]: !visibleKeys[key.id]
                        })}
                      >
                        {visibleKeys[key.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(key.key, key.id)}
                      >
                        {copied === key.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Scopes and Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Permissões</p>
                      <div className="flex gap-1 flex-wrap">
                        {key.scopes.map(scope => (
                          <Badge key={scope} variant="outline" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Limite: {key.rate_limit}/hora</p>
                      <p>Usado: {key.usage_count} vezes</p>
                      {key.last_used && (
                        <p>Último uso: {new Date(key.last_used).toLocaleDateString('pt-BR')}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActiveMutation.mutate(key.id)}
                      className="flex-1"
                    >
                      {key.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(key.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {key.expires_at && (
                    <p className="text-xs text-orange-600 mt-2">
                      ⏰ Expira em {new Date(key.expires_at).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}