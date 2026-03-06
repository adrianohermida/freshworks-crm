import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Scale, Calendar, AlertCircle, Loader2, DollarSign, User, Building2, 
  ClipboardList, Flag, MapPin 
} from 'lucide-react';
import ProcessAttachments from './ProcessAttachments';

export default function DetailedProcessHeader({ processo, cabecalho, informacoes, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          <span className="text-gray-500">Carregando detalhes...</span>
        </CardContent>
      </Card>
    );
  }

  if (!cabecalho) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Não foi possível carregar detalhes do processo</AlertDescription>
      </Alert>
    );
  }

  const statusColor = (status) => {
    const statusMap = {
      'ativo': 'bg-green-100 text-green-800',
      'suspenso': 'bg-yellow-100 text-yellow-800',
      'arquivado': 'bg-gray-100 text-gray-800',
      'baixado': 'bg-blue-100 text-blue-800',
      'concluso': 'bg-blue-100 text-blue-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const progressPercent = informacoes?.percentualAndamento || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-base">
                {processo?.numeroProcesso || 'Processo'}
              </CardTitle>
              <Badge className={statusColor(processo?.statusProcesso || 'ativo')}>
                {processo?.statusProcesso || 'ativo'}
              </Badge>
            </div>
            {processo?.dataDistribuicao && (
              <p className="text-xs text-gray-500">
                Distribuído em {new Date(processo.dataDistribuicao).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Seção 1: Informações Básicas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-2">
            <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase">Tribunal</p>
              <p className="text-sm font-medium text-gray-900 break-words">
                {cabecalho?.tribunal || 'Não informado'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase">Vara</p>
              <p className="text-sm font-medium text-gray-900 break-words">
                {cabecalho?.vara || 'Não informada'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase">Juiz</p>
              <p className="text-sm font-medium text-gray-900 break-words">
                {cabecalho?.juiz || 'Não informado'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase">Município</p>
              <p className="text-sm font-medium text-gray-900 break-words">
                {cabecalho?.municipio || 'Não informado'}
              </p>
            </div>
          </div>
        </div>

        {/* Seção 2: Dados do Processo */}
        <div className="border-t pt-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-semibold text-gray-900">Classe Processual</p>
            </div>
            <p className="text-sm text-gray-700 ml-6">
              {cabecalho?.classe || 'Não informada'}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flag className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-semibold text-gray-900">Assunto</p>
            </div>
            <p className="text-sm text-gray-700 ml-6">
              {cabecalho?.assunto || 'Não informado'}
            </p>
          </div>

          {cabecalho?.valorCausa > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-900">Valor da Causa</p>
              </div>
              <p className="text-sm text-gray-700 ml-6 font-semibold text-green-700">
                R$ {cabecalho.valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>

        {/* Seção 3: Progresso */}
        {informacoes && (
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-900">Andamento</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Progresso</span>
                <span className="font-medium text-gray-900">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-600">Movimentos</p>
                <p className="text-lg font-bold text-gray-900">
                  {informacoes?.totalMovimentos || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-600">Última Atualização</p>
                <p className="text-xs text-gray-900">
                  {informacoes?.dataUltimo 
                    ? new Date(informacoes.dataUltimo).toLocaleDateString('pt-BR')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Seção 4: Próximos Eventos */}
        {informacoes?.proximoEvento && (
          <Alert className="border-blue-200 bg-blue-50">
            <Calendar className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Próximo Evento:</strong> {informacoes.proximoEvento}
              {informacoes.dataProximoEvento && (
                <> em {new Date(informacoes.dataProximoEvento).toLocaleDateString('pt-BR')}</>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Seção 5: Anexos */}
        <div className="border-t pt-4">
          <ProcessAttachments 
            numeroProcesso={processo?.numeroProcesso}
            idProcessoAdvise={processo?.idFonteProcesso}
          />
        </div>
      </CardContent>
    </Card>
  );
}