import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Download, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditorTemplate from '@/components/EditorTemplate';

const CATEGORIAS = {
  contrato: { label: 'Contrato', color: 'bg-blue-100 text-blue-800' },
  acordo: { label: 'Acordo', color: 'bg-purple-100 text-purple-800' },
  formulario: { label: 'Formulário', color: 'bg-green-100 text-green-800' },
  procuracao: { label: 'Procuração', color: 'bg-orange-100 text-orange-800' },
  instrumento: { label: 'Instrumento', color: 'bg-red-100 text-red-800' },
  declaracao: { label: 'Declaração', color: 'bg-yellow-100 text-yellow-800' },
  termo: { label: 'Termo', color: 'bg-indigo-100 text-indigo-800' },
  outro: { label: 'Outro', color: 'bg-gray-100 text-gray-800' }
};

export default function BibliotecaTemplates() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const queryClient = useQueryClient();

  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [modalNovoTemplate, setModalNovoTemplate] = useState(false);
  const [templateEditando, setTemplateEditando] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    nome: '',
    descricao: '',
    categoria: 'contrato',
    conteudo: '',
    campos: [],
    paginas: 1,
    publico: false,
    tags: []
  });

  // Buscar templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.TemplateDocumento.list('-created_date', 50),
    initialData: []
  });

  // Salvar template
  const salvarMutation = useMutation({
    mutationFn: async (dados) => {
      if (templateEditando) {
        await base44.entities.TemplateDocumento.update(templateEditando.id, dados);
      } else {
        await base44.entities.TemplateDocumento.create(dados);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setModalNovoTemplate(false);
      setTemplateEditando(null);
      setTemplateForm({
        nome: '',
        descricao: '',
        categoria: 'contrato',
        conteudo: '',
        campos: [],
        paginas: 1,
        publico: false,
        tags: []
      });
    }
  });

  // Deletar template
  const deletarMutation = useMutation({
    mutationFn: async (templateId) => {
      await base44.entities.TemplateDocumento.delete(templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });

  const handleNovoTemplate = () => {
    setTemplateEditando(null);
    setTemplateForm({
      nome: '',
      descricao: '',
      categoria: 'contrato',
      conteudo: '',
      campos: [],
      paginas: 1,
      publico: false,
      tags: []
    });
    setModalNovoTemplate(true);
  };

  const handleEditarTemplate = (template) => {
    setTemplateEditando(template);
    setTemplateForm(template);
    setModalNovoTemplate(true);
  };

  const handleSalvar = () => {
    if (!templateForm.nome || !templateForm.conteudo || templateForm.campos.length === 0) {
      alert('Preencha nome, conteúdo e adicione pelo menos um campo');
      return;
    }
    salvarMutation.mutate(templateForm);
  };

  const templatesFiltrados = templates.filter(t => {
    const buscaMatch = t.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       t.descricao.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch = !filtroCategoria || t.categoria === filtroCategoria;
    return buscaMatch && categoriaMatch;
  });

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} py-12 px-4 sm:px-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
            <FileText className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            Biblioteca de Templates
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Crie, organize e reutilize templates de documentos
          </p>
        </div>

        {/* Controles */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="sm:col-span-2">
            <Input
              placeholder="Buscar templates..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className={`px-3 py-2 rounded-md border ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="">Todas categorias</option>
            {Object.entries(CATEGORIAS).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botão Novo Template */}
        <Button
          onClick={handleNovoTemplate}
          className="mb-8 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>

        {/* Modal Editor */}
        <Dialog open={modalNovoTemplate} onOpenChange={setModalNovoTemplate}>
          <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-gray-800 border-gray-700' : ''
          }`}>
            <DialogHeader>
              <DialogTitle>
                {templateEditando ? 'Editar Template' : 'Criar Novo Template'}
              </DialogTitle>
            </DialogHeader>

            <EditorTemplate
              template={templateForm}
              onChange={setTemplateForm}
            />

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setModalNovoTemplate(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSalvar}
                disabled={salvarMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {salvarMutation.isPending ? 'Salvando...' : 'Salvar Template'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Grid de Templates */}
        {isLoading ? (
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="py-12 text-center">
              <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                isDark ? 'border-blue-400' : 'border-blue-600'
              }`}></div>
              <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Carregando templates...
              </p>
            </CardContent>
          </Card>
        ) : templatesFiltrados.length === 0 ? (
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="py-12 text-center">
              <FileText className={`w-12 h-12 mx-auto mb-4 ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Nenhum template encontrado
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templatesFiltrados.map((template) => {
              const categInfo = CATEGORIAS[template.categoria];
              return (
                <Card
                  key={template.id}
                  className={`flex flex-col ${isDark ? 'bg-gray-800 border-gray-700' : ''} hover:shadow-md transition`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {template.nome}
                        </CardTitle>
                        <Badge className={`mt-2 ${categInfo.color}`}>
                          {categInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pb-4">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                      {template.descricao}
                    </p>

                    <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                            Campos
                          </p>
                          <p className="font-semibold">
                            {template.campos.length}
                          </p>
                        </div>
                        <div>
                          <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                            Downloads
                          </p>
                          <p className="font-semibold">
                            {template.downloads || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditarTemplate(template)}
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="flex-1"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletarMutation.mutate(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}