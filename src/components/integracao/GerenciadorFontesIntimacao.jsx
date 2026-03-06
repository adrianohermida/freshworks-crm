import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, CheckCircle2, Trash2, Plus, Settings } from 'lucide-react';

export default function GerenciadorFontesIntimacao() {
  const [showForm, setShowForm] = useState(false);
  const [selectedFonte, setSelectedFonte] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [dadoAcesso, setDadoAcesso] = useState('');
  const [senha, setSenha] = useState('');
  const [autenticacao, setAutenticacao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const queryClient = useQueryClient();

  // Consultar fontes disponíveis (desabilitar auto-fetch)
  const { data: fontes = [], isLoading: fontesLoading } = useQuery({
    queryKey: ['fontesIntimacao'],
    queryFn: async () => {
      const response = await base44.functions.invoke('consultarFontesIntimacao', {
        registrosPorPagina: 50,
        paginaAtual: 1
      });
      return response.data.fontes || [];
    },
    enabled: false,
    staleTime: Infinity
  });

  // Consultar configurações cadastradas (desabilitar auto-fetch)
  const { data: configs = [], isLoading: configsLoading } = useQuery({
    queryKey: ['configIntimacao'],
    queryFn: async () => {
      const configs = await base44.entities.ConfigIntimacao.list();
      return configs;
    },
    enabled: false,
    staleTime: Infinity
  });

  // Mutation para cadastrar credenciais
  const cadastroMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('cadastrarCredenciaisIntimacao', data);
      return response.data;
    },
    onSuccess: (data) => {
      setMensagem(`✓ Credenciais cadastradas com sucesso para ${data.fonte}`);
      queryClient.invalidateQueries({ queryKey: ['configIntimacao'] });
      resetForm();
      setTimeout(() => setMensagem(''), 3000);
    },
    onError: (error) => {
      setMensagem(`✗ Erro: ${error.message}`);
    }
  });

  // Mutation para deletar configuração
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.ConfigIntimacao.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configIntimacao'] });
    }
  });

  const resetForm = () => {
    setShowForm(false);
    setSelectedFonte('');
    setNomeResponsavel('');
    setDadoAcesso('');
    setSenha('');
    setAutenticacao('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFonte || !dadoAcesso || !senha) {
      setMensagem('Preencha todos os campos obrigatórios');
      return;
    }

    cadastroMutation.mutate({
      idFonteXTipoPesquisa: selectedFonte,
      nomeResponsavel,
      dadoAcesso,
      senha,
      autenticacao: autenticacao || undefined
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'erro':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fonteNome = (fonte) => {
    const f = fontes.find(fn => fn.idFonteXTipoPesquisa?.toString() === fonte);
    return f?.nomeFonte || fonte;
  };

  return (
    <div className="space-y-6">
      {/* Mensagem de Feedback */}
      {mensagem && (
        <Alert className={mensagem.startsWith('✓') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          {mensagem.startsWith('✓') ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={mensagem.startsWith('✓') ? 'text-green-800' : 'text-red-800'}>
            {mensagem}
          </AlertDescription>
        </Alert>
      )}

      {/* Formulário de Cadastro */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Fonte de Intimação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fonte de Intimação *</label>
                <Select value={selectedFonte} onValueChange={setSelectedFonte}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fonte..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fontesLoading ? (
                      <div className="p-2 text-sm text-gray-500">Carregando...</div>
                    ) : (
                      fontes.map((fonte) => (
                        <SelectItem
                          key={fonte.idFonteXTipoPesquisa}
                          value={fonte.idFonteXTipoPesquisa?.toString()}
                        >
                          {fonte.nomeFonte}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nome do Responsável</label>
                <Input
                  placeholder="Seu nome (opcional)"
                  value={nomeResponsavel}
                  onChange={(e) => setNomeResponsavel(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dado de Acesso * (email, CPF, CNPJ)</label>
                <Input
                  placeholder="Digite seu email, CPF ou CNPJ"
                  value={dadoAcesso}
                  onChange={(e) => setDadoAcesso(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Senha *</label>
                <Input
                  type="password"
                  placeholder="Senha de acesso"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Código QR (2FA) - Opcional</label>
                <Input
                  placeholder="Código para autenticação de 2 fatores"
                  value={autenticacao}
                  onChange={(e) => setAutenticacao(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Se a fonte exigir 2FA, insira o código aqui</p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={cadastroMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={cadastroMutation.isPending}
                >
                  {cadastroMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar Fonte'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Configurações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Fontes Configuradas ({configs.length})
            </CardTitle>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Fonte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {configsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : configs.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>Nenhuma fonte configurada</p>
              <p className="text-sm mt-1">Clique em "Nova Fonte" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-gray-900">{fonteNome(config.idFonteXTipoPesquisa)}</p>
                        <Badge className={getStatusColor(config.status)}>
                          {config.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Responsável:</strong> {config.nomeResponsavel}</p>
                        <p><strong>Acesso:</strong> {config.dadoAcesso}</p>
                        <p className="text-xs text-gray-500">
                          Cadastrado: {new Date(config.dataCadastro).toLocaleDateString('pt-BR')}
                        </p>
                        {config.ultimaSincronizacao && (
                          <p className="text-xs text-gray-500">
                            Última sincronização: {new Date(config.ultimaSincronizacao).toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja remover esta fonte?')) {
                          deleteMutation.mutate(config.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dicas */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm text-blue-900">💡 Dicas</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>• Você pode configurar múltiplas fontes de intimação</p>
          <p>• Use credenciais diferentes para cada tribunal/instância</p>
          <p>• Ative 2FA quando a fonte exigir autenticação de 2 fatores</p>
          <p>• A sincronização é feita automaticamente a cada 24 horas</p>
        </CardContent>
      </Card>
    </div>
  );
}