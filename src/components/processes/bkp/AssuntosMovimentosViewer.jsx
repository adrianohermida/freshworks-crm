import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BookOpen, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AssuntosMovimentosViewer({ assuntos = [], movimentos = [] }) {
  if (assuntos.length === 0 && movimentos.length === 0) {
    return (
      <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-amber-900">Nenhum dado do DataJud disponível</p>
          <p className="text-xs text-amber-700 mt-1">Sincronize o processo com DataJud para obter assuntos e movimentações</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Dados do DataJud
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assuntos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200">
            <TabsTrigger value="assuntos">
              Assuntos {assuntos.length > 0 && <Badge className="ml-2 bg-blue-600">{assuntos.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="movimentos">
              Movimentações {movimentos.length > 0 && <Badge className="ml-2 bg-purple-600">{movimentos.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* Assuntos */}
          <TabsContent value="assuntos" className="space-y-2">
            {assuntos.length === 0 ? (
              <p className="text-sm text-slate-600">Nenhum assunto disponível</p>
            ) : (
              assuntos.map((assunto, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-900">{assunto.nome}</p>
                      {assunto.codigo && (
                        <p className="text-xs font-mono text-slate-600 mt-1">Código: {assunto.codigo}</p>
                      )}
                    </div>
                    {assunto.codigo && (
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {assunto.codigo}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Movimentações */}
          <TabsContent value="movimentos" className="space-y-2 max-h-96 overflow-y-auto">
            {movimentos.length === 0 ? (
              <p className="text-sm text-slate-600">Nenhuma movimentação disponível</p>
            ) : (
              movimentos
                .sort((a, b) => new Date(b.dataHora || 0) - new Date(a.dataHora || 0))
                .map((movimento, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900">{movimento.nome}</p>
                        {movimento.dataHora && (
                          <p className="text-xs text-slate-600 mt-1">
                            📅 {format(new Date(movimento.dataHora), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        )}
                      </div>
                      {movimento.codigo && (
                        <Badge variant="outline" className="text-xs flex-shrink-0 font-mono">
                          {movimento.codigo}
                        </Badge>
                      )}
                    </div>

                    {/* Complementos */}
                    {movimento.complementosTabelados?.length > 0 && (
                      <div className="border-t pt-2 mt-2">
                        <p className="text-xs font-semibold text-slate-600 mb-1">Complementos:</p>
                        <div className="flex flex-wrap gap-1">
                          {movimento.complementosTabelados.map((comp, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {comp.nome}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Órgão Julgador do Movimento */}
                    {movimento.orgaoJulgador && (
                      <div className="border-t pt-2 mt-2 text-xs text-slate-600">
                        <p className="font-semibold">🏛️ {movimento.orgaoJulgador.nomeOrgao || movimento.orgaoJulgador}</p>
                      </div>
                    )}
                  </div>
                ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}