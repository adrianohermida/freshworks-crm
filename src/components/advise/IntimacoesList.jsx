import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Clock, Eye, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function IntimacoesList({
  intimacoes = [],
  loading = false,
  onMarkAsRead = () => {},
  onSync = () => {},
  syncLoading = false
}) {
  const [filtroStatus, setFiltroStatus] = useState('pendente');
  const [pesquisa, setPesquisa] = useState('');
  const [filtroFonte, setFiltroFonte] = useState('todas');

  // Extrair fontes únicas
  const fontes = [...new Set(intimacoes.map(i => i.fonte || 'API'))];

  // Filtrar intimações
  const filtradas = intimacoes.filter(intim => {
    const matchStatus = filtroStatus === 'todas' || intim.statusIntimacao === filtroStatus;
    const matchPesquisa = 
      pesquisa === '' ||
      intim.numeroProcesso?.includes(pesquisa) ||
      intim.descricao?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      intim.tipo?.toLowerCase().includes(pesquisa.toLowerCase());
    const matchFonte = filtroFonte === 'todas' || intim.fonte === filtroFonte;
    
    return matchStatus && matchPesquisa && matchFonte;
  });

  // Mapear cores de status
  const statusColors = {
    pendente: 'bg-yellow-100 text-yellow-800',
    recebida: 'bg-blue-100 text-blue-800',
    cumprida: 'bg-green-100 text-green-800',
    cancelada: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    pendente: '⏳ Pendente',
    recebida: '📥 Recebida',
    cumprida: '✅ Cumprida',
    cancelada: '❌ Cancelada'
  };

  return (
    <div className="space-y-6">
      {/* Header com Sync */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Intimações</h2>
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
                placeholder="Processo, tipo ou descrição..."
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
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="recebida">Recebida</SelectItem>
                  <SelectItem value="cumprida">Cumprida</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Fonte</label>
              <Select value={filtroFonte} onValueChange={setFiltroFonte}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as fontes</SelectItem>
                  {fontes.map(fonte => (
                    <SelectItem key={fonte} value={fonte}>{fonte}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600 w-full">
                <strong>{filtradas.length}</strong> de <strong>{intimacoes.length}</strong> intimações
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
      {!loading && filtradas.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Nenhuma intimação encontrada</p>
            <p className="text-sm text-gray-500">Clique em "Sincronizar" para buscar novas intimações</p>
          </CardContent>
        </Card>
      )}

      {/* Intimações Grid */}
      <div className="grid gap-4">
        {filtradas.map((intim) => (
          <Card key={intim.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        {intim.numeroProcesso || 'Processo desconhecido'}
                      </h3>
                      <Badge className={statusColors[intim.statusIntimacao]}>
                        {statusLabels[intim.statusIntimacao]}
                      </Badge>
                      <Badge variant="outline">{intim.tipo}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{intim.descricao}</p>
                  </div>

                  <Button
                    onClick={() => onMarkAsRead(intim)}
                    variant="ghost"
                    size="sm"
                    disabled={intim.lido}
                    title={intim.lido ? 'Já marcado como lido' : 'Marcar como lido'}
                  >
                    <Eye className={`w-4 h-4 ${intim.lido ? 'text-green-600' : 'text-gray-400'}`} />
                  </Button>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
                  <div>
                    <span className="text-gray-500">Fonte</span>
                    <p className="font-medium text-gray-900">{intim.fonte || 'API'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Vara/Tribunal</span>
                    <p className="font-medium text-gray-900">{intim.vara || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Município</span>
                    <p className="font-medium text-gray-900">{intim.municipio || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Data</span>
                    <p className="font-medium text-gray-900">
                      {intim.dataIntimacao
                        ? format(new Date(intim.dataIntimacao), 'dd/MMM/yyyy', { locale: ptBR })
                        : '-'
                      }
                    </p>
                  </div>
                </div>

                {/* Content */}
                {intim.conteudo && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-700 line-clamp-3">{intim.conteudo}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 border-t pt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Baixar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}