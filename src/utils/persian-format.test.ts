import { describe, expect, it } from 'vitest';

import {
  convertToPersianDigits,
  formatDisplayPhone,
  formatPersianCalendarDate,
  formatPersianCalendarDateLong,
  formatPersianDate,
  formatPersianNumber,
  formatPersianYear,
} from '@/utils/persian-format';

describe('convertToPersianDigits', () => {
  it('converts Western digits to Persian digits', () => {
    expect(convertToPersianDigits('0123456789')).toBe('۰۱۲۳۴۵۶۷۸۹');
  });

  it('preserves non-digit characters in phone numbers', () => {
    expect(convertToPersianDigits('+98 912-345-6789')).toBe('+۹۸ ۹۱۲-۳۴۵-۶۷۸۹');
  });

  it('converts numbers', () => {
    expect(convertToPersianDigits(42)).toBe('۴۲');
  });
});

describe('formatPersianYear', () => {
  it('formats calendar years without thousand separators', () => {
    expect(formatPersianYear(1405)).toBe('۱۴۰۵');
    expect(formatPersianYear(1406)).toBe('۱۴۰۶');
    expect(formatPersianYear(1407)).toBe('۱۴۰۷');
    expect(formatPersianYear(1405)).not.toContain(',');
    expect(formatPersianYear(1405)).not.toContain('،');
  });
});

describe('formatPersianCalendarDateLong', () => {
  it('formats long Persian calendar dates without grouped years', () => {
    const formatted = formatPersianCalendarDateLong('2026-06-21');

    expect(formatted).toMatch(/[۰-۹]/);
    expect(formatted).not.toMatch(/[,،]/);
  });
});

describe('formatPersianCalendarDate', () => {
  it('formats short Persian calendar dates without grouped years', () => {
    const formatted = formatPersianCalendarDate('2026-06-21');

    expect(formatted).toMatch(/[۰-۹]/);
    expect(formatted).not.toMatch(/[,،]/);
  });
});

describe('formatPersianNumber', () => {
  it('formats integers with Persian digits', () => {
    const formatted = formatPersianNumber(1234);
    expect(formatted).toMatch(/[۰-۹]/);
    expect(formatted).not.toMatch(/[0-9]/);
  });

  it('supports custom Intl options', () => {
    const formatted = formatPersianNumber(0.5, { style: 'percent' });
    expect(formatted).toMatch(/[۰-۹]/);
  });
});

describe('formatPersianDate', () => {
  it('formats valid ISO dates with Persian locale', () => {
    const formatted = formatPersianDate('2024-01-15T10:00:00Z');
    expect(formatted).not.toBe('—');
    expect(formatted).toMatch(/[۰-۹]/);
  });

  it('returns dash for missing dates', () => {
    expect(formatPersianDate(undefined)).toBe('—');
    expect(formatPersianDate('invalid')).toBe('—');
  });
});

describe('formatDisplayPhone', () => {
  it('formats phone numbers with Persian digits', () => {
    expect(formatDisplayPhone('+989121234567')).toBe('+۹۸۹۱۲۱۲۳۴۵۶۷');
  });

  it('returns dash for empty values', () => {
    expect(formatDisplayPhone(undefined)).toBe('—');
  });
});
