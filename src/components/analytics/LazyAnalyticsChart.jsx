import React, { Suspense, lazy } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load do componente pesado
const AnalyticsChart = lazy(() => import('./AnalyticsChart'));

export default function LazyAnalyticsChart(props) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <AnalyticsChart {...props} />
    </Suspense>
  );
}

function ChartSkeleton() {
  return (
    <Card className="p-6 dark:bg-gray-800">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </Card>
  );
}