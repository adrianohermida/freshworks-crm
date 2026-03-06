import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';

export default function KnowledgeBaseManager() {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await base44.functions.invoke('getKBCategories', {});
      setCategories(result.data?.categories || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!formData.name) {
      alert('Nome obrigatório');
      return;
    }

    setLoading(true);
    try {
      await base44.functions.invoke('createKBCategory', {
        name: formData.name,
        description: formData.description
      });
      setFormData({ name: '', description: '' });
      setIsCreating(false);
      await loadCategories();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Knowledge Base Manager</h2>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Item
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeTab === 'categories' ? 'default' : 'outline'}
          onClick={() => setActiveTab('categories')}
        >
          <FolderOpen className="h-4 w-4 mr-2" /> Categorias
        </Button>
        <Button
          variant={activeTab === 'articles' ? 'default' : 'outline'}
          onClick={() => setActiveTab('articles')}
        >
          Artigos
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'categories' ? 'Criar Categoria' : 'Criar Artigo'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder={activeTab === 'categories' ? 'Nome da categoria' : 'Título do artigo'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Textarea
              placeholder={activeTab === 'categories' ? 'Descrição' : 'Conteúdo do artigo'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
            />
            <div className="flex gap-2">
              <Button
                onClick={activeTab === 'categories' ? handleCreateCategory : () => {}}
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-sm text-gray-600">{cat.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}