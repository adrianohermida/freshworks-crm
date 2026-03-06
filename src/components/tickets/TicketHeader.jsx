import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function TicketHeader({ isSyncing, onSync }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
        Tickets de Suporte
      </h1>
      <Button
        onClick={onSync}
        disabled={isSyncing}
        className="gap-2 bg-turquoise-600 hover:bg-turquoise-700 dark:bg-turquoise-700 dark:hover:bg-turquoise-600 w-full sm:w-auto"
        aria-busy={isSyncing}
      >
        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
      </Button>
    </div>
  );
}