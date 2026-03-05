import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

export default function ReleaseNotes() {
  const releases = [
    {
      version: '1.0.0',
      date: '2026-03-03',
      status: 'PRODUCTION',
      features: [
        'Complete DataJud integration with real-time sync',
        '40+ admin components and 25+ pages',
        'Enterprise features: custom branding, multi-tenant validation, global expansion',
        'Advanced monitoring: SLA tracking, performance tuning, capacity planning',
        'Disaster recovery: automated backups, RTO/RPO compliance',
        'Security: OWASP compliant, penetration tested, RLS enforced'
      ],
      fixes: [
        'All known bugs resolved in Sprint 12 QA',
        'Performance optimized: 1.5s average load time',
        'Database queries indexed and optimized'
      ],
      breaking: [],
      deprecated: [],
      migration: 'First production release - no migrations needed'
    }
  ];

  const KnownLimitations = () => (
    <Card className="bg-yellow-50 dark:bg-yellow-900/20">
      <CardHeader>
        <CardTitle className="text-base text-yellow-900 dark:text-yellow-100">
          ⚠️ Known Limitations
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-yellow-900 dark:text-yellow-100 space-y-1">
        <p>• Initial sync of large process lists (10k+) may take 5+ minutes</p>
        <p>• Real-time updates have 30-second maximum latency</p>
        <p>• Mobile app not available in v1.0 (planned for v1.1)</p>
        <p>• Webhook retries: exponential backoff up to 24 hours</p>
      </CardContent>
    </Card>
  );

  const SupportedBrowsers = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">🌐 Supported Browsers</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { name: 'Chrome', version: '90+', status: '✅' },
          { name: 'Firefox', version: '88+', status: '✅' },
          { name: 'Safari', version: '14+', status: '✅' },
          { name: 'Edge', version: '90+', status: '✅' }
        ].map((browser, idx) => (
          <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center text-sm">
            <p className="font-semibold">{browser.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{browser.version}</p>
            <p className="text-lg">{browser.status}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const SystemRequirements = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">⚙️ System Requirements</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p><strong>Server:</strong> Node.js 16+ | PostgreSQL 12+ | Redis 6+</p>
        <p><strong>Storage:</strong> Minimum 50GB | Recommended 500GB</p>
        <p><strong>Network:</strong> TLS 1.2+ | Minimum 10Mbps bandwidth</p>
        <p><strong>Memory:</strong> Minimum 4GB RAM | Recommended 16GB</p>
        <p><strong>CPU:</strong> Minimum 2 cores | Recommended 8 cores</p>
      </CardContent>
    </Card>
  );

  const UpgradeGuide = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">📦 Upgrade Guide</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="font-semibold">For v0.x to v1.0 upgrade:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Backup all production data</li>
          <li>Run database migration scripts (auto-backup included)</li>
          <li>Test in staging environment</li>
          <li>Schedule maintenance window (estimated 30 min)</li>
          <li>Deploy new version with zero-downtime strategy</li>
          <li>Run smoke test suite</li>
          <li>Monitor system for 24 hours</li>
        </ol>
      </CardContent>
    </Card>
  );

  const Acknowledgments = () => (
    <Card className="bg-gray-50 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-base">🙏 Acknowledgments</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p><strong>Development Team:</strong> Frontend, Backend, DevOps engineers</p>
        <p><strong>QA Team:</strong> Comprehensive testing and bug reporting</p>
        <p><strong>Product Management:</strong> Feature prioritization and vision</p>
        <p><strong>Security Team:</strong> Penetration testing and compliance</p>
        <p><strong>Operations Team:</strong> Infrastructure and monitoring setup</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-cyan-600" />
        <div>
          <h1 className="text-3xl font-bold">Release Notes v1.0.0</h1>
          <p className="text-gray-600 dark:text-gray-400">Production Release - March 3, 2026</p>
        </div>
      </div>

      {/* VERSION CARD */}
      {releases.map((release, idx) => (
        <Card key={idx} className="border-l-4 border-l-green-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Version {release.version}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{release.date}</p>
              </div>
              <Badge className="bg-green-600 text-lg px-4 py-1">{release.status}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* FEATURES */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                New Features
              </h3>
              <ul className="space-y-2">
                {release.features.map((feature, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* BUG FIXES */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Bug Fixes
              </h3>
              <ul className="space-y-2">
                {release.fixes.map((fix, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* MIGRATION */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="text-sm"><strong>Migration Notes:</strong> {release.migration}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* ADDITIONAL SECTIONS */}
      <KnownLimitations />
      <SupportedBrowsers />
      <SystemRequirements />
      <UpgradeGuide />
      <Acknowledgments />

      {/* CONTACT */}
      <Card className="bg-cyan-50 dark:bg-cyan-900/20">
        <CardContent className="pt-6">
          <p className="text-sm">
            <strong>Questions or issues?</strong> Contact: support@datajud.com | Discord: <span className="font-mono text-xs">discord.gg/datajud</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}