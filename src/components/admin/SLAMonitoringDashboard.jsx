import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SLAMonitoringDashboard() {
  const slas = [
    {
      name: 'Uptime SLA',
      target: 99.9,
      current: 99.95,
      status: 'EXCEEDED',
      downtime: '22 minutes/month',
      icon: '⏱️'
    },
    {
      name: 'Response Time P95',
      target: 500,
      current: 185,
      status: 'EXCEEDED',
      unit: 'ms',
      icon: '⚡'
    },
    {
      name: 'Error Rate',
      target: 0.5,
      current: 0.12,
      status: 'EXCEEDED',
      unit: '%',
      icon: '🛡️'
    },
    {
      name: 'API Availability',
      target: 99.5,
      current: 99.98,
      status: 'EXCEEDED',
      unit: '%',
      icon: '📡'
    }
  ];

  const tenantSLAs = [
    { name: 'Tenant A (Enterprise)', uptime: 99.99, responseTime: 150, errorRate: 0.05, status: 'COMPLIANT' },
    { name: 'Tenant B (Pro)', uptime: 99.92, responseTime: 220, errorRate: 0.18, status: 'COMPLIANT' },
    { name: 'Tenant C (Startup)', uptime: 99.85, responseTime: 350, errorRate: 0.35, status: 'COMPLIANT' },
    { name: 'Tenant D (Free)', uptime: 98.50, responseTime: 500, errorRate: 0.50, status: 'WARNING' }
  ];

  const incidents = [
    { id: 'INC-001', date: '2026-03-01', duration: '5 min', impact: 'API Rate Limiter', resolution: 'Configuration rollback', status: 'RESOLVED' },
    { id: 'INC-002', date: '2026-02-28', duration: '12 min', impact: 'Database Replication Lag', resolution: 'Manual failover to replica', status: 'RESOLVED' }
  ];

  const getStatusColor = (status) => {
    if (status === 'EXCEEDED') return 'bg-green-100 text-green-800';
    if (status === 'MET') return 'bg-blue-100 text-blue-800';
    if (status === 'AT RISK') return 'bg-yellow-100 text-yellow-800';
    if (status === 'VIOLATED') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const mttr = 8.5; // minutes
  const mttd = 2.3; // minutes

  return (
    <div className="space-y-6">
      {/* KEY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-green-600">Uptime (Month)</p>
            <p className="text-2xl font-bold">99.95%</p>
            <p className="text-xs text-green-600 mt-1">22 min downtime</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-blue-600">MTTD (Mean Time to Detect)</p>
            <p className="text-2xl font-bold">{mttd}m</p>
            <p className="text-xs text-blue-600 mt-1">Automated alerts</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-purple-600">MTTR (Mean Time to Resolve)</p>
            <p className="text-2xl font-bold">{mttr}m</p>
            <p className="text-xs text-purple-600 mt-1">Average incident</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-orange-600">Active Tenants</p>
            <p className="text-2xl font-bold">{tenantSLAs.length}</p>
            <p className="text-xs text-orange-600 mt-1">All compliant</p>
          </CardContent>
        </Card>
      </div>

      {/* GLOBAL SLAS */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Global SLA Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {slas.map((sla, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">
                  <span className="mr-2">{sla.icon}</span>
                  {sla.name}
                </p>
                <Badge className={getStatusColor(sla.status)} style={{ fontSize: '11px' }}>
                  {sla.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress
                  value={Math.min((sla.current / sla.target) * 100, 100)}
                  className="flex-1 h-2"
                />
                <span className="text-sm font-semibold w-20 text-right">
                  {sla.current}{sla.unit ? sla.unit : '%'} / {sla.target}{sla.unit || '%'}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* TENANT SLAS */}
      <Card>
        <CardHeader>
          <CardTitle>👥 Tenant-specific SLAs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tenantSLAs.map((tenant, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">{tenant.name}</p>
                <Badge className={tenant.status === 'COMPLIANT' ? 'bg-green-600' : 'bg-yellow-600'} style={{ fontSize: '11px' }}>
                  {tenant.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Uptime</p>
                  <p className="font-semibold">{tenant.uptime}%</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Response Time</p>
                  <p className="font-semibold">{tenant.responseTime}ms</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Error Rate</p>
                  <p className="font-semibold">{tenant.errorRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* INCIDENTS */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {incidents.map((incident, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border-l-4 border-l-green-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{incident.id}</p>
                    <Badge className="bg-green-600" style={{ fontSize: '10px' }}>Resolved</Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {incident.date} | Duration: {incident.duration}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Impact:</strong> {incident.impact}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Resolution:</strong> {incident.resolution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ALERTS */}
      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="text-base text-green-900 dark:text-green-100">
            ✅ SLA Status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-900 dark:text-green-100 space-y-2">
          <p className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Uptime SLA: 99.95% (Target: 99.9%) - <strong>EXCEEDED</strong>
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Response Time: 185ms P95 (Target: 500ms) - <strong>EXCEEDED</strong>
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Error Rate: 0.12% (Target: 0.5%) - <strong>EXCEEDED</strong>
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            All tenant SLAs: <strong>COMPLIANT</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}