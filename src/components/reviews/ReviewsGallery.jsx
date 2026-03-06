import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';

export default function ReviewsGallery({ ticketId, limit = 10 }) {
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState(null);
  const [filterRating, setFilterRating] = useState('all');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', ticketId],
    queryFn: () => base44.entities.CustomerReview.filter({
      status: 'published'
    }),
    initialData: []
  });

  const helpfulMutation = useMutation({
    mutationFn: ({ id, helpful }) => {
      const review = reviews.find(r => r.id === id);
      return base44.entities.CustomerReview.update(id, {
        helpful_count: helpful ? review.helpful_count + 1 : review.helpful_count,
        unhelpful_count: !helpful ? review.unhelpful_count + 1 : review.unhelpful_count
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    return r.rating === parseInt(filterRating);
  }).slice(0, limit);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Resumo de Avaliações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{avgRating}</p>
              <div className="flex gap-1 justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">{reviews.length} avaliações</p>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${reviews.length ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-6 text-right">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div>
        <p className="text-sm font-medium mb-2">Filtrar por Avaliação</p>
        <div className="flex gap-2">
          <Button
            variant={filterRating === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterRating('all')}
          >
            Todas
          </Button>
          {[5, 4, 3, 2, 1].map(rating => (
            <Button
              key={rating}
              variant={filterRating === rating.toString() ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRating(rating.toString())}
              className="gap-1"
            >
              {rating} ⭐
            </Button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-gray-500 py-4">Carregando avaliações...</p>
        ) : filteredReviews.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhuma avaliação encontrada</p>
        ) : (
          filteredReviews.map(review => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      {review.would_recommend && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Recomenda
                        </Badge>
                      )}
                      {review.is_anonymous && (
                        <Badge variant="outline" className="text-xs">
                          Anônimo
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold">{review.title}</p>
                    <p className="text-xs text-gray-600 mb-2">
                      {review.is_anonymous ? 'Cliente Anônimo' : review.customer_name}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm text-gray-700 mb-3">{review.comment}</p>

                {/* Aspect Scores */}
                {review.aspects && (
                  <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-gray-50 rounded text-xs">
                    <div>⏱️ Resposta: {review.aspects.response_time}/5</div>
                    <div>✅ Solução: {review.aspects.solution_quality}/5</div>
                    <div>👤 Profissional: {review.aspects.agent_professionalism}/5</div>
                    <div>😊 Satisfação: {review.aspects.overall_satisfaction}/5</div>
                  </div>
                )}

                {/* Helpfulness */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => helpfulMutation.mutate({ id: review.id, helpful: true })}
                    className="gap-1 flex-1"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Útil ({review.helpful_count})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => helpfulMutation.mutate({ id: review.id, helpful: false })}
                    className="gap-1 flex-1"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    Inútil ({review.unhelpful_count})
                  </Button>
                </div>

                {/* Agent Response */}
                {review.response_from_agent && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="text-xs font-medium text-blue-900 mb-1">💬 Resposta do Agente</p>
                    <p className="text-xs text-blue-800">{review.response_from_agent}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}