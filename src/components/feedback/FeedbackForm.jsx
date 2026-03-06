import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send, CheckCircle2 } from 'lucide-react';

export default function FeedbackForm({ context = 'general', onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('general');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'general', label: 'Geral' },
    { value: 'usability', label: 'Usabilidade' },
    { value: 'performance', label: 'Performance' },
    { value: 'features', label: 'Funcionalidades' },
    { value: 'support', label: 'Suporte' },
  ];

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    try {
      const user = await base44.auth.me();
      await base44.entities.Feedback.create({
        ticket_id: context,
        customer_email: user?.email || 'anonymous',
        type: 'general_feedback',
        category,
        title: `Feedback - ${category}`,
        description: comment,
        priority: rating >= 4 ? 'low' : rating >= 2 ? 'medium' : 'high',
        status: 'new',
        votes_count: rating,
      });
      setSubmitted(true);
      if (onSubmit) onSubmit({ rating, comment, category });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-1">Obrigado pelo feedback!</h3>
          <p className="text-sm text-gray-500">Sua opinião nos ajuda a melhorar continuamente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">💬 Como foi sua experiência?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stars */}
        <div className="flex gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-center text-sm text-gray-600">
            {['', 'Muito insatisfeito', 'Insatisfeito', 'Neutro', 'Satisfeito', 'Muito satisfeito'][rating]}
          </p>
        )}

        {/* Category */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                category === c.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600 hover:border-blue-400'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Comment */}
        <Textarea
          placeholder="Conte-nos mais sobre sua experiência (opcional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="resize-none"
        />

        <Button
          onClick={handleSubmit}
          disabled={!rating || loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Enviando...' : 'Enviar Feedback'}
        </Button>
      </CardContent>
    </Card>
  );
}