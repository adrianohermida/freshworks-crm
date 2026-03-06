import React from 'react';
import {
  BarChart3,
  Globe,
  Zap,
  TrendingUp,
  Database,
  Users,
  AlertTriangle,
  Upload,
  TestTubes,
  Settings,
  Rocket,
  CheckCircle2,
  Map,
  FileText
} from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'datajud', label: 'DataJud API', icon: Globe },
  { id: 'tpu', label: 'TPU Sync', icon: Zap },
  { id: 'database', label: 'Repositório', icon: Database },
  { id: 'dashboard-hierarquia', label: 'Hierarquia', icon: Database },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'alerts', label: 'Alertas', icon: AlertTriangle },
  { id: 'import', label: 'Importador', icon: Upload },
  { id: 'e2e-tests', label: 'E2E Tests', icon: TestTubes },
  { id: 'settings', label: 'Configurações', icon: Settings }
];

export default function AdminNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-2 px-6 pt-4">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}