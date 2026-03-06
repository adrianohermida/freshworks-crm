import React, { useState, useCallback } from 'react';
import { Search, RefreshCw, ChevronRight, AlertCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import TPUDetailedViewer from './TPUDetailedViewer';
import TPUSyncActions from './TPUSyncActions';

const TABELAS = [
  { id: 'assuntos', label: '📋 Assuntos Processuais', icone: '📋' },
  { id: 'classes', label: '📑 Classes Processuais', icone: '📑' },
  { id: 'movimentos', label: '⚡ Movimentos Processuais', icone: '⚡' },
  { id: 'documentos', label: '📄 Documentos Processuais', icone: '📄' }
];

const FILTROS_CAMPOS = {
  codigo: 'Código',
  nome: 'Nome',
  glossario: 'Glossário'
};

export default function TPUConsultaPublica() {
  const [tabelaSelecionada, setTabelaSelecionada] = useState('assuntos');
  const [filtros, setFiltros] = useState({ codigo: '', nome: '', glossario: '' });
  const [dados, setDados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [erro, setErro] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const consultar = useCallback(async () => {
    setIsLoading(true);
    setErro(null);

    try {
      const params = new URLSearchParams({
        tabela: tabelaSelecionada,
        ...Object.fromEntries(Object.entries(filtros).filter(([_, v]) => v))
      });

      const { data } = await base44.functions.invoke('consultarTPU', {
        tabela: tabelaSelecionada,
        codigo: filtros.codigo,
        nome: filtros.nome,
        glossario: filtros.glossario
      });

      setDados(data?.data || []);
      setTotal(data?.count || 0);
    } catch (error) {
      setErro(error.message);
      setDados([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [tabelaSelecionada, filtros]);

  const tabelaInfo = TABELAS.find(t => t.id === tabelaSelecionada);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-2xl font-bold flex items-center gap-2">
          🔍 Consulta Pública TPU - CNJ
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Consulte dados oficiais das Tabelas Processuais Unificadas do Conselho Nacional de Justiça
        </p>
      </div>

      {/* FILTROS */}
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Seletor de Tabela */}
          <div className="lg:col-span-3">
            <label className="text-sm font-semibold block mb-2">Selecionar Tabela</label>
            <Select value={tabelaSelecionada} onValueChange={setTabelaSelecionada}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma tabela" />
              </SelectTrigger>
              <SelectContent>
                {TABELAS.map(tabela => (
                  <SelectItem key={tabela.id} value={tabela.id}>
                    {tabela.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtros de Busca */}
          {Object.entries(FILTROS_CAMPOS).map(([campo, label]) => (
            <div key={campo}>
              <label className="text-sm font-semibold block mb-2">{label}</label>
              <Input
                placeholder={`Digite ${label.toLowerCase()}...`}
                value={filtros[campo]}
                onChange={(e) => handleFiltroChange(campo, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && consultar()}
              />
            </div>
          ))}
        </div>

        {/* Botão Consultar */}
        <div className="flex gap-2">
          <Button
            onClick={consultar}
            disabled={isLoading}
            className="gap-2 bg-cyan-600 hover:bg-cyan-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Consultando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Consultar
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setFiltros({ codigo: '', nome: '', glossario: '' })}
            disabled={isLoading || !Object.values(filtros).some(v => v)}
          >
            Limpar Filtros
          </Button>
        </div>
      </Card>

      {/* RESULTADO */}
      {erro && (
        <Card className="p-4 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">Erro na Consulta</p>
              <p className="text-sm text-red-800 dark:text-red-200">{erro}</p>
            </div>
          </div>
        </Card>
      )}

      {/* AÇÕES COM DADOS */}
      {dados.length > 0 && (
        <TPUSyncActions
          dados={dados}
          tabela={tabelaSelecionada}
          onSyncComplete={() => {
            setFiltros({ codigo: '', nome: '', glossario: '' });
            setDados([]);
            setTotal(0);
          }}
        />
      )}

      {/* TOTAL DE RESULTADOS */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <Badge className="text-base px-3 py-1">
            {total} resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
          </Badge>
          <p className="text-xs text-gray-500">Máximo 10 registros por consulta (padrão TPU)</p>
        </div>
      )}

      {/* MODAL DE DETALHES */}
      {itemSelecionado && (
        <TPUDetailedViewer
          item={itemSelecionado}
          tabela={tabelaSelecionada}
          onClose={() => setItemSelecionado(null)}
        />
      )}

      {/* VIEW EM TABELA */}
      {dados.length > 0 && (
        <Card className="p-6 overflow-x-auto">
          <h4 className="font-semibold mb-4">📊 Visualização em Tabela</h4>
          <table className="w-full text-sm">
            <thead className="border-b-2 border-gray-200 dark:border-gray-700">
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="pb-3 font-semibold">Código</th>
                <th className="pb-3 font-semibold">Nome</th>
                <th className="pb-3 font-semibold">Descrição</th>
                <th className="pb-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="space-y-1">
              {dados.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 font-mono font-semibold">{item.cod_item || item.codigo}</td>
                  <td className="py-3">{item.nome}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400 text-xs">{(item.dscGlossario || item.descricao_glossario || '-').substring(0, 50)}</td>
                  <td className="py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setItemSelecionado(item)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* LISTA DE DADOS (Card view) */}
      <div className="space-y-3">
        {dados.length > 0 ? (
          dados.map((item, idx) => (
            <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Código */}
                {(item.cod_item || item.codigo) && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Código</p>
                    <p className="font-semibold">{item.cod_item || item.codigo}</p>
                  </div>
                )}

                {/* Nome */}
                {item.nome && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Nome</p>
                    <p className="font-semibold line-clamp-2">{item.nome}</p>
                  </div>
                )}

                {/* Data */}
                {(item.data_versao || item.dat_inclusao) && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Versão</p>
                    <p className="text-sm">
                      {new Date(item.data_versao || item.dat_inclusao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}

                {/* Descrição (glossário) */}
                {(item.dscGlossario || item.descricao_glossario) && (
                  <div className="md:col-span-3">
                    <p className="text-xs text-gray-500 mb-1">Descrição</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {item.dscGlossario || item.descricao_glossario}
                    </p>
                  </div>
                )}

                {/* Botão Detalhes */}
                <div className="md:col-span-1 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setItemSelecionado(item)}
                    className="gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Detalhes
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          !isLoading && total === 0 && Object.values(filtros).some(v => v) && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Nenhum resultado encontrado</p>
            </div>
          )
        )}

        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 mx-auto text-gray-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Consultando API do CNJ...</p>
          </div>
        )}

        {!isLoading && total === 0 && !Object.values(filtros).some(v => v) && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Digite um filtro e clique em Consultar</p>
          </div>
        )}
      </div>
    </div>
  );
}