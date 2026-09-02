import enCommon from '@/locales/en/common.json';
import faCommon from '@/locales/fa/common.json';

type NotificationTypeCopy = {
  title: string;
  body: string;
  body_one?: string;
  body_other?: string;
};

function normalizeLanguage(language: string): 'fa' | 'en' {
  return language.startsWith('fa') ? 'fa' : 'en';
}

function interpolate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] ?? ''));
}

function pickBody(copy: NotificationTypeCopy, data: Record<string, unknown>): string {
  const count = typeof data.count === 'number' ? data.count : 0;
  if (count === 1 && copy.body_one) {
    return interpolate(copy.body_one, data);
  }
  if (count > 1 && copy.body_other) {
    return interpolate(copy.body_other, data);
  }
  return interpolate(copy.body, data);
}

export function getPushNotificationCopy(
  type: string,
  language: string,
  data: Record<string, unknown> = {},
): { title: string; body: string } {
  const lang = normalizeLanguage(language);
  const resources = lang === 'fa' ? faCommon : enCommon;
  const types = resources.notifications.types as Record<string, NotificationTypeCopy>;
  const copy = types[type];

  if (!copy) {
    return { title: 'Zivan', body: '' };
  }

  return {
    title: interpolate(copy.title, data),
    body: pickBody(copy, data),
  };
}

export function getPushNotificationLanguageMeta(language: string): {
  lang: string;
  dir: 'rtl' | 'ltr';
} {
  const lang = normalizeLanguage(language);
  return {
    lang,
    dir: lang === 'fa' ? 'rtl' : 'ltr',
  };
}
