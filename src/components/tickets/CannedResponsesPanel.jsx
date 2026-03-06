import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CannedResponsesPanel({ onSelectResponse }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newResponse, setNewResponse] = useState({ title: '', content: '', category: '', tags: '' });

  const { data: responses = [] } = useQuery({
    queryKey: ['canned_responses'],
    queryFn: () => base44.entities.CannedResponse.list(),
    initialData: []
  });

  const categories = [...new Set(responses.map(r => r.category).filter(Boolean))];

  const filteredResponses = responses.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleAddResponse = async () => {
    if (!newResponse.title.trim() || !newResponse.content.trim()) {
      toast.error('Preencha título e conteúdo');
      return;
    }

    try {
      await base44.entities.CannedResponse.create({
        ...newResponse,
        tags: newResponse.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      toast.success('Resposta adicionada!');
      setNewResponse({ title: '', content: '', category: '', tags: '' });
      setShowAddNew(false);
    } catch (error) {
      toast.error('Erro ao adicionar resposta');
    }
  };

  const handleUseResponse = (response) => {
    // Increment usage count
    base44.entities.CannedResponse.update(response.id, {
      usage_count: (response.usage_count || 0) + 1
    });
    onSelectResponse(response.content);
    toast.success('Resposta inserida!');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Respostas Prontas
        </CardTitle>
        <Dialog open={showAddNew} onOpenChange={setShowAddNew}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 bg-turquoise-600 hover:bg-turquoise-700">
              <Plus className="w-4 h-4" />
              Nova
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Resposta Pronta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                placeholder="Título"
                value={newResponse.title}
                onChange={(e) => setNewResponse({ ...newResponse, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                placeholder="Categoria (opcional)"
                value={newResponse.category}
                onChange={(e) => setNewResponse({ ...newResponse, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <Textarea
                placeholder="Conteúdo da resposta..."
                value={newResponse.content}
                onChange={(e) => setNewResponse({ ...newResponse, content: e.target.value })}
                className="min-h-32"
              />
              <input
                placeholder="Tags (separadas por vírgula)"
                value={newResponse.tags}
                onChange={(e) => setNewResponse({ ...newResponse, tags: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <Button onClick={handleAddResponse} className="w-full bg-turquoise-600">
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar resposta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        {/* Responses List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredResponses.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhuma resposta pronta</p>
          ) : (
            filteredResponses.map(response => (
              <div
                key={response.id}
                className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{response.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {response.content}
                    </p>
                    {response.category && (
                      <p className="text-xs text-gray-500 mt-1">📁 {response.category}</p>
                    )}
                    {response.usage_count > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Usado {response.usage_count}x</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUseResponse(response)}
                    className="flex-shrink-0 text-xs"
                  >
                    Usar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}