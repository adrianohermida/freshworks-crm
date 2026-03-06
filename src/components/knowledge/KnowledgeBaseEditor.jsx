import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Plus } from 'lucide-react';
import ReactQuill from 'react-quill';

export default function KnowledgeBaseEditor() {
  const queryClient = useQueryClient();
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    is_published: false,
    is_featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [tagInput, setTagInput] = useState('');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['knowledgeBaseArticles'],
    queryFn: () => base44.entities.KnowledgeBase.list(),
    initialData: []
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingId) {
        return base44.entities.KnowledgeBase.update(editingId, data);
      }
      return base44.entities.KnowledgeBase.create(data);
    },
    onSuccess: () => {
      toast.success(editingId ? '✏️ Artigo atualizado!' : '📝 Artigo criado!');
      queryClient.invalidateQueries({ queryKey: ['knowledgeBaseArticles', 'knowledgeBase'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.KnowledgeBase.delete(id),
    onSuccess: () => {
      toast.success('❌ Artigo removido');
      queryClient.invalidateQueries({ queryKey: ['knowledgeBaseArticles'] });
    }
  });

  const resetForm = () => {
    setNewArticle({
      title: '',
      content: '',
      category: '',
      tags: [],
      is_published: false,
      is_featured: false
    });
    setEditingId(null);
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newArticle.tags.includes(tagInput.trim())) {
      setNewArticle({
        ...newArticle,
        tags: [...newArticle.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleSave = () => {
    if (!newArticle.title.trim() || !newArticle.content.trim() || !newArticle.category.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    saveMutation.mutate({
      ...newArticle,
      author_email: user?.email,
      author_name: user?.full_name
    });
  };

  const categories = [...new Set(articles.map(a => a.category))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? '✏️ Editar Artigo' : '📝 Novo Artigo'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={newArticle.title}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              placeholder="Título do artigo"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Categoria *</label>
              <select
                value={newArticle.category}
                onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                <option value="">-- Selecione ou crie --</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="new">+ Nova categoria</option>
              </select>
              {newArticle.category === 'new' && (
                <Input
                  placeholder="Nome da nova categoria"
                  onBlur={(e) => {
                    if (e.target.value) {
                      setNewArticle({ ...newArticle, category: e.target.value });
                    }
                  }}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Digite e pressione Enter"
                  size="sm"
                />
                <Button onClick={handleAddTag} variant="outline" size="sm">
                  +
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {newArticle.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => setNewArticle({
                        ...newArticle,
                        tags: newArticle.tags.filter(t => t !== tag)
                      })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Conteúdo *</label>
            <Textarea
              value={newArticle.content}
              onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
              placeholder="Escreva o conteúdo (suporta Markdown)"
              className="min-h-48 mt-1"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newArticle.is_published}
                onChange={(e) => setNewArticle({ ...newArticle, is_published: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Publicado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newArticle.is_featured}
                onChange={(e) => setNewArticle({ ...newArticle, is_featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Destaque</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingId ? 'Atualizar' : 'Criar'} Artigo
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Artigos ({articles.length})</h3>
        {articles.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhum artigo criado</p>
        ) : (
          articles.map(article => (
            <Card key={article.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{article.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{article.category}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {article.is_published ? '✓ Publicado' : '○ Rascunho'}
                      {article.is_featured && ' • ⭐ Destaque'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(article.id);
                        setNewArticle(article);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(article.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}