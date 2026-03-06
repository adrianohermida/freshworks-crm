import React, { useState } from 'react';
import { Calendar, Loader2, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SyncToCalendarButton({ deadline }) {
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(!!deadline.calendar_event_id);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await base44.functions.invoke('syncDeadlineToGoogleCalendar', {
        deadline_id: deadline.id,
        title: deadline.title,
        deadline_date: deadline.deadline_date,
        notes: deadline.notes,
        process_id: deadline.process_id
      });

      setSynced(true);
      setMessage('Sincronizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erro ao sincronizar');
      console.error('Sync error:', error);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleSync}
        disabled={loading || synced}
        className={`text-sm px-3 py-1 rounded flex items-center gap-2 transition ${
          synced
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
        }`}
        title={synced ? 'Sincronizado com Google Calendar' : 'Sincronizar com Google Calendar'}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : synced ? (
          <Check size={14} />
        ) : (
          <Calendar size={14} />
        )}
        {synced ? 'Sincronizado' : 'Sincronizar'}
      </button>
      {message && (
        <span className={`text-xs ${synced ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </span>
      )}
    </div>
  );
}