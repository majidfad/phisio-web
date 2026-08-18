import { httpClient } from '@/api/http-client';

import type { NotificationDto, UnreadCountDto } from '../types/notification';

const BASE = '/notifications';

export const notificationService = {
  async getNotifications(take = 50): Promise<NotificationDto[]> {
    const { data } = await httpClient.get<NotificationDto[]>(BASE, {
      params: { take },
    });
    return data;
  },

  async getUnreadCount(): Promise<UnreadCountDto> {
    const { data } = await httpClient.get<UnreadCountDto>(`${BASE}/unread-count`);
    return data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await httpClient.post(`${BASE}/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<UnreadCountDto> {
    const { data } = await httpClient.post<UnreadCountDto>(`${BASE}/read-all`);
    return data;
  },
};
