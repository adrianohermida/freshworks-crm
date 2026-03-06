import React from 'react';
import PWAConfig from '@/components/pwa/PWAConfig';

export default function PWAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <PWAConfig />
    </div>
  );
}