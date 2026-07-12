import { jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js';

import { parseApiDateOnly } from '@/utils/persian-format';

export interface JalaliDateParts {
  jy: number;
  jm: number;
  jd: number;
}

export const JALALI_WEEKDAY_LABELS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const;

export const JALALI_MONTH_LABELS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const;

export function getTodayIsoDate(): string {
  const today = new Date();
  return toIsoDateUtc(today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate());
}

export function toIsoDateUtc(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function jalaliToIsoDate({ jy, jm, jd }: JalaliDateParts): string {
  const gregorian = toGregorian(jy, jm, jd);
  return toIsoDateUtc(gregorian.gy, gregorian.gm, gregorian.gd);
}

export function isoDateToJalali(isoDate: string): JalaliDateParts {
  const date = parseApiDateOnly(isoDate);
  return toJalaali(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function getCurrentJalaliDate(): JalaliDateParts {
  const today = new Date();
  return toJalaali(today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate());
}

export function getJalaliMonthLength(jy: number, jm: number): number {
  return jalaaliMonthLength(jy, jm);
}

export function getJalaliMonthStartWeekday(jy: number, jm: number): number {
  const gregorian = toGregorian(jy, jm, 1);
  const weekday = new Date(Date.UTC(gregorian.gy, gregorian.gm - 1, gregorian.gd)).getUTCDay();
  return (weekday + 1) % 7;
}

export function shiftJalaliMonth(jy: number, jm: number, offset: number): JalaliDateParts {
  let year = jy;
  let month = jm + offset;

  while (month > 12) {
    month -= 12;
    year += 1;
  }

  while (month < 1) {
    month += 12;
    year -= 1;
  }

  return { jy: year, jm: month, jd: 1 };
}

export function compareIsoDates(left: string, right: string): number {
  return left.localeCompare(right);
}

export function sortIsoDatesAsc(dates: string[]): string[] {
  return [...dates].sort(compareIsoDates);
}
