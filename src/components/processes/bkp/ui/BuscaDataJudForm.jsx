import React from 'react';
import { Loader2, ChevronLeft, Search, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useProcessoSearch } from '@/components/modules/legal/processos/hooks/useProcessoSearch';
import { useProcessoSync } from '@/components/modules/legal/processos/hooks/useProcessoSync';
import { toast } from 'sonner';

const ESTADOS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];

export default function BuscaDataJudForm({ onSuccess, onBack }) {
  const { numeroProcesso, setNumeroProcesso, uf, setUf, handleSearch, resultados, isLoading, error } = useProcessoSearch();
  const { sincronizar, syncStatus, syncError, isPending: isSyncing, isSuccess } = useProcessoSync();

  const handleImportar = () => {
    sincronizar(numeroProcesso, uf !== 'auto' ? uf : undefined);
    setTimeout(() => {
      if (isSuccess) {
        toast.success('Processo importado com sucesso');
        onSuccess?.();
      }
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4" /> Buscar Processo no DataJud
        </h2>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Número do Processo (CNJ)</label>
              <Input
                placeholder="Ex: 0805877-80.2026.8.15.0001"
                value={numeroProcesso}
                onChange={(e) => setNumeroProcesso(e.target.value)}
                maxLength={25}
              />
              <p className="text-xs text-slate-400 mt-1">Aceita com ou sem formatação</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Estado (UF)</label>
              <Select value={uf} onValueChange={setUf}>
                <SelectTrigger><SelectValue placeholder="Auto-detectar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detectar pelo CNJ</SelectItem>
                  {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => handleSearch(numeroProcesso, uf)}
                disabled={!numeroProcesso || isLoading}
                className="w-full"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Buscando...</> : <><Search className="w-4 h-4 mr-2" />Buscar</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-700">
            {error.message || 'Erro ao buscar processo'}
          </CardContent>
        </Card>
      )}

      {syncError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-700">
            {syncError}
          </CardContent>
        </Card>
      )}

      {resultados?.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">{resultados.length} resultado(s)</p>
          {resultados.map((processo, idx) => (
            <Card key={idx} className="bg-slate-50">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Número</p>
                    <p className="font-mono font-bold">{processo.numeroProcessoFormatado}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Classe</p>
                    <p>{processo.classe}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Órgão Julgador</p>
                    <p className="text-xs">{processo.orgaoJulgador}</p>
                  </div>
                </div>

                {processo.assuntos?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {processo.assuntos.map((a, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{a.nome}</Badge>
                    ))}
                  </div>
                )}

                {processo.movimentos?.length > 0 && (
                  <div className="space-y-1 max-h-28 overflow-y-auto">
                    <p className="text-xs text-slate-500">Últimas movimentações ({processo.totalMovimentos})</p>
                    {processo.movimentos.slice(0, 4).map((mov, i) => (
                      <div key={i} className="text-xs text-slate-600 bg-white rounded p-1.5">
                        <span className="font-medium">{mov.nome}</span>
                        {' — '}
                        {mov.dataHora ? format(new Date(mov.dataHora), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : ''}
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleImportar}
                  disabled={isSyncing}
                  className="w-full font-semibold"
                  style={{ backgroundColor: "#00d9a3", color: "var(--brand-primary)" }}
                  size="sm"
                >
                  {isSyncing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importando...</> : <><Plus className="w-4 h-4 mr-2" />Importar</>}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}