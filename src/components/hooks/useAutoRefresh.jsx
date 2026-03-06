import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useAutoRefresh(queryKey = ['tickets'], interval = 30000, enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      queryClient.invalidateQueries({ queryKey });
      // Optional: show subtle notification
      // toast.info('Tickets atualizados', { duration: 2000 });
    }, interval);

    return () => clearInterval(timer);
  }, [queryKey, interval, enabled, queryClient]);
}

// Webhook notification hook
export function useWebhookNotification() {
  useEffect(() => {
    // Listen for webhook events via SSE or polling
    const checkForUpdates = async () => {
      // This would typically connect to a real-time service
      // For now, we rely on the auto-refresh above
    };

    checkForUpdates();
  }, []);
}