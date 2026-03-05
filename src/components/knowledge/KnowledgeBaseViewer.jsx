import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ThumbsUp, ThumbsDown, Eye, Star, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function KnowledgeBaseViewer() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [userVoted, setUserVoted] = useState({});

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: () => base44.entities.KnowledgeBase.filter({ is_published: true }),
    initialData: []
  });

  const viewMutation = useMutation({
    mutationFn: (articleId) => {
      const article = articles.find(a => a.id === articleId);
      return base44.entities.KnowledgeBase.update(articleId, {
        views_count: (article.views_count || 0) + 1
      });
    }
  });

  const voteMutation = useMutation({
    mutationFn: ({ articleId, type }) => {
      const article = articles.find(a => a.id === articleId);
      const updateData = {};
      if (type === 'helpful') {
        updateData.helpful_count = (article.helpful_count || 0) + 1;
      } else {
        updateData.unhelpful_count = (article.unhelpful_count || 0) + 1;
      }
      return base44.entities.KnowledgeBase.update(articleId, updateData);
    },
    onSuccess: () => {
      toast.success('Obrigado pelo feedback!');
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] });
    }
  });

  const categories = [...new Set(articles.map(a => a.category))];
  const filteredArticles = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || a.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  if (selectedArticle) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedArticle(null);
            setUserVoted({});
          }}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge>{selectedArticle.category}</Badge>
                {selectedArticle.is_featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">⭐ Destaque</Badge>
                )}
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedArticle.views_count || 0} visualizações
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Por {selectedArticle.author_name} • {new Date(selectedArticle.created_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
            </div>

            {selectedArticle.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedArticle.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Helpful Vote */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Este artigo foi útil?</p>
              <div className="flex gap-3">
                <Button
                  variant={userVoted[selectedArticle.id] === 'helpful' ? 'default' : 'outline'}
                  onClick={() => {
                    voteMutation.mutate({ articleId: selectedArticle.id, type: 'helpful' });
                    setUserVoted({ ...userVoted, [selectedArticle.id]: 'helpful' });
                  }}
                  className="gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Útil ({selectedArticle.helpful_count || 0})
                </Button>
                <Button
                  variant={userVoted[selectedArticle.id] === 'unhelpful' ? 'default' : 'outline'}
                  onClick={() => {
                    voteMutation.mutate({ articleId: selectedArticle.id, type: 'unhelpful' });
                    setUserVoted({ ...userVoted, [selectedArticle.id]: 'unhelpful' });
                  }}
                  className="gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Não Útil ({selectedArticle.unhelpful_count || 0})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>📚 Base de Conhecimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              Todos ({articles.length})
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ({articles.filter(a => a.category === cat).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Carregando artigos...</p>
        ) : filteredArticles.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum artigo encontrado</p>
        ) : (
          filteredArticles.map(article => (
            <Card
              key={article.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedArticle(article);
                viewMutation.mutate(article.id);
              }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm line-clamp-2">{article.title}</h3>
                  {article.is_featured && <Star className="w-4 h-4 text-yellow-500" />}
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{article.content}</p>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <Badge variant="outline" className="text-xs">{article.category}</Badge>
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views_count || 0}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <ThumbsUp className="w-3 h-3" />
                  {article.helpful_count || 0}
                  <ThumbsDown className="w-3 h-3 ml-2" />
                  {article.unhelpful_count || 0}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}