import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Frown, Meh, Smile } from 'lucide-react';

const COLORS = {
  positive: '#10b981',
  neutral: '#6366f1',
  negative: '#ef4444'
};

const ICONS = {
  positive: <Smile className="w-5 h-5" />,
  neutral: <Meh className="w-5 h-5" />,
  negative: <Frown className="w-5 h-5" />
};

export default function SentimentAnalysis({ tickets }) {
  const sentimentData = useMemo(() => {
    const breakdown = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    tickets.forEach(ticket => {
      if (ticket.ai_sentiment) {
        breakdown[ticket.ai_sentiment]++;
      }
    });

    return Object.entries(breakdown).map(([name, value]) => ({
      name,
      value,
      color: COLORS[name]
    }));
  }, [tickets]);

  const ticketsWithSentiment = tickets.filter(t => t.ai_sentiment);
  const sentimentPercentages = useMemo(() => {
    const total = ticketsWithSentiment.length;
    return {
      positive: ((sentimentData[0]?.value || 0) / total * 100).toFixed(1),
      neutral: ((sentimentData[1]?.value || 0) / total * 100).toFixed(1),
      negative: ((sentimentData[2]?.value || 0) / total * 100).toFixed(1)
    };
  }, [sentimentData, ticketsWithSentiment.length]);

  const topNegativeTickets = useMemo(() => {
    return tickets
      .filter(t => t.ai_sentiment === 'negative')
      .slice(0, 5);
  }, [tickets]);

  const overallSentiment = useMemo(() => {
    const positive = sentimentData[0]?.value || 0;
    const negative = sentimentData[2]?.value || 0;
    
    if (positive > negative * 1.5) return 'positive';
    if (negative > positive * 1.5) return 'negative';
    return 'neutral';
  }, [sentimentData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Overall Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Sentimento Geral</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className={`p-3 rounded-full mb-3 ${
            overallSentiment === 'positive' ? 'bg-green-100' :
            overallSentiment === 'negative' ? 'bg-red-100' :
            'bg-blue-100'
          }`}>
            <div className={
              overallSentiment === 'positive' ? 'text-green-600' :
              overallSentiment === 'negative' ? 'text-red-600' :
              'text-blue-600'
            }>
              {ICONS[overallSentiment]}
            </div>
          </div>
          <p className="text-center font-medium capitalize">
            {overallSentiment === 'positive' ? 'Positivo' :
             overallSentiment === 'negative' ? 'Negativo' :
             'Neutro'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {ticketsWithSentiment.length} tickets analisados
          </p>
        </CardContent>
      </Card>

      {/* Sentiment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Distribuição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sentimentData.map(item => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${
                    item.name === 'positive' ? 'bg-green-100' :
                    item.name === 'negative' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    <div className={
                      item.name === 'positive' ? 'text-green-600' :
                      item.name === 'negative' ? 'text-red-600' :
                      'text-blue-600'
                    }>
                      {ICONS[item.name]}
                    </div>
                  </div>
                  <span className="text-sm capitalize font-medium">
                    {item.name === 'positive' ? 'Positivo' :
                     item.name === 'negative' ? 'Negativo' :
                     'Neutro'}
                  </span>
                </div>
                <Badge variant="outline">{sentimentPercentages[item.name]}%</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${sentimentPercentages[item.name]}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* High Priority Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Problemas Críticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {topNegativeTickets.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                Nenhum ticket negativo
              </p>
            ) : (
              topNegativeTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                >
                  <p className="text-xs font-medium text-red-900 dark:text-red-200 line-clamp-2">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    {ticket.customer_name}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}