import React from 'react';

export function TicketCardSkeleton() {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-2/3" />
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-20" />
          <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function DashboardKPISkeleton() {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/3" />
        <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-2/3" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="h-80 bg-slate-50 dark:bg-slate-700 rounded-lg animate-pulse p-4">
      <div className="space-y-4 h-full flex flex-col">
        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/4" />
        <div className="flex-1 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-600 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}