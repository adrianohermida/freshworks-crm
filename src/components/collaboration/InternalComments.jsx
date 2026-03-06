import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pin, Trash2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function InternalComments({ ticketId }) {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [mentions, setMentions] = useState([]);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['internalComments', ticketId],
    queryFn: () => base44.entities.InternalComment.filter({ ticket_id: ticketId }),
    initialData: []
  });

  const createCommentMutation = useMutation({
    mutationFn: (data) => base44.entities.InternalComment.create(data),
    onSuccess: () => {
      toast.success('💬 Comentário adicionado');
      queryClient.invalidateQueries({ queryKey: ['internalComments', ticketId] });
      setCommentText('');
      setMentions([]);
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id) => base44.entities.InternalComment.delete(id),
    onSuccess: () => {
      toast.success('❌ Comentário removido');
      queryClient.invalidateQueries({ queryKey: ['internalComments', ticketId] });
    }
  });

  const pinCommentMutation = useMutation({
    mutationFn: (id) => base44.entities.InternalComment.update(id, { is_pinned: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internalComments', ticketId] });
    }
  });

  const resolveCommentMutation = useMutation({
    mutationFn: (id) => base44.entities.InternalComment.update(id, { resolved_status: 'resolved' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internalComments', ticketId] });
    }
  });

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast.error('Comentário não pode ser vazio');
      return;
    }
    createCommentMutation.mutate({
      ticket_id: ticketId,
      author_email: user?.email,
      author_name: user?.full_name,
      content: commentText,
      mentions: mentions
    });
  };

  const pinnedComments = comments.filter(c => c.is_pinned);
  const regularComments = comments.filter(c => !c.is_pinned);

  if (isLoading) return <div>Carregando comentários...</div>;

  return (
    <div className="space-y-4">
      {/* Add Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">💬 Adicionar Comentário Interno</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escreva um comentário interno (não será visto pelo cliente)..."
            className="min-h-24"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAddComment}
              disabled={createCommentMutation.isPending || !commentText.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Comentar
            </Button>
            <Button variant="outline" size="sm">
              @ Mencionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pinned Comments */}
      {pinnedComments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-amber-700">📌 Comentários Fixados</h4>
          {pinnedComments.map((comment) => (
            <Card key={comment.id} className="border-amber-200 bg-amber-50">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{comment.author_name}</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(comment.created_date), 'PPP p', { locale: ptBR })}
                    </p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 text-xs">📌 Fixado</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
                <div className="flex gap-2">
                  {comment.resolved_status !== 'resolved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveCommentMutation.mutate(comment.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Resolver
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Regular Comments */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">Comentários ({regularComments.length})</h4>
        {regularComments.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhum comentário ainda</p>
        ) : (
          regularComments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{comment.author_name}</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(comment.created_date), 'PPP p', { locale: ptBR })}
                    </p>
                  </div>
                  {comment.resolved_status === 'resolved' && (
                    <Badge className="bg-green-100 text-green-800 text-xs">✓ Resolvido</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pinCommentMutation.mutate(comment.id)}
                  >
                    <Pin className="w-4 h-4 mr-1" />
                    Fixar
                  </Button>
                  {comment.resolved_status !== 'resolved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveCommentMutation.mutate(comment.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Resolver
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}