import React from 'react';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import DataJudAPITester from '@/components/admin/DataJudAPITester';
import TPUSyncDashboard from '@/components/tpu/TPUSyncDashboard';
import MonitoringDashboard from '@/components/admin/MonitoringDashboard';
import AdminUsersManager from '@/components/admin/AdminUsersManager';
import AlertSystemDashboard from '@/components/admin/AlertSystemDashboard';
import AdminDataImporter from '@/components/admin/AdminDataImporter';
import E2ETestDashboard from '@/components/admin/E2ETestDashboard';
import AdminSettings from '@/pages/AdminSettings';
import DatabaseRepositoryPlan from '@/pages/DatabaseRepositoryPlan';
import ProcessoRepositorioManager from '@/components/repositorio/ProcessoRepositorioManager';

import DashboardHierarquia from '@/components/repositorio/DashboardHierarquia';
import RoadmapDashboard from '@/components/admin/RoadmapDashboard';

export default function AdminContentWrapper({
  activeTab,
  isSuperAdmin,
  selectedUserType,
  setSelectedUserType
}) {
  return (
    <div className="px-6 py-6">
      {activeTab === 'dashboard' && <AdminDashboard isSuperAdmin={isSuperAdmin} />}
      {activeTab === 'datajud' && <DataJudAPITester />}
      {activeTab === 'tpu' && <TPUSyncDashboard />}
      {activeTab === 'database' && <ProcessoRepositorioManager />}
      {activeTab === 'dashboard-hierarquia' && <DashboardHierarquia />}
      {activeTab === 'roadmap' && <RoadmapDashboard />}
      {activeTab === 'users' && <AdminUsersManager />}
      {activeTab === 'alerts' && <AlertSystemDashboard />}
      {activeTab === 'import' && <AdminDataImporter />}
      {activeTab === 'e2e-tests' && <E2ETestDashboard />}
      {activeTab === 'settings' && (
        <AdminSettings selectedUserType={selectedUserType} onUserTypeChange={setSelectedUserType} />
      )}
    </div>
  );
}