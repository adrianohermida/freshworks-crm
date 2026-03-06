import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Eye, Activity } from 'lucide-react';

export default function GrowthAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const conversionData = [
    { day: 'Seg', visits: 1200, signups: 48, conversions: 4.0 },
    { day: 'Ter', visits: 1300, signups: 62, conversions: 4.8 },
    { day: 'Qua', visits: 1100, signups: 51, conversions: 4.6 },
    { day: 'Qui', visits: 1500, signups: 75, conversions: 5.0 },
    { day: 'Sex', visits: 1800, signups: 95, conversions: 5.3 },
    { day: 'Sáb', visits: 1400, signups: 58, conversions: 4.1 },
    { day: 'Dom', visits: 900, signups: 30, conversions: 3.3 }
  ];

  const cohortRetention = [
    { cohort: 'Mar 1-7', week0: 100, week1: 85, week2: 72, week3: 61, week4: 51 },
    { cohort: 'Mar 8-14', week0: 100, week1: 88, week2: 75, week3: 64 },
    { cohort: 'Mar 15-21', week0: 100, week1: 92, week2: 82 },
    { cohort: 'Mar 22-28', week0: 100, week1: 90 }
  ];

  const metrics = [
    { label: 'Visitor Unique', value: '12.5K', change: '+23%', color: 'blue' },
    { label: 'Signup Rate', value: '4.8%', change: '+1.2%', color: 'green' },
    { label: 'MAU', value: '8.2K', change: '+18%', color: 'purple' },
    { label: 'Churn Rate', value: '8.5%', change: '-2.1%', color: 'red' }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">{m.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
                <p className={`text-xs font-medium mt-2 ${m.change.includes('+') && !m.label.includes('Churn') ? 'text-green-600' : 'text-red-600'}`}>
                  {m.change}
                </p>
              </div>
              <TrendingUp className={`w-8 h-8 opacity-20 text-${m.color}-600`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Conversion Funnel */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">📈 Funnel de Conversão (Últimos 7 dias)</h3>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={conversionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="visits" stroke="#3b82f6" name="Visitas" />
            <Line yAxisId="left" type="monotone" dataKey="signups" stroke="#10b981" name="Sign-ups" />
            <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#f59e0b" name="Taxa %" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Cohort Retention */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📊 Cohort Retention Analysis</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Cohort</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Semana 0</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Semana 1</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Semana 2</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Semana 3</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Semana 4</th>
              </tr>
            </thead>
            <tbody>
              {cohortRetention.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.cohort}</td>
                  <td className="text-center py-3 px-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {row.week0}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium opacity-90">
                      {row.week1}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium opacity-75">
                      {row.week2}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    {row.week3 && (
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium opacity-60">
                        {row.week3}%
                      </span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {row.week4 && (
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium opacity-50">
                        {row.week4}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          💡 Day 7 retention: 85% | Trend: ↗️ Melhorando | Meta: 80%
        </p>
      </Card>

      {/* Growth Opportunities */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="font-semibold text-gray-900 mb-4">🎯 Growth Opportunities</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <p className="font-medium text-gray-900">Viral Loop</p>
            <p className="text-xs text-gray-600 mt-2">Implementar referral program pode aumentar signup em 15-20%</p>
            <Badge className="mt-3 bg-green-100 text-green-800">Potencial: $5K MRR</Badge>
          </div>

          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <p className="font-medium text-gray-900">Email Retention</p>
            <p className="text-xs text-gray-600 mt-2">Drip campaign pode reduzir churn de 8.5% para 6.5%</p>
            <Badge className="mt-3 bg-blue-100 text-blue-800">Potencial: +450 MAU</Badge>
          </div>

          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <p className="font-medium text-gray-900">Feature Adoption</p>
            <p className="text-xs text-gray-600 mt-2">Onboarding interativo pode aumentar feature discovery 30%</p>
            <Badge className="mt-3 bg-purple-100 text-purple-800">Potencial: +25% engagement</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}