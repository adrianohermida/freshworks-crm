import React from 'react';
import { SkeletonCard, SkeletonList } from '@/components/ui/Skeleton';
import { Loader2 } from 'lucide-react';

export function TicketsLoadingState({ count = 5 }) {
  return <SkeletonList count={count} />;
}

export function TicketDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export function SyncingIndicator() {
  return (
    <div className="flex items-center justify-center p-4 text-sm text-gray-600 dark:text-gray-400">
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Sincronizando tickets...
    </div>
  );
}