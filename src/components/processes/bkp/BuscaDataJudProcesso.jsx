/**
 * BuscaDataJudProcesso - Busca e importa processo do DataJud
 * Extraído de pages/Processos para manter o limite de 200 linhas na page.
 */
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Search, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MovimentacaoEnriquecida from './MovimentacaoEnriquecida';

const ESTADOS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];

export default function BuscaDataJudProcesso({ onSuccess, onBack }) {
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [uf, setUf] = useState('');
  const [resultados, setResultados] = useState(null);
  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: async () => {
      const payload = { numeroProcesso };
      if (uf) payload.uf = uf;
      const res = await base44.functions.invoke('consultarDataJud', payload);
      return res.data;
    },
    onSuccess: (data) => {
      const r = data?.resultados || [];
      setResultados(r);
      if (r.length > 0) toast.success(`${r.length} processo(s) encontrado(s)`);
      else toast.info('Nenhum processo encontrado');
    },
    onError: (err) => toast.error(err.message || 'Erro ao buscar processo'),
  });

  const importarMutation = useMutation({
    mutationFn: (processo) => base44.entities.ProcessoCEJUSC.create({
      tipo: 'cejusc',
      numero_processo: processo.numeroProcessoFormatado || processo.numeroProcesso,
      tribunal: uf,
      classe_judicial: processo.classe?.nome || '',
      orgao_julgador: processo.orgaoJulgador?.nome || '',
      data_abertura: processo.dataAjuizamento?.split('T')[0] || new Date().toISOString().split('T')[0],
      descricao: processo.classe?.nome || 'Processo CEJUSC',
      assuntos: (processo.assuntos || []).map(a => a.nome),
      movimentos: (processo.movimentos || []).slice(0, 20).map(m => ({
        nome: m.nome, dataHora: m.dataHora, codigo: m.codigo,
      })),
      status: 'aberto',
      ultima_sincronizacao: new Date().toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast.success('Processo importado com sucesso');
      onSuccess?.();
    },
    onError: () => toast.error('Erro ao importar processo'),
  });

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
              <label className="text-xs font-medium text-slate-600 mb-1 block">Número CNJ</label>
              <Input
                placeholder="Ex: 0805877-80.2026.8.15.0001"
                value={numeroProcesso}
                onChange={(e) => setNumeroProcesso(e.target.value)}
                maxLength={25}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">UF <span className="text-slate-400 font-normal">(opcional)</span></label>
              <Select value={uf} onValueChange={setUf}>
                <SelectTrigger><SelectValue placeholder="Auto-detectar" /></SelectTrigger>
                <SelectContent>
                  {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => searchMutation.mutate()}
                disabled={!numeroProcesso || searchMutation.isPending}
                className="w-full bg-[#212373] hover:bg-[#1a1b5e]"
              >
                {searchMutation.isPending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Buscando...</>
                  : <><Search className="w-4 h-4 mr-2" />Buscar</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {resultados && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">{resultados.length} resultado(s)</p>
          {resultados.map((processo, idx) => (
            <ProcessoResultadoCard
              key={idx}
              processo={processo}
              onImportar={() => importarMutation.mutate(processo)}
              isImporting={importarMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProcessoResultadoCard({ processo, onImportar, isImporting }) {
  return (
    <Card className="bg-slate-50">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-500">Número</p>
            <p className="font-mono font-bold text-slate-900">{processo.numeroProcesso}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Classe</p>
            <p className="text-slate-900">{processo.classe?.nome}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Data Ajuizamento</p>
            <p className="text-slate-900">
              {processo.dataAjuizamento
                ? format(new Date(processo.dataAjuizamento), 'dd/MM/yyyy')
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Órgão Julgador</p>
            <p className="text-slate-900 text-xs">{processo.orgaoJulgador?.nome}</p>
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
          <MovimentacaoEnriquecida movimentos={processo.movimentos.slice(0, 6)} compact />
        )}

        <Button
          onClick={onImportar}
          disabled={isImporting}
          className="w-full bg-[#00d9a3] hover:bg-[#00c492] text-[#212373] font-semibold"
          size="sm"
        >
          {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Importar Processo
        </Button>
      </CardContent>
    </Card>
  );
}