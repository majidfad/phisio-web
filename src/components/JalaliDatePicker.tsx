import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import {
  getCurrentJalaliDate,
  getJalaliMonthLength,
  getJalaliMonthStartWeekday,
  isoDateToJalali,
  jalaliToIsoDate,
  JALALI_MONTH_LABELS,
  JALALI_WEEKDAY_LABELS,
  shiftJalaliMonth,
} from '@/utils/jalali-calendar';
import {
  formatPersianCalendarDateLong,
  formatPersianNumber,
  formatPersianYear,
} from '@/utils/persian-format';

const { Text } = Typography;

interface JalaliDatePickerProps {
  value: string;
  onChange: (isoDate: string) => void;
  ariaLabel?: string;
}

export function JalaliDatePicker({ value, onChange, ariaLabel }: JalaliDatePickerProps) {
  const { t } = useTranslation();
  const today = getCurrentJalaliDate();
  const selected = value ? isoDateToJalali(value) : today;
  const [viewYear, setViewYear] = useState(selected.jy);
  const [viewMonth, setViewMonth] = useState(selected.jm);

  const monthLength = getJalaliMonthLength(viewYear, viewMonth);
  const startWeekday = getJalaliMonthStartWeekday(viewYear, viewMonth);

  const calendarCells = useMemo(() => {
    const blanks = Array.from({ length: startWeekday }, () => null);
    const days = Array.from({ length: monthLength }, (_, index) => index + 1);
    return [...blanks, ...days];
  }, [monthLength, startWeekday]);

  const goToPreviousMonth = () => {
    const shifted = shiftJalaliMonth(viewYear, viewMonth, -1);
    setViewYear(shifted.jy);
    setViewMonth(shifted.jm);
  };

  const goToNextMonth = () => {
    const shifted = shiftJalaliMonth(viewYear, viewMonth, 1);
    setViewYear(shifted.jy);
    setViewMonth(shifted.jm);
  };

  return (
    <div style={{ maxWidth: 320 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Button
          type="text"
          icon={<ChevronRight {...appIconProps} />}
          aria-label={t('doctor.patients.exercisePlan.wizard.dates.previousMonth')}
          onClick={goToPreviousMonth}
        />
        <Text strong>
          {JALALI_MONTH_LABELS[viewMonth - 1]} {formatPersianYear(viewYear)}
        </Text>
        <Button
          type="text"
          icon={<ChevronLeft {...appIconProps} />}
          aria-label={t('doctor.patients.exercisePlan.wizard.dates.nextMonth')}
          onClick={goToNextMonth}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
          marginBottom: 8,
        }}
        aria-hidden="true"
      >
        {JALALI_WEEKDAY_LABELS.map((label) => (
          <Text key={label} type="secondary" style={{ textAlign: 'center', fontSize: 12 }}>
            {label}
          </Text>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
        }}
        role="grid"
        aria-label={ariaLabel ?? t('doctor.patients.exercisePlan.wizard.dates.calendar')}
      >
        {calendarCells.map((day, index) => {
          if (day === null) {
            return <span key={`blank-${index}`} />;
          }

          const isoDate = jalaliToIsoDate({ jy: viewYear, jm: viewMonth, jd: day });
          const isSelected = isoDate === value;
          const jalali = isoDateToJalali(isoDate);
          const isToday =
            jalali.jy === today.jy && jalali.jm === today.jm && jalali.jd === today.jd;

          return (
            <Button
              key={isoDate}
              type={isSelected ? 'primary' : 'text'}
              role="gridcell"
              aria-pressed={isSelected}
              onClick={() => onChange(isoDate)}
              style={{
                height: 36,
                padding: 0,
                border: isToday ? '1px solid var(--phisio-primary)' : undefined,
              }}
            >
              {formatPersianNumber(day)}
            </Button>
          );
        })}
      </div>

      {value ? (
        <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
          {formatPersianCalendarDateLong(value)}
        </Text>
      ) : null}
    </div>
  );
}
