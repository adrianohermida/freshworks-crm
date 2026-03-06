import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriorityChart({ data }) {
  const chartData = [
    { name: 'Urgente', value: data.urgent },
    { name: 'Alta', value: data.high },
    { name: 'Média', value: data.medium },
    { name: 'Baixa', value: data.low }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Prioridade</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}