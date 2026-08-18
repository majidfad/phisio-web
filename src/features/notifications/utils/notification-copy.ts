import type { TFunction } from 'i18next';

import type { NotificationDto } from '../types/notification';
import { parseNotificationData } from './notification-navigation';

export function getNotificationCopy(
  notification: NotificationDto,
  t: TFunction,
): { title: string; body: string } {
  const data = parseNotificationData(notification.data);
  const key = `notifications.types.${notification.type}`;
  const count = data.count ?? 0;

  const title = t(`${key}.title`, {
    defaultValue: notification.title,
    ...data,
  });

  const body = t(`${key}.body`, {
    defaultValue: notification.body,
    count,
    ...data,
  });

  return { title, body };
}
