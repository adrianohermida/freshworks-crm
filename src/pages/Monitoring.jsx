import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import MonitoringDashboard from '@/components/admin/MonitoringDashboard';

export default function Monitoring() {
  return (
    <ProtectedRoute requiredRole="admin">
      <MonitoringDashboard />
    </ProtectedRoute>
  );
}