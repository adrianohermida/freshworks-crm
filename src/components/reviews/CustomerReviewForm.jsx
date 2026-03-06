import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp } from 'lucide-react';

export default function CustomerReviewForm({ ticketId, onSuccess }) {
  const queryClient = useQueryClient();
  const [review, setReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    would_recommend: true,
    is_anonymous: false,
    aspects: {
      response_time: 5,
      solution_quality: 5,
      agent_professionalism: 5,
      overall_satisfaction: 5
    }
  });

  const { data: user } = React.useMemo(() => ({ data: {} }), []);

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.CustomerReview.create({
        ...data,
        ticket_id: ticketId,
        status: 'pending',
        reviewed_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast.success('⭐ Avaliação enviada! Obrigado!');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setReview({
        rating: 5,
        title: '',
        comment: '',
        would_recommend: true,
        is_anonymous: false,
        aspects: {
          response_time: 5,
          solution_quality: 5,
          agent_professionalism: 5,
          overall_satisfaction: 5
        }
      });
      if (onSuccess) onSuccess();
    }
  });

  const handleSubmit = () => {
    if (!review.title.trim() || !review.comment.trim()) {
      toast.error('Preencha título e comentário');
      return;
    }
    if (review.rating < 1 || review.rating > 5) {
      toast.error('Avaliação inválida');
      return;
    }
    submitMutation.mutate(review);
  };

  const renderStars = (value, onChange) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>⭐ Avalie seu Atendimento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Main Rating */}
        <div>
          <label className="text-sm font-medium block mb-2">
            Classificação Geral (1-5)
          </label>
          {renderStars(review.rating, (value) => setReview({ ...review, rating: value }))}
          <p className="text-xs text-gray-500 mt-1">{review.rating}/5 ⭐</p>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium">Título da Avaliação</label>
          <input
            type="text"
            value={review.title}
            onChange={(e) => setReview({ ...review, title: e.target.value })}
            placeholder="Ex: Atendimento excelente!"
            className="w-full px-3 py-2 border rounded-md text-sm mt-1"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium">Seu Comentário</label>
          <Textarea
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            placeholder="Conte-nos sobre sua experiência..."
            className="mt-1 h-24"
          />
        </div>

        {/* Aspect Ratings */}
        <div className="space-y-3 border-t pt-4">
          <p className="text-sm font-medium">Detalhes da Experiência</p>
          {[
            { key: 'response_time', label: '⏱️ Tempo de Resposta' },
            { key: 'solution_quality', label: '✅ Qualidade da Solução' },
            { key: 'agent_professionalism', label: '👤 Profissionalismo' },
            { key: 'overall_satisfaction', label: '😊 Satisfação Geral' }
          ].map(aspect => (
            <div key={aspect.key}>
              <p className="text-xs font-medium mb-2">{aspect.label}</p>
              {renderStars(
                review.aspects[aspect.key],
                (value) => setReview({
                  ...review,
                  aspects: { ...review.aspects, [aspect.key]: value }
                })
              )}
            </div>
          ))}
        </div>

        {/* Checkboxes */}
        <div className="space-y-2 border-t pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={review.would_recommend}
              onChange={(e) => setReview({ ...review, would_recommend: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">Recomendaria para outros clientes</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={review.is_anonymous}
              onChange={(e) => setReview({ ...review, is_anonymous: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">Publicar anonimamente</span>
          </label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <ThumbsUp className="w-4 h-4" />
          Enviar Avaliação
        </Button>
      </CardContent>
    </Card>
  );
}