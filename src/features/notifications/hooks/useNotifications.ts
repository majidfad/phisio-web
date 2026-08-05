import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationService } from '../services/notificationService';
import { notificationQueryKeys } from './notification-query-keys';

const UNREAD_POLL_MS = 45_000;

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: () => notificationService.getNotifications(),
    enabled,
    refetchInterval: UNREAD_POLL_MS,
  });
}

export function useUnreadNotificationCount(enabled = true) {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: async () => {
      const result = await notificationService.getUnreadCount();
      return result.count;
    },
    enabled,
    refetchInterval: UNREAD_POLL_MS,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}
