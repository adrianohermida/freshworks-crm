/**
 * ProcessoListaVazia - Estado vazio padronizado
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Search } from 'lucide-react';

export default function ProcessoListaVazia({ hasFilters = false, onNovo, onBuscarDataJud, isCliente = false }) {
  if (hasFilters) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-slate-500">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhum resultado para os filtros aplicados</p>
          <p className="text-xs mt-1">Tente ajustar os filtros de busca</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-12 text-center text-slate-500 space-y-3">
        <FileText className="w-12 h-12 mx-auto opacity-20" />
        <div>
          <p className="font-medium text-slate-700">
            {isCliente ? 'Nenhum processo vinculado' : 'Nenhum processo cadastrado'}
          </p>
          <p className="text-xs mt-1 text-slate-400">
            {isCliente
              ? 'Seu consultor irá vincular os processos quando necessário'
              : 'Crie um processo manual ou busque no DataJud'}
          </p>
        </div>
        {!isCliente && (
          <div className="flex gap-2 justify-center flex-wrap">
            {onNovo && (
              <Button size="sm" onClick={onNovo} className="bg-[#212373] hover:bg-[#1a1b5e] text-white gap-1">
                <Plus className="w-3.5 h-3.5" /> Novo Processo
              </Button>
            )}
            {onBuscarDataJud && (
              <Button size="sm" variant="outline" onClick={onBuscarDataJud} className="gap-1">
                <Search className="w-3.5 h-3.5" /> Buscar DataJud
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}