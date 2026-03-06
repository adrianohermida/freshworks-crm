import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export const useAnalyticsCharts = (period = '7d') => {
  const getPeriodDays = (p) => {
    const map = { '7d': 7, '30d': 30, '90d': 90 };
    return map[p] || 7;
  };

  const days = getPeriodDays(period);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Fetch all analytics events for the period
  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ['analytics-charts', period],
    queryFn: async () => {
      try {
        const allEvents = await base44.entities.Analytics.filter({}, '-timestamp', 1000);
        return allEvents.filter(e => new Date(e.timestamp) >= startDate);
      } catch {
        return [];
      }
    },
    staleTime: 10 * 60 * 1000
  });

  // Process sync trend data (by day)
  const syncTrendData = (() => {
    const grouped = {};
    
    events.forEach(event => {
      const date = new Date(event.timestamp);
      const day = date.toLocaleDateString('pt-BR', { month: '2-digit', day: '2-digit' });
      
      if (!grouped[day]) grouped[day] = { data: day, total: 0, sucesso: 0, erro: 0 };
      
      if (event.event_type === 'process_synced' || event.event_type.includes('sync')) {
        grouped[day].total += 1;
        if (event.status === 'success') grouped[day].sucesso += 1;
        else if (event.status === 'error') grouped[day].erro += 1;
      }
    });

    return Object.values(grouped).sort((a, b) => 
      new Date(`01/${a.data}/2026`) - new Date(`01/${b.data}/2026`)
    );
  })();

  // Process sync by tribunal
  const syncByTribunalData = (() => {
    const grouped = {};

    events.forEach(event => {
      if (event.metadata?.tribunal) {
        const tribunal = event.metadata.tribunal;
        if (!grouped[tribunal]) grouped[tribunal] = { tribunal, total: 0, sucesso: 0, erro: 0 };
        
        grouped[tribunal].total += 1;
        if (event.status === 'success') grouped[tribunal].sucesso += 1;
        else if (event.status === 'error') grouped[tribunal].erro += 1;
      }
    });

    return Object.values(grouped).slice(0, 10);
  })();

  // Process event types distribution
  const eventTypesData = (() => {
    const grouped = {};

    events.forEach(event => {
      const type = event.event_type || 'outro';
      grouped[type] = (grouped[type] || 0) + 1;
    });

    return Object.entries(grouped).map(([name, count]) => ({ name, count }));
  })();

  // Process success rate by day
  const successRateData = (() => {
    const grouped = {};

    events.forEach(event => {
      const date = new Date(event.timestamp);
      const day = date.toLocaleDateString('pt-BR', { month: '2-digit', day: '2-digit' });
      
      if (!grouped[day]) grouped[day] = { data: day, total: 0, sucesso: 0 };
      
      if (event.event_type === 'process_synced' || event.event_type.includes('sync')) {
        grouped[day].total += 1;
        if (event.status === 'success') grouped[day].sucesso += 1;
      }
    });

    return Object.values(grouped).map(d => ({
      ...d,
      taxa: d.total > 0 ? (d.sucesso / d.total) * 100 : 0
    })).sort((a, b) => 
      new Date(`01/${a.data}/2026`) - new Date(`01/${b.data}/2026`)
    );
  })();

  return {
    syncTrendData,
    syncByTribunalData,
    eventTypesData,
    successRateData,
    isLoading,
    refetch
  };
};