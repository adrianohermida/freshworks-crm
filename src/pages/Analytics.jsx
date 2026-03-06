import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import ResumeLoader from '@/components/common/ResumeLoader';
import RoleBasedDashboardAdapter from '@/components/analytics/RoleBasedDashboardAdapter';

export default function Analytics() {
  const [escritorio, setEscritorio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEscritorio();
  }, []);

  const loadEscritorio = async () => {
    try {
      const result = await base44.entities.Escritorio.list();
      if (result?.length > 0) {
        setEscritorio(result[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar escritório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !escritorio) {
    return <ResumeLoader />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-[var(--brand-primary)]" />
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Analytics</h1>
          </div>
          <p className="text-[var(--text-secondary)] text-lg">
            Painel de análise em tempo real do seu escritório.
          </p>
        </motion.div>

        <RoleBasedDashboardAdapter escritorioId={escritorio.id} />
      </div>
    </div>
  );
}