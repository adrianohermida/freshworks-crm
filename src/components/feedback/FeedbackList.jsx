import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare } from 'lucide-react';

function StarDisplay({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3 h-3 ${s <= count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Feedback.list('-created_date', 20)
      .then(setFeedbacks)
      .finally(() => setLoading(false));
  }, []);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + (f.votes_count || 0), 0) / feedbacks.length).toFixed(1)
    : 0;

  const categoryLabel = {
    general: 'Geral', usability: 'Usabilidade', performance: 'Performance',
    features: 'Funcionalidades', support: 'Suporte'
  };

  if (loading) return <div className="text-center py-8 text-gray-400">Carregando feedbacks...</div>;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-yellow-500">{avgRating}</div>
            <StarDisplay count={Math.round(avgRating)} />
            <p className="text-xs text-gray-500 mt-1">Média geral</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold">{feedbacks.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total de feedbacks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {feedbacks.filter(f => (f.votes_count || 0) >= 4).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Positivos (4-5★)</p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Feedbacks Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {feedbacks.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">Nenhum feedback ainda.</p>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((f) => (
                <div key={f.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <StarDisplay count={f.votes_count || 0} />
                    <Badge variant="outline" className="text-xs">
                      {categoryLabel[f.category] || f.category}
                    </Badge>
                  </div>
                  {f.description && (
                    <p className="text-sm text-gray-600 mt-1">{f.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {f.customer_email} · {new Date(f.created_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}