import { describe, expect, it } from 'vitest';

import { getNotificationHref } from '@/features/notifications/utils/notification-navigation';
import { routes } from '@/routes/routes';

describe('getNotificationHref', () => {
  it('keeps ClinicManager notifications in the Doctor panel', () => {
    expect(
      getNotificationHref(
        {
          notificationId: 'notification-id',
          type: 'UnknownNotification',
          title: 'Notification',
          body: 'Body',
          data: null,
          isRead: false,
          createdAt: '2026-08-15T00:00:00Z',
        },
        'ClinicManager',
      ),
    ).toBe(routes.doctor.root);
  });
});
