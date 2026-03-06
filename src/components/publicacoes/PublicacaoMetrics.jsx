import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Download, CheckCircle2, Eye, TrendingUp } from 'lucide-react';

/**
 * Componente de Métricas de Publicações
 * Exibe: Total na API | Sincronizadas | Lidas
 */

export default function PublicacaoMetrics({ 
  totalNaAPI = 0, 
  sincronizadas = 0, 
  lidas = 0,
  loading = false,
  confiavel = false
}) {
  const totalValido = totalNaAPI !== null && totalNaAPI !== undefined && totalNaAPI > 0;
  
  const percentualSincronizado = totalValido
    ? Math.round((sincronizadas / totalNaAPI) * 100) 
    : 0;

  const percentualLido = sincronizadas > 0 
    ? Math.round((lidas / sincronizadas) * 100) 
    : 0;

  const pendentes = totalValido ? (totalNaAPI - sincronizadas) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {/* Total na API */}
      <Card className={`p-6 bg-gradient-to-br border-2 ${!confiavel ? 'from-red-50 to-red-100 border-red-300' : 'from-blue-50 to-blue-100 border-blue-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <p className={`text-sm font-medium ${!confiavel ? 'text-red-700' : 'text-blue-700'}`}>
            Total na API Advise {!confiavel && '⚠️'}
          </p>
          <Download className={`w-5 h-5 ${!confiavel ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
        {totalValido ? (
          <>
            <p className={`text-4xl font-bold ${!confiavel ? 'text-red-900' : 'text-blue-900'}`}>
              {totalNaAPI.toLocaleString('pt-BR')}
            </p>
            <p className={`text-xs mt-2 ${!confiavel ? 'text-red-600' : 'text-blue-600'}`}>
              {pendentes > 0 && `${pendentes.toLocaleString('pt-BR')} pendentes`}
              {pendentes === 0 && totalNaAPI > 0 && '✅ Todas sincronizadas'}
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-red-900">—</p>
            <p className="text-xs text-red-600 mt-2">Indisponível no momento</p>
          </>
        )}
        {loading && <div className="mt-2 h-1 bg-opacity-30 rounded-full overflow-hidden">
          <div className={`h-full animate-pulse ${!confiavel ? 'bg-red-600' : 'bg-blue-600'}`} style={{ width: '60%' }} />
        </div>}
      </Card>

      {/* Sincronizadas */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-green-700">Sincronizadas</p>
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-4xl font-bold text-green-900">{sincronizadas.toLocaleString('pt-BR')}</p>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-green-600">Progresso</span>
            <span className="text-xs font-bold text-green-700">{percentualSincronizado}%</span>
          </div>
          <div className="h-2 bg-green-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 transition-all duration-300" 
              style={{ width: `${percentualSincronizado}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Lidas */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-purple-700">Lidas por Usuários</p>
          <Eye className="w-5 h-5 text-purple-600" />
        </div>
        <p className="text-4xl font-bold text-purple-900">{lidas.toLocaleString('pt-BR')}</p>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-purple-600">Taxa de leitura</span>
            <span className="text-xs font-bold text-purple-700">{percentualLido}%</span>
          </div>
          <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-600 transition-all duration-300" 
              style={{ width: `${percentualLido}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Taxa de Sincronização */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-orange-700">Meta de Sincronização</p>
          <TrendingUp className="w-5 h-5 text-orange-600" />
        </div>
        <p className="text-4xl font-bold text-orange-900">{percentualSincronizado}%</p>
        <p className="text-xs text-orange-600 mt-2">
          {percentualSincronizado === 100 && '✅ Meta atingida!'}
          {percentualSincronizado >= 80 && percentualSincronizado < 100 && '⚠️ Quase lá!'}
          {percentualSincronizado < 80 && `📊 ${80 - percentualSincronizado}% restante`}
        </p>
        {loading && <div className="mt-2 h-1 bg-orange-200 rounded-full overflow-hidden">
          <div className="h-full bg-orange-600 animate-pulse" style={{ width: '45%' }} />
        </div>}
      </Card>
    </div>
  );
}