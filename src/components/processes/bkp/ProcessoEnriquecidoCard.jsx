/**
 * ProcessoEnriquecidoCard
 * Card de processo com dados enriquecidos de TPU integrados
 */
import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import OrgaoJulgadorNormalizado from './OrgaoJulgadorNormalizado';

export default function ProcessoEnriquecidoCard({ processo, onEnrichmentComplete, onClick }) {
  const [enriquecido, setEnriquecido] = useState(null);
  const [loading, setLoading] = useState(false);

  const enriquecer = async () => {
    if (!processo.codigo_orgao_julgador) return;
    setLoading(true);
    try {
      const res = await base44.functions.invoke('enriquecerProcessoComTPUv2', {
        processo_id: processo.id,
        classeCodigoDataJud: processo.classe_codigo_datajud,
        assuntoCodigos: processo.assunto_codigos ? (Array.isArray(processo.assunto_codigos) ? processo.assunto_codigos : [processo.assunto_codigos]) : [],
        movimentoCodigos: [],
      });
      const enr = res.data?.enriquecimento;
      setEnriquecido(enr);
      onEnrichmentComplete?.(enr);
    } catch (err) {
      console.warn('Erro ao enriquecer:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (processo && processo.classe_codigo_datajud) {
      enriquecer();
    }
  }, [processo?.id]);

  const statusColors = {
    aberto: 'bg-blue-100 text-blue-800',
    em_audiencia: 'bg-yellow-100 text-yellow-800',
    acordo: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
    finalizado: 'bg-slate-100 text-slate-800',
  };

  return (
    <Card
      onClick={onClick}
      className="hover:shadow-md transition-shadow cursor-pointer"
    >
      <CardContent className="p-4 space-y-3">
        {/* Número do processo */}
        <div>
          <p className="text-sm font-semibold text-slate-800">{processo.numero_processo}</p>
          {processo.descricao && (
            <p className="text-xs text-slate-600 mt-1">{processo.descricao}</p>
          )}
        </div>

        {/* Status */}
        <div className="flex gap-2 flex-wrap">
          <Badge className={statusColors[processo.status] || statusColors.aberto}>
            {processo.status?.replace(/_/g, ' ')}
          </Badge>
          {enriquecido?.classe?.nome && (
            <Badge variant="outline" className="text-xs">{enriquecido.classe.nome}</Badge>
          )}
        </div>

        {/* Órgão julgador normalizado */}
        {processo.codigo_orgao_julgador && (
          <div>
            <p className="text-xs text-slate-500 mb-1">Órgão julgador:</p>
            <OrgaoJulgadorNormalizado
              codigo={processo.codigo_orgao_julgador}
              tribunal={processo.tribunal}
              municipio={processo.municipio}
            />
          </div>
        )}

        {/* Datas */}
        <div className="space-y-1 text-xs text-slate-600">
          {processo.data_abertura && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              Aberto: {new Date(processo.data_abertura).toLocaleDateString('pt-BR')}
            </div>
          )}
          {processo.data_proxima_audiencia && (
            <div className="flex items-center gap-1 font-medium text-amber-700">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              Próxima: {new Date(processo.data_proxima_audiencia).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>

        {/* Assuntos enriquecidos */}
        {enriquecido?.assuntos && enriquecido.assuntos.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-1">Assuntos TPU:</p>
            <div className="flex flex-wrap gap-1">
              {enriquecido.assuntos.slice(0, 3).map((a, i) => (
                <Badge key={i} variant="outline" className="text-xs">{a.nome?.substring(0, 30)}</Badge>
              ))}
              {enriquecido.assuntos.length > 3 && (
                <Badge variant="outline" className="text-xs">+{enriquecido.assuntos.length - 3}</Badge>
              )}
            </div>
          </div>
        )}

        {/* Enriquecimento status */}
        {loading && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <Loader2 className="w-3 h-3 animate-spin" /> Enriquecendo com TPU...
          </div>
        )}

        {enriquecido?.timestamp && (
          <p className="text-xs text-slate-400">
            Enriquecido em {new Date(enriquecido.timestamp).toLocaleString('pt-BR')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}