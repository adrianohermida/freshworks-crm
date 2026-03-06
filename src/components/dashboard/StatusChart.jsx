import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
  open: '#ef4444',
  pending: '#f59e0b',
  resolved: '#10b981',
  closed: '#6b7280'
};

export default function StatusChart({ data }) {
  const chartData = [
    { name: 'Aberto', value: data.open, fill: COLORS.open },
    { name: 'Pendente', value: data.pending, fill: COLORS.pending },
    { name: 'Resolvido', value: data.resolved, fill: COLORS.resolved },
    { name: 'Fechado', value: data.closed, fill: COLORS.closed }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Status</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}