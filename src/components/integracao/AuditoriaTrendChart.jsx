import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AuditoriaTrendChart() {
  const trendData = [
    { data: '01/Mar', sucesso: 18, erro: 1, duplicata: 12 },
    { data: '02/Mar', sucesso: 22, erro: 0, duplicata: 14 },
    { data: '03/Mar', sucesso: 24, erro: 1, duplicata: 15 },
    { data: '04/Mar', sucesso: 19, erro: 2, duplicata: 18 }
  ];

  const volumeData = [
    { dia: 'Seg', volume: 280 },
    { dia: 'Ter', volume: 320 },
    { dia: 'Qua', volume: 410 },
    { dia: 'Qui', volume: 290 },
    { dia: 'Sex', volume: 460 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Trend Line */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Sincronizações (7 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sucesso" stroke="#10b981" name="Sucesso" />
              <Line type="monotone" dataKey="erro" stroke="#ef4444" name="Erros" />
              <Line type="monotone" dataKey="duplicata" stroke="#f59e0b" name="Duplicatas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Volume Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Volume de Publicações Importadas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#8b5cf6" name="Publicações" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}