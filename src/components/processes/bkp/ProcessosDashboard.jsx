import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileText, Scale, TrendingUp, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

const COLORS_STATUS = {
  aberto: '#3b82f6',
  em_audiencia: '#a855f7',
  acordo: '#22c55e',
  finalizado: '#64748b',
  cancelado: '#ef4444',
};

const STATUS_LABELS = {
  aberto: 'Aberto',
  em_audiencia: 'Em Audiência',
  acordo: 'Acordo',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
};

const TIPO_COLORS = {
  cejusc: '#4f46e5',
  procon: '#f97316',
};

function KPICard({ label, value, icon: Icon, color, sub }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProcessosDashboard({ processos = [] }) {
  // --- KPIs ---
  const total = processos.length;
  const totalCEJUSC = processos.filter(p => p.tipo === 'cejusc').length;
  const totalPROCON = processos.filter(p => p.tipo === 'procon').length;
  const abertos = processos.filter(p => p.status === 'aberto').length;
  const emAudiencia = processos.filter(p => p.status === 'em_audiencia').length;
  const acordos = processos.filter(p => p.status === 'acordo').length;
  const finalizados = processos.filter(p => p.status === 'finalizado').length;
  const cancelados = processos.filter(p => p.status === 'cancelado').length;
  const taxaSucesso = total > 0 ? Math.round(((acordos + finalizados) / total) * 100) : 0;

  // --- Gráfico: distribuição por status ---
  const porStatus = Object.entries(STATUS_LABELS).map(([key, label]) => ({
    name: label,
    value: processos.filter(p => p.status === key).length,
    color: COLORS_STATUS[key],
  })).filter(d => d.value > 0);

  // --- Gráfico: barras por mês de abertura ---
  const porMes = (() => {
    const map = {};
    processos.forEach(p => {
      if (!p.data_abertura) return;
      const mes = p.data_abertura.slice(0, 7); // YYYY-MM
      if (!map[mes]) map[mes] = { mes, cejusc: 0, procon: 0 };
      if (p.tipo === 'procon') map[mes].procon++;
      else map[mes].cejusc++;
    });
    return Object.values(map).sort((a, b) => a.mes.localeCompare(b.mes)).slice(-12);
  })();

  // --- Gráfico: por tipo (pizza) ---
  const porTipo = [
    { name: 'CEJUSC', value: totalCEJUSC, color: TIPO_COLORS.cejusc },
    { name: 'PROCON', value: totalPROCON, color: TIPO_COLORS.procon },
  ].filter(d => d.value > 0);

  if (total === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-slate-400">
          <Scale className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Nenhum processo para exibir métricas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total" value={total} icon={FileText} color="bg-slate-500" />
        <KPICard label="Taxa de Sucesso" value={`${taxaSucesso}%`} icon={TrendingUp} color="bg-green-500" sub={`${acordos + finalizados} resolvidos`} />
        <KPICard label="Em Andamento" value={abertos + emAudiencia} icon={Clock} color="bg-blue-500" />
        <KPICard label="Acordos/Resolvidos" value={acordos + finalizados} icon={CheckCircle} color="bg-emerald-500" />
      </div>

      {/* Sub-KPIs */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {[
          { label: 'CEJUSC', value: totalCEJUSC, color: 'bg-indigo-100 text-indigo-800' },
          { label: 'PROCON', value: totalPROCON, color: 'bg-orange-100 text-orange-800' },
          { label: 'Abertos', value: abertos, color: 'bg-blue-100 text-blue-800' },
          { label: 'Em Audiência', value: emAudiencia, color: 'bg-purple-100 text-purple-800' },
          { label: 'Acordos', value: acordos, color: 'bg-green-100 text-green-800' },
          { label: 'Cancelados', value: cancelados, color: 'bg-red-100 text-red-800' },
        ].map(k => (
          <div key={k.label} className="text-center">
            <Badge className={`${k.color} text-xs px-3 py-1 block`}>{k.label}</Badge>
            <p className="text-lg font-bold text-slate-800 mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Barras por mês */}
        {porMes.length > 1 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Processos por Mês de Abertura</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={porMes} margin={{ left: -20 }}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="cejusc" name="CEJUSC" fill={TIPO_COLORS.cejusc} radius={[3,3,0,0]} />
                  <Bar dataKey="procon" name="PROCON" fill={TIPO_COLORS.procon} radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Pizza por status */}
        {porStatus.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={porStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {porStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pizza tipo */}
      {porTipo.length === 2 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">CEJUSC vs PROCON</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 items-center">
              {porTipo.map(t => (
                <div key={t.name} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="text-sm font-semibold text-slate-700">{t.name}</span>
                  <span className="text-lg font-bold" style={{ color: t.color }}>{t.value}</span>
                  <span className="text-xs text-slate-400">({Math.round((t.value / total) * 100)}%)</span>
                </div>
              ))}
              <div className="flex-1 h-3 rounded-full overflow-hidden bg-slate-100 ml-4">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((totalCEJUSC / total) * 100)}%`,
                    background: `linear-gradient(to right, ${TIPO_COLORS.cejusc}, ${TIPO_COLORS.procon})`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}