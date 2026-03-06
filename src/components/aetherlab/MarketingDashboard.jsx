import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, Share2, Download, Eye } from 'lucide-react';

export default function MarketingDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [campaigns] = useState([
    { name: 'Email Campaign', users: 1240, conversion: 8.2, roi: 3.5 },
    { name: 'Social Media', users: 5640, conversion: 12.1, roi: 4.2 },
    { name: 'Content Marketing', users: 3890, conversion: 6.5, roi: 2.8 },
    { name: 'Paid Ads', users: 8920, conversion: 14.3, roi: 5.1 }
  ]);

  const [growthData] = useState([
    { month: 'Jan', users: 1200, signups: 240, retention: 85 },
    { month: 'Feb', users: 1890, signups: 380, retention: 87 },
    { month: 'Mar', users: 2490, signups: 520, retention: 89 },
    { month: 'Apr', users: 3490, signups: 640, retention: 91 },
    { month: 'May', users: 4210, signups: 780, retention: 92 },
    { month: 'Jun', users: 5340, signups: 920, retention: 94 }
  ]);

  const kpis = [
    { label: 'Total Users', value: '5,340', change: '+28%', icon: Users },
    { label: 'Active Campaigns', value: '4', change: 'On Track', icon: Target },
    { label: 'Avg ROI', value: '3.9x', change: '+15%', icon: TrendingUp },
    { label: 'Share of Voice', value: '24%', change: '+6%', icon: Share2 }
  ];

  return (
    <div className="space-y-6 p-6 max-w-5xl">
      <h1 className="text-3xl font-bold">Marketing Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-xs font-medium opacity-70 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {kpi.label}
                    </p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className={`text-xs mt-2 text-green-600`}>
                      {kpi.change}
                    </p>
                  </div>
                  <Icon className="w-6 h-6 opacity-20" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Growth Trend */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>User Growth & Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Total Users" />
              <Line type="monotone" dataKey="signups" stroke="#10b981" name="New Signups" />
              <Line type="monotone" dataKey="retention" stroke="#f59e0b" name="Retention %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaigns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-4 gap-4">
            {campaigns.map((camp, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className="text-xs opacity-70 mb-1">{camp.name}</p>
                <p className="font-bold text-sm">{camp.users}</p>
                <p className="text-xs text-green-600">{camp.conversion}% Conv</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}