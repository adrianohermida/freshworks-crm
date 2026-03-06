import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Search, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['geral', 'duvidas', 'sugestoes', 'bugs'];

export default function CommunityForumWidget() {
  const [tab, setTab] = useState('forum');
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'geral' });
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');

  const submitPost = async () => {
    setSubmitting(true);
    const res = await base44.functions.invoke('community/communityEngine', {
      action: 'create_post',
      post: newPost
    });
    if (res.data?.success) {
      setPosts([res.data.post, ...posts]);
      setCreating(false);
      setNewPost({ title: '', content: '', category: 'geral' });
    }
    setSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Comunidade
          </div>
          <div className="flex gap-2">
            {['forum', 'knowledge'].map(t => (
              <Button key={t} size="sm" variant={tab === t ? 'default' : 'outline'} onClick={() => setTab(t)}>
                {t === 'forum' ? 'Fórum' : 'Base de Conhecimento'}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border rounded px-3 gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              className="flex-1 py-2 text-sm outline-none"
              placeholder={tab === 'forum' ? 'Buscar discussões...' : 'Buscar artigos...'}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          {tab === 'forum' && (
            <Button size="sm" onClick={() => setCreating(!creating)}>
              <Plus className="w-4 h-4 mr-1" /> Nova Discussão
            </Button>
          )}
        </div>

        {creating && tab === 'forum' && (
          <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Título da discussão..."
              value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
              placeholder="Descreva sua dúvida ou sugestão..."
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
            />
            <div className="flex gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={newPost.category}
                onChange={e => setNewPost({ ...newPost, category: e.target.value })}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Button size="sm" onClick={submitPost} disabled={submitting || !newPost.title}>
                {submitting ? 'Publicando...' : 'Publicar'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setCreating(false)}>Cancelar</Button>
            </div>
          </div>
        )}

        {posts.length > 0 ? (
          <div className="space-y-2">
            {posts.map(post => (
              <div key={post.id} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{post.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{post.author?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {post.votes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">
              {tab === 'forum' ? 'Nenhuma discussão ainda. Seja o primeiro!' : 'Base de conhecimento em construção.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}