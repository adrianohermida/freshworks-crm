import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

import { useErrorReporting } from '@/components/hooks/useErrorReporting';
import { usePerformanceTracker } from '@/components/hooks/usePerformanceTracker';
import { InstrumentedErrorBoundary } from '@/components/debug/InstrumentedErrorBoundary';
import ClientesHeaderCompacta from '@/components/clientes/ClientesHeaderCompacta';
import ClienteFormModal from '@/components/clientes/ClienteFormModal';
import ClientesFiltrosDrawer from '@/components/clientes/ClientesFiltrosDrawer';
import ClienteListaCompacta from '@/components/clientes/ClienteListaCompacta';
import LoadingState from '@/components/common/LoadingState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientesTab from '@/components/clientes/tabs/ClientesTab';
import PartesTab from '@/components/clientes/tabs/PartesTab';
import AdvogadosTab from '@/components/clientes/tabs/AdvogadosTab';
import { Users, UserCircle, Scale } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Clientes() {
  usePerformanceTracker('Clientes');
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { wrapQuery, wrapMutation } = useErrorReporting();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [activeTab, setActiveTab] = useState('clientes');
  const [tipoPessoa, setTipoPessoa] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState({
    tipo: 'todos',
    profissao: '',
    dataCriacaoInicio: null,
    dataCriacaoFim: null
  });

  const { data: user } = useQuery(wrapQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000
  }, 'PAGE_LOAD', 'usuário'));

  const { data: escritorio } = useQuery(wrapQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      if (user.role === 'admin' && user.email === 'adrianohermida@gmail.com') {
        const result = await base44.entities.Escritorio.list();
        return result[0];
      }
      const result = await base44.entities.Escritorio.filter({ created_by: user.email });
      return result[0];
    },
    enabled: !!user
  }, 'ENTITIES', 'escritório'));

  const { data: clientes = [], isLoading } = useQuery(wrapQuery({
    queryKey: ['clientes', escritorio?.id, user?.email],
    queryFn: async () => {
      if (!escritorio?.id || !user) return [];
      
      // Admin: vê todos os clientes do escritório
      // User: vê apenas clientes criados por ele
      if (user.role === 'admin') {
        return base44.entities.Cliente.filter({ 
          escritorio_id: escritorio.id 
        }, '-updated_date', 1000);
      } else {
        return base44.entities.Cliente.filter({
          escritorio_id: escritorio.id,
          created_by: user.email
        }, '-updated_date', 1000);
      }
    },
    enabled: !!escritorio?.id && !!user,
    staleTime: 2 * 60 * 1000,
    retry: 2
  }, 'ENTITIES', 'clientes'));

  const createMutation = useMutation(wrapMutation({
    mutationFn: (data) => base44.entities.Cliente.create({ ...data, escritorio_id: escritorio.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
      setShowForm(false);
      setEditingCliente(null);
      toast.success('Cliente criado com sucesso!');
    }
  }, 'ENTITIES', 'criar cliente'));

  const updateMutation = useMutation(wrapMutation({
    mutationFn: ({ id, data }) => base44.entities.Cliente.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
      setShowForm(false);
      setEditingCliente(null);
      toast.success('Cliente atualizado!');
    }
  }, 'ENTITIES', 'atualizar cliente'));

  const handleSubmit = (data) => {
    if (editingCliente) {
      updateMutation.mutate({ id: editingCliente.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Validar que clientes pertencem ao escritório (RLS)
  const clientesValidados = clientes.filter(c => c.escritorio_id === escritorio?.id);

  // Filtrar por status
  const clientesFiltradosStatus = clientesValidados
    .filter(c => filtroStatus === 'todos' || c.status === filtroStatus);

  // Filtrar por busca (nome, email, telefone)
  const clientesFiltradosBusca = clientesFiltradosStatus.filter(c => {
    if (!searchTerm.trim()) return true;
    const termo = searchTerm.toLowerCase();
    return (
      c.nome?.toLowerCase().includes(termo) ||
      c.email?.toLowerCase().includes(termo) ||
      c.telefone?.includes(termo) ||
      c.cpf_cnpj?.includes(termo)
    );
  });

  // Filtros avançados
  const clientesFiltrados = clientesFiltradosBusca.filter(c => {
    if (filtrosAvancados.tipo !== 'todos' && c.tipo !== filtrosAvancados.tipo) return false;
    if (filtrosAvancados.profissao && !c.profissao?.includes(filtrosAvancados.profissao)) return false;
    if (filtrosAvancados.dataCriacaoInicio) {
      const dataCriacao = new Date(c.created_date);
      if (dataCriacao < new Date(filtrosAvancados.dataCriacaoInicio)) return false;
    }
    if (filtrosAvancados.dataCriacaoFim) {
      const dataCriacao = new Date(c.created_date);
      if (dataCriacao > new Date(filtrosAvancados.dataCriacaoFim)) return false;
    }
    return true;
  });

  const handleViewDetails = (cliente) => {
    navigate(createPageUrl('ClienteDetalhes') + `?id=${cliente.id}`);
  };

  const handleNewCliente = (tipo = null) => {
    setEditingCliente(null);
    setTipoPessoa(tipo);
    setShowForm(true);
  };

  const handleChat = (cliente) => {
    if (!cliente.email) {
      toast.error('Cliente não possui email cadastrado');
      return;
    }
    const event = new CustomEvent('openChatWithClient', {
      detail: {
        clienteEmail: cliente.email,
        clienteNome: cliente.nome,
        clienteId: cliente.id
      }
    });
    window.dispatchEvent(event);
  };

  const handleBuscar = useCallback((termo) => {
    setSearchTerm(termo);
    // Auditoria não-bloqueante
    base44.functions.invoke('auditarBuscaClientesAvancada', {
      escritorio_id: escritorio?.id,
      busca_termo: termo,
      filtros: filtrosAvancados
    }).catch(err => console.warn('Auditoria falhou:', err));
  }, [escritorio?.id, filtrosAvancados]);

  const handleArquivar = (cliente) => {
    const updateMutation = useMutation(wrapMutation({
      mutationFn: ({ id, data }) => base44.entities.Cliente.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries(['clientes']);
        toast.success('Cliente arquivado');
      }
    }, 'ENTITIES', 'arquivar cliente'));
    
    updateMutation.mutate({ 
      id: cliente.id, 
      data: { status: 'arquivado' } 
    });
  };

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newParam = params.get('new');
    if (newParam === 'pf' || newParam === 'pj') {
      handleNewCliente(newParam);
      window.history.replaceState({}, '', createPageUrl('Clientes'));
    }
  }, [location.search]);

  if (isLoading) return <LoadingState message="Carregando clientes..." />;

  return (
    <InstrumentedErrorBoundary category="ROUTES">
      <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col">

      {/* Header Compacto */}
      <ClientesHeaderCompacta
        searchTerm={searchTerm}
        onSearchChange={handleBuscar}
        filtroStatus={filtroStatus}
        onFiltroStatusChange={setFiltroStatus}
        onFiltersToggle={() => setShowFiltros(true)}
        onNovoCliente={() => handleNewCliente()}
        totalClientes={clientesFiltrados.length}
        filtrosAtivos={Object.values(filtrosAvancados).some(v => v && v !== 'todos' && v !== '')}
      />

      {/* Drawer Filtros Avançados */}
      <ClientesFiltrosDrawer
        open={showFiltros}
        onClose={() => setShowFiltros(false)}
        filtros={filtrosAvancados}
        onFiltrosChange={(filtros) => {
          setFiltrosAvancados(filtros);
          // Auditoria
          base44.functions.invoke('auditarBuscaClientesAvancada', {
            escritorio_id: escritorio?.id,
            busca_termo: searchTerm,
            filtros: filtros
          }).catch(err => console.warn('Auditoria falhou:', err));
        }}
      />

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="space-y-6">

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="clientes" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Clientes
                </TabsTrigger>
                <TabsTrigger value="partes" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Partes
                </TabsTrigger>
                <TabsTrigger value="advogados" className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Advogados
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clientes" className="mt-6">
                <ClienteListaCompacta
                  clientes={clientesFiltrados}
                  isLoading={isLoading}
                  onEdit={(cliente) => {
                    setEditingCliente(cliente);
                    setShowForm(true);
                  }}
                  onViewDetails={handleViewDetails}
                  onChat={handleChat}
                  onAgendar={(cliente) => {
                    navigate(createPageUrl('AgendarConsulta') + `?clienteId=${cliente.id}`);
                  }}
                  onArquivar={handleArquivar}
                  onNovoCliente={handleNewCliente}
                />
              </TabsContent>

              <TabsContent value="partes" className="mt-6">
                <PartesTab escritorioId={escritorio?.id} />
              </TabsContent>

              <TabsContent value="advogados" className="mt-6">
                <AdvogadosTab escritorioId={escritorio?.id} />
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <ClienteFormModal
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingCliente(null);
          }}
          onSubmit={handleSubmit}
          cliente={editingCliente}
          escritorioId={escritorio?.id}
          tipoPessoa={tipoPessoa}
        />
      )}

      </div>
    </InstrumentedErrorBoundary>
  );
}