import { Bell } from 'lucide-react';
import { Badge, Button, Dropdown, Empty, Spin, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from '@/features/notifications/hooks/useNotifications';
import { getNotificationCopy } from '@/features/notifications/utils/notification-copy';
import { getNotificationHref } from '@/features/notifications/utils/notification-navigation';
import { convertToPersianDigits } from '@/utils/persian-format';

function formatRelativeTime(iso: string, locale: string): string {
  const date = new Date(iso);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60_000);
  const rtf = new Intl.RelativeTimeFormat(locale.startsWith('fa') ? 'fa' : 'en', {
    numeric: 'auto',
  });

  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return rtf.format(diffDays, 'day');
}

export function NotificationBell() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: unreadCount = 0 } = useUnreadNotificationCount(Boolean(user));
  const { data: notifications = [], isLoading } = useNotifications(open && Boolean(user));
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const badgeCount = unreadCount > 99 ? 99 : unreadCount;

  const panel = useMemo(
    () => (
      <div className="notification-panel" role="menu">
        <div className="notification-panel__header">
          <Typography.Text strong>{t('notifications.title')}</Typography.Text>
          {unreadCount > 0 ? (
            <Button
              type="link"
              size="small"
              onClick={() => markAllRead.mutate()}
              loading={markAllRead.isPending}
            >
              {t('notifications.markAllRead')}
            </Button>
          ) : null}
        </div>

        <div className="notification-panel__list">
          {isLoading ? (
            <div className="notification-panel__state">
              <Spin size="small" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-panel__state">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t('notifications.empty')}
              />
            </div>
          ) : (
            notifications.map((item) => {
              const copy = getNotificationCopy(item, t);
              const timeLabel = formatRelativeTime(item.createdAt, i18n.language);
              const displayTime = i18n.language.startsWith('fa')
                ? convertToPersianDigits(timeLabel)
                : timeLabel;

              return (
                <button
                  key={item.notificationId}
                  type="button"
                  className={`notification-panel__item${item.isRead ? '' : ' is-unread'}`}
                  onClick={async () => {
                    if (!item.isRead) {
                      markRead.mutate(item.notificationId);
                    }
                    const href = getNotificationHref(item, user?.role);
                    setOpen(false);
                    if (href) {
                      navigate(href);
                    }
                  }}
                >
                  <span className="notification-panel__item-title">{copy.title}</span>
                  <span className="notification-panel__item-body">{copy.body}</span>
                  <span className="notification-panel__item-time">{displayTime}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    ),
    [
      i18n.language,
      isLoading,
      markAllRead,
      markRead,
      navigate,
      notifications,
      t,
      unreadCount,
      user?.role,
    ],
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={['click']}
      placement="bottomRight"
      popupRender={() => panel}
    >
      <Badge count={badgeCount} size="small" offset={[-2, 2]}>
        <Button
          type="text"
          icon={<Bell {...appIconProps} />}
          aria-label={t('notifications.title')}
          title={t('notifications.title')}
        />
      </Badge>
    </Dropdown>
  );
}
