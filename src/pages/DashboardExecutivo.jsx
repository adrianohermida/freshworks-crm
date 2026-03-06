import React from 'react';
import ExecutiveDashboard from '../components/dashboard/ExecutiveDashboard';

export default function DashboardExecutivo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Executivo</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral em tempo real: KPIs, tendências e recomendações</p>
        </div>

        {/* Dashboard */}
        <ExecutiveDashboard />
      </div>
    </div>
  );
}