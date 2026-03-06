import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, ArrowRight, Loader2, AlertCircle, Scale } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProcessosList({
  processos = [],
  loading = false,
  onSelectProcesso = () => {},
  onSync = () => {},
  syncLoading = false
}) {
  const [pesquisa, setPesquisa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroGrau, setFiltroGrau] = useState('todos');

  // Extrair valores únicos
  const graus = [...new Set(processos.map(p => p.grau || '1º grau'))];
  const status = [...new Set(processos.map(p => p.statusProcesso || 'ativo'))];

  // Filtrar processos
  const filtrados = processos.filter(proc => {
    const matchPesquisa = 
      pesquisa === '' ||
      proc.numeroProcesso?.includes(pesquisa) ||
      proc.assunto?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      proc.tribunal?.toLowerCase().includes(pesquisa.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || proc.statusProcesso === filtroStatus;
    const matchGrau = filtroGrau === 'todos' || proc.grau === filtroGrau;
    
    return matchPesquisa && matchStatus && matchGrau;
  });

  const statusColors = {
    ativo: 'bg-green-100 text-green-800',
    suspenso: 'bg-yellow-100 text-yellow-800',
    arquivado: 'bg-gray-100 text-gray-800',
    baixado: 'bg-blue-100 text-blue-800',
    concluso: 'bg-purple-100 text-purple-800'
  };

  const statusLabels = {
    ativo: '⚖️ Ativo',
    suspenso: '⏸️ Suspenso',
    arquivado: '📦 Arquivado',
    baixado: '✓ Baixado',
    concluso: '✅ Concluso'
  };

  return (
    <div className="space-y-6">
      {/* Header com Sync */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Processos</h2>
        <Button
          onClick={onSync}
          disabled={syncLoading}
          className="gap-2"
        >
          {syncLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              🔄 Sincronizar
            </>
          )}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Buscar</label>
              <Input
                placeholder="Processo, tribunal ou assunto..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {status.map(s => (
                    <SelectItem key={s} value={s}>{statusLabels[s] || s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Grau</label>
              <Select value={filtroGrau} onValueChange={setFiltroGrau}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {graus.map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600 w-full">
                <strong>{filtrados.length}</strong> de <strong>{processos.length}</strong> processos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filtrados.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-12 text-center">
            <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Nenhum processo encontrado</p>
            <p className="text-sm text-gray-500">Clique em "Sincronizar" para buscar processos do Advise</p>
          </CardContent>
        </Card>
      )}

      {/* Processos Grid */}
      <div className="grid gap-4">
        {filtrados.map((proc) => (
          <Card key={proc.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectProcesso(proc)}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        {proc.numeroProcesso}
                      </h3>
                      <Badge className={statusColors[proc.statusProcesso]}>
                        {statusLabels[proc.statusProcesso]}
                      </Badge>
                      <Badge variant="outline">{proc.grau}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{proc.assunto || 'Sem descrição'}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProcesso(proc);
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
                  <div>
                    <span className="text-gray-500">Tribunal</span>
                    <p className="font-medium text-gray-900">{proc.tribunal || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Vara</span>
                    <p className="font-medium text-gray-900">{proc.vara || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Distribuição</span>
                    <p className="font-medium text-gray-900">
                      {proc.dataDistribuicao
                        ? format(new Date(proc.dataDistribuicao), 'dd/MMM/yyyy', { locale: ptBR })
                        : '-'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Último movimento</span>
                    <p className="font-medium text-gray-900">
                      {proc.dataUltimo
                        ? format(new Date(proc.dataUltimo), 'dd/MMM/yyyy', { locale: ptBR })
                        : '-'
                      }
                    </p>
                  </div>
                </div>

                {/* Classe */}
                {proc.classeProcessual && (
                  <div className="border-t pt-4">
                    <span className="text-xs text-gray-500">Classe Processual</span>
                    <p className="text-sm font-medium text-gray-700">{proc.classeProcessual}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}