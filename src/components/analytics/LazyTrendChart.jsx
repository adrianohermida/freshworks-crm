import React, { Suspense, lazy } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load do componente pesado
const TrendChart = lazy(() => import('./TrendChart'));

export default function LazyTrendChart(props) {
  return (
    <Suspense fallback={<TrendSkeleton />}>
      <TrendChart {...props} />
    </Suspense>
  );
}

function TrendSkeleton() {
  return (
    <Card className="p-6 dark:bg-gray-800">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </Card>
  );
}