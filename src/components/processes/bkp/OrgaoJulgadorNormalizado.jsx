/**
 * OrgaoJulgadorNormalizado
 * Componente que exibe órgão julgador normalizado com:
 * - Ícone de tribunal
 * - Localização geográfica
 * - Status de digitalização
 * - Link para detalhes
 */
import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap, ChevronRight } from 'lucide-react';

export default function OrgaoJulgadorNormalizado({ codigo, tribunal = '', municipio = '', onClick }) {
  const [normalizado, setNormalizado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNormalizado = async () => {
      try {
        const res = await base44.functions.invoke('normalizarOrgaoJulgador', {
          codigo,
          tribunal,
          cidade: municipio,
        });
        setNormalizado(res.data?.normalizado);
      } catch (err) {
        console.warn('Erro ao normalizar órgão:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNormalizado();
  }, [codigo, tribunal, municipio]);

  if (loading) {
    return <div className="text-xs text-slate-400">Carregando...</div>;
  }

  if (!normalizado) {
    return <div className="text-xs text-slate-500">{tribunal || 'Órgão'} - {codigo}</div>;
  }

  const getTribunalIcon = () => {
    const t = normalizado.tribunal?.toUpperCase();
    if (t === 'TJSP') return '🏛️';
    if (t === 'TRF1' || t?.startsWith('TRF')) return '⚖️';
    if (t === 'STJ') return '📜';
    if (t === 'STF') return '👑';
    return '📋';
  };

  return (
    <div
      onClick={onClick}
      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Nome do órgão */}
          <p className="text-sm font-medium text-slate-800 truncate group-hover:text-[#212373]">
            <span className="mr-1">{getTribunalIcon()}</span>
            {normalizado.nome || normalizado.nome_serventia}
          </p>

          {/* Localização */}
          {(normalizado.municipio || normalizado.uf) && (
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {normalizado.municipio}
                {normalizado.municipio && normalizado.uf && ', '}
                {normalizado.uf}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {normalizado.grau && (
              <Badge variant="outline" className="text-xs">{normalizado.grau}</Badge>
            )}
            {normalizado.juizo_100_digital && (
              <Badge className="text-xs bg-green-100 text-green-800 border-0 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> 100% Digital
              </Badge>
            )}
            {normalizado.fonte && (
              <Badge variant="outline" className="text-xs text-slate-500">{normalizado.fonte}</Badge>
            )}
          </div>
        </div>

        {/* Ícone de ação */}
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 flex-shrink-0 mt-1" />
      </div>
    </div>
  );
}