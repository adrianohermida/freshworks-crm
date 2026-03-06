import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Award } from 'lucide-react';

export default function CommunityFeed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: { name: 'Ana Silva', role: 'Advogada', badge: 'expert' },
      title: 'Dica: Como calcular prazos processuais',
      content: 'Descobri um método eficaz para calcular prazos em 3 cliques...',
      likes: 245,
      comments: 18,
      shares: 42,
      liked: false,
      timestamp: '2h atrás'
    },
    {
      id: 2,
      author: { name: 'Carlos Mendes', role: 'Gestor Jurídico', badge: 'contributor' },
      title: 'Publicação importante do TJSP',
      content: 'Nova publicação sobre intimações processadas automaticamente...',
      likes: 189,
      comments: 12,
      shares: 28,
      liked: false,
      timestamp: '4h atrás'
    },
    {
      id: 3,
      author: { name: 'Legal Tasks Team', role: 'Oficial', badge: 'staff' },
      title: 'Release Notes v1.5.0',
      content: 'Lançamos novas funcionalidades de notificações inteligentes...',
      likes: 456,
      comments: 67,
      shares: 156,
      liked: false,
      timestamp: '1d atrás'
    }
  ]);

  const handleLike = (postId) => {
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'expert': return 'bg-gold-100 text-gold-800';
      case 'contributor': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* New Post Card */}
      <Card className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
          <input
            type="text"
            placeholder="Compartilhe uma dica, pergunta ou descoberta..."
            className="flex-1 outline-none text-sm bg-gray-50 rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex gap-2 mt-3 justify-end">
          <Button variant="outline" size="sm">Cancelar</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">Publicar</Button>
        </div>
      </Card>

      {/* Posts Feed */}
      {posts.map(post => (
        <Card key={post.id} className="p-4 hover:shadow-md transition">
          {/* Author Info */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{post.author.name}</p>
                  {post.author.badge && (
                    <Badge className={getBadgeColor(post.author.badge)}>
                      {post.author.badge === 'expert' && '⭐ Expert'}
                      {post.author.badge === 'contributor' && '🟦 Contributor'}
                      {post.author.badge === 'staff' && '👤 Staff'}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">{post.author.role} • {post.timestamp}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">⋮</button>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
            <p className="text-sm text-gray-700">{post.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2 transition ${
                post.liked ? 'text-red-600' : 'hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
              {post.likes}
            </button>
            <button className="flex items-center gap-2 hover:text-blue-600 transition">
              <MessageCircle className="w-4 h-4" />
              {post.comments}
            </button>
            <button className="flex items-center gap-2 hover:text-blue-600 transition">
              <Share2 className="w-4 h-4" />
              {post.shares}
            </button>
            <button className="flex items-center gap-2 hover:text-purple-600 transition">
              <Award className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </Card>
      ))}

      {/* Load More */}
      <div className="text-center pt-4">
        <Button variant="outline">Carregar mais posts</Button>
      </div>
    </div>
  );
}