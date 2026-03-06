/**
 * ProcessoMetadadosTPU
 * Exibe metadados enriquecidos (classe TPU, assuntos, órgão julgador, sigilo, etc.)
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProcessoMetadadosTPU({ processo }) {
  const hasAnyMeta = processo.classe_codigo
    || processo.grau
    || processo.sistema_processual?.nome
    || processo.formato_processo?.nome
    || processo.nivel_sigilo !== undefined
    || processo.orgao_julgador
    || processo.nome_serventia
    || processo.numero_serventia
    || processo.tipo_unidade
    || processo.juizo_100_digital
    || processo.assuntos?.length > 0
    || processo.data_hora_ultima_atualizacao;

  if (!hasAnyMeta) return null;

  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="w-4 h-4 text-[#212373]" />
          Metadados DataJud / TPU
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {processo.classe_codigo && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-0.5">Código Classe (TPU)</p>
              <p className="text-sm font-mono text-slate-800">{processo.classe_codigo}</p>
            </div>
          )}
          {processo.grau && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-0.5">Grau</p>
              <p className="text-sm text-slate-800">{processo.grau}</p>
            </div>
          )}
          {processo.sistema_processual?.nome && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-0.5">Sistema</p>
              <p className="text-sm text-slate-800">{processo.sistema_processual.nome}</p>
            </div>
          )}
          {processo.formato_processo?.nome && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-0.5">Formato</p>
              <p className="text-sm text-slate-800">{processo.formato_processo.nome}</p>
            </div>
          )}
        </div>

        {(processo.nivel_sigilo !== undefined || processo.orgao_julgador || processo.nome_serventia || processo.numero_serventia || processo.tipo_unidade) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {processo.nivel_sigilo !== undefined && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Nível de Sigilo</p>
                <Badge className={processo.nivel_sigilo > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {processo.nivel_sigilo === 0 ? '🔓 Público'
                    : processo.nivel_sigilo === 1 ? '🔒 Sigiloso'
                    : '🔐 Altamente Sigiloso'}
                </Badge>
              </div>
            )}
            {processo.orgao_julgador && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Órgão Julgador</p>
                <p className="text-sm text-slate-800">
                  {typeof processo.orgao_julgador === 'string'
                    ? processo.orgao_julgador
                    : processo.orgao_julgador?.nome || 'N/A'}
                </p>
              </div>
            )}
            {processo.nome_serventia && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Serventia</p>
                <p className="text-sm text-slate-800">{processo.nome_serventia}</p>
              </div>
            )}
            {processo.numero_serventia && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Nº Serventia</p>
                <p className="text-sm font-mono text-slate-800">{processo.numero_serventia}</p>
              </div>
            )}
            {processo.tipo_unidade && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Tipo Unidade</p>
                <p className="text-sm text-slate-800">{processo.tipo_unidade}</p>
              </div>
            )}
            {processo.juizo_100_digital && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Digital</p>
                <Badge className="bg-blue-100 text-blue-800">💻 100% Digital</Badge>
              </div>
            )}
          </div>
        )}

        {processo.assuntos?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Assuntos (TPU)</p>
            <div className="flex flex-wrap gap-1">
              {processo.assuntos.map((assunto, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {typeof assunto === 'string' ? assunto : assunto?.nome || assunto}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {processo.data_hora_ultima_atualizacao && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-0.5">Última Atualização (DataJud)</p>
            <p className="text-sm text-blue-800">
              {format(new Date(processo.data_hora_ultima_atualizacao), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}