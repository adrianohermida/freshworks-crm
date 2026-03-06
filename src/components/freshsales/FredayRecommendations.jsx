import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

export default function FredayRecommendations({ leads, conversations }) {
  const [analysisResults, setAnalysisResults] = useState(null);

  const analyzeLeads = useMutation({
    mutationFn: () => base44.functions.invoke('freddy', {
      action: 'generate_lead_recommendations'
    }),
    onSuccess: (data) => {
      setAnalysisResults(data);
    }
  });

  const analyzeConversation = useMutation({
    mutationFn: (conversationId) => base44.functions.invoke('freddy', {
      action: 'analyze_conversation',
      conversation_id: conversationId
    }),
    onSuccess: (data) => {
      setAnalysisResults(prev => ({
        ...prev,
        conversation_insights: data
      }));
    }
  });

  const hotLeads = leads
    .sort((a, b) => (b.freddy_score || 0) - (a.freddy_score || 0))
    .slice(0, 5);

  const riskLeads = leads
    .filter(l => l.probability < 30)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => analyzeLeads.mutate()}
          disabled={analyzeLeads.isPending}
          className="gap-2 bg-gradient-to-r from-cyan-500 to-teal-500"
        >
          {analyzeLeads.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Analisar Leads com Freddy
        </Button>

        <Button
          variant="outline"
          onClick={() => analyzeConversation.mutate(conversations[0]?.id)}
          disabled={analyzeConversation.isPending || conversations.length === 0}
          className="gap-2"
        >
          {analyzeConversation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Analisar Conversas
        </Button>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg border-2 border-cyan-200 dark:border-cyan-700">
          <div className="flex gap-3 items-start">
            <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-cyan-900 dark:text-cyan-200 mb-3">
                Recomendações de Freddy
              </h3>

              {analysisResults.priority_leads && (
                <div className="mb-4">
                  <p className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                    🎯 Leads Prioritários para Hoje
                  </p>
                  <ul className="space-y-1 text-sm">
                    {analysisResults.priority_leads.map((lead, idx) => (
                      <li key={idx} className="text-slate-700 dark:text-slate-300">
                        • {lead}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResults.pipeline_health && (
                <div className="mb-4">
                  <p className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                    📊 Saúde do Pipeline
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {analysisResults.pipeline_health}
                  </p>
                </div>
              )}

              {analysisResults.conversation_insights && (
                <div>
                  <p className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                    💬 Insights de Conversa
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Sentimento: {analysisResults.conversation_insights.sentiment} | 
                    Intent: {analysisResults.conversation_insights.intent}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hot Leads */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          Leads Quentes (Score &gt; 70)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotLeads.length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 col-span-2">
              <CardContent className="pt-6 text-center text-slate-500">
                Nenhum lead com score elevado no momento
              </CardContent>
            </Card>
          ) : (
            hotLeads.map((lead) => (
              <Card
                key={lead.id}
                className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-700 border-2 border-orange-200 dark:border-orange-600"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm">{lead.title}</CardTitle>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      {lead.freddy_score?.toFixed(0)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 text-xs">
                  <p className="font-semibold text-orange-900 dark:text-orange-300">
                    R$ {lead.value?.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Status: {lead.status} • {lead.probability}% prob
                  </p>
                  {lead.next_action && (
                    <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-600 p-2 rounded">
                      <strong>Ação:</strong> {lead.next_action}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Risk Leads */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Leads em Risco (Prob &lt; 30%)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskLeads.length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 col-span-2">
              <CardContent className="pt-6 text-center text-slate-500">
                Nenhum lead com probabilidade baixa
              </CardContent>
            </Card>
          ) : (
            riskLeads.map((lead) => (
              <Card
                key={lead.id}
                className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border-2 border-red-200 dark:border-red-600"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{lead.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-xs">
                  <p className="font-semibold text-red-900 dark:text-red-300">
                    ⚠️ {lead.probability}% chance de fechar
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    R$ {lead.value?.toLocaleString('pt-BR')}
                  </p>
                  {lead.next_action && (
                    <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-600 p-2 rounded">
                      {lead.next_action}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}