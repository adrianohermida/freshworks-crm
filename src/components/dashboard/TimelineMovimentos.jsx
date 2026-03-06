import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TimelineMovimentos({ movimentos = [] }) {
  if (movimentos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-gray-500">Nenhum movimento registrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline de Movimentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {movimentos.map((mov, idx) => (
            <div key={mov.id} className="flex gap-4">
              {/* Ponto da timeline */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mt-1" />
                {idx < movimentos.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-200 mt-3" />
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {mov.descricaoMovimento}
                  </p>
                  {mov.importante && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      Importante
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {format(new Date(mov.dataMovimento), 'dd MMM yyyy HH:mm', { locale: ptBR })}
                </p>
                {mov.conteudo && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {mov.conteudo}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}