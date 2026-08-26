import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { describe, expect, it } from 'vitest';

dayjs.extend(customParseFormat);

/** Mirrors ReminderSettingsModal.parseTime parsing rules for regression coverage. */
function parseTime(value: string | undefined, fallback: string) {
  const parsed = dayjs(value || fallback, ['HH:mm:ss', 'HH:mm'], true);
  if (parsed.isValid()) {
    return parsed;
  }

  const fallbackParsed = dayjs(fallback, 'HH:mm', true);
  return fallbackParsed.isValid() ? fallbackParsed : dayjs().hour(9).minute(0).second(0);
}

describe('reminder time parsing', () => {
  it('parses HH:mm values returned by the API', () => {
    expect(parseTime('14:30', '09:00').format('HH:mm')).toBe('14:30');
  });

  it('parses HH:mm:ss values', () => {
    expect(parseTime('18:00:00', '09:00').format('HH:mm')).toBe('18:00');
  });

  it('falls back when the value is missing', () => {
    expect(parseTime(undefined, '09:00').format('HH:mm')).toBe('09:00');
  });
});
