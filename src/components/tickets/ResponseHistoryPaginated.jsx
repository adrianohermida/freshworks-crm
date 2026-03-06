import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ITEMS_PER_PAGE = 5;

export default function ResponseHistoryPaginated({ ticket }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Parse responses from notes (assuming format: "Resposta enviada: DD/MM/YYYY HH:MM:SS")
  const responses = useMemo(() => {
    if (!ticket.notes) return [];
    
    // Split by "Resposta enviada:" to extract individual responses
    const lines = ticket.notes.split('\n').filter(line => line.trim());
    return lines.map((line, idx) => ({
      id: idx,
      timestamp: line,
      content: line
    }));
  }, [ticket.notes]);

  const totalPages = Math.ceil(responses.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResponses = responses.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  if (!responses.length) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-turquoise-600" />
          <CardTitle>Histórico de Respostas</CardTitle>
          <span className="text-xs text-muted-foreground ml-auto">
            {responses.length} resposta{responses.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {paginatedResponses.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">Nenhuma resposta registrada ainda</p>
          </div>
        ) : (
          paginatedResponses.map((response) => (
            <div
              key={response.id}
              className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 animate-in fade-in"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {response.content}
              </p>
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <span className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}