import React from 'react';
import AlertasInteligentes from '../components/dashboard/AlertasInteligentes';

export default function Alertas() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sistema de Alertas</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe prazos críticos, audiências e movimentações</p>
        </div>

        {/* Alertas Component */}
        <AlertasInteligentes />
      </div>
    </div>
  );
}