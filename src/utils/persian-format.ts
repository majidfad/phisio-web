/** Default locale for Persian (Farsi) display formatting. */
export const DEFAULT_DISPLAY_LOCALE = 'fa-IR' as const;

const PERSIAN_DIGIT_OFFSET = '۰'.charCodeAt(0) - '0'.charCodeAt(0);

const EMPTY_DISPLAY = '—';

export const DEFAULT_PERSIAN_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

export const PERSIAN_CALENDAR_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  calendar: 'persian',
};

/**
 * Converts Western digits (0-9) in a string or number to Persian digits (۰-۹).
 * Non-digit characters are preserved — useful for phone numbers with +, spaces, etc.
 */
export function convertToPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) + PERSIAN_DIGIT_OFFSET),
  );
}

/**
 * Formats a Jalali/Gregorian calendar year for display without thousand separators.
 * Example: 1405 -> ۱۴۰۵ (not ۱,۴۰۵).
 */
export function formatPersianYear(value: number): string {
  return convertToPersianDigits(String(Math.trunc(value)));
}

/** Removes locale grouping separators from formatted calendar strings. */
function stripLocaleGroupingSeparators(value: string): string {
  return value.replace(/[,،\u066C]/g, '');
}

/**
 * Formats a numeric value for display using Intl.NumberFormat.
 * Defaults to Persian locale and digits.
 */
export function formatPersianNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale: string = DEFAULT_DISPLAY_LOCALE,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

type PersianDateInput = Date | string | number | undefined | null;

/**
 * Formats a date/time for display using Intl.DateTimeFormat.
 * Defaults to Persian locale (includes Persian digits and calendar labels).
 */
export function formatPersianDate(
  value: PersianDateInput,
  options: Intl.DateTimeFormatOptions = DEFAULT_PERSIAN_DATE_OPTIONS,
  locale: string = DEFAULT_DISPLAY_LOCALE,
): string {
  if (value === undefined || value === null || value === '') {
    return EMPTY_DISPLAY;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return EMPTY_DISPLAY;
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Parses an API date-only string (yyyy-MM-dd) as UTC midnight.
 */
export function parseApiDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Formats a date-only API value using the Persian calendar (e.g. ۱۴۰۵/۰۴/۰۱).
 */
export function formatPersianCalendarDate(
  value: string,
  locale: string = DEFAULT_DISPLAY_LOCALE,
): string {
  const date = parseApiDateOnly(value);

  if (Number.isNaN(date.getTime())) {
    return EMPTY_DISPLAY;
  }

  return stripLocaleGroupingSeparators(
    new Intl.DateTimeFormat(locale, PERSIAN_CALENDAR_DATE_OPTIONS).format(date),
  );
}

/**
 * Formats a date-only API value as a long Persian calendar label (e.g. ۱۰ تیر ۱۴۰۵).
 */
export function formatPersianCalendarDateLong(
  value: string,
  locale: string = DEFAULT_DISPLAY_LOCALE,
): string {
  const date = parseApiDateOnly(value);

  if (Number.isNaN(date.getTime())) {
    return EMPTY_DISPLAY;
  }

  return stripLocaleGroupingSeparators(
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      calendar: 'persian',
    }).format(date),
  );
}

/**
 * Formats a phone number for read-only UI display (Persian digits, structure preserved).
 */
export function formatDisplayPhone(phone: string | undefined | null): string {
  if (!phone) {
    return EMPTY_DISPLAY;
  }

  return convertToPersianDigits(phone);
}
