import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Custom hook para operações com Notificações
 */
export const useNotifications = (options = {}) => {
  const queryClient = useQueryClient();

  // ✅ FETCH NOTIFICATIONS
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      if (!user) return [];
      return base44.entities.Notification.filter(
        { user_id: user.email },
        '-created_date',
        50
      );
    },
    staleTime: options.staleTime || 10000,
    refetchInterval: options.refetchInterval || 30000,
    ...options
  });

  // ✅ FETCH PREFERENCES
  const {
    data: preferences,
    isLoading: preferencesLoading
  } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const user = await base44.auth.me();
      if (!user) return null;
      const prefs = await base44.entities.NotificationPreference.filter(
        { user_id: user.email },
        null,
        1
      );
      return prefs[0] || null;
    }
  });

  // ✅ DISMISS
  const dismissMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // ✅ MARK AS READ
  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, {
      status: 'read',
      read_at: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // ✅ UPDATE PREFERENCES
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      if (!preferences?.id) {
        return base44.entities.NotificationPreference.create({
          user_id: user.email,
          ...data
        });
      }
      return base44.entities.NotificationPreference.update(preferences.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    }
  });

  return {
    notifications,
    isLoading,
    error,
    refetch,
    preferences,
    preferencesLoading,
    dismiss: dismissMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutateAsync,
    updatePreferences: updatePreferencesMutation.mutateAsync,
    isDismissing: dismissMutation.isPending,
    isUpdatingPreferences: updatePreferencesMutation.isPending
  };
};