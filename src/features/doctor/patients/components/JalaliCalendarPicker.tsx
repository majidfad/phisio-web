import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, Space, Typography } from 'antd';
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
  sortIsoDatesAsc,
} from '@/utils/jalali-calendar';
import {
  formatPersianCalendarDateLong,
  formatPersianNumber,
  formatPersianYear,
} from '@/utils/persian-format';

const { Text } = Typography;

interface JalaliCalendarPickerProps {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
}

export function JalaliCalendarPicker({ selectedDates, onChange }: JalaliCalendarPickerProps) {
  const { t } = useTranslation();
  const initial = getCurrentJalaliDate();
  const [viewYear, setViewYear] = useState(initial.jy);
  const [viewMonth, setViewMonth] = useState(initial.jm);

  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates]);
  const monthLength = getJalaliMonthLength(viewYear, viewMonth);
  const startWeekday = getJalaliMonthStartWeekday(viewYear, viewMonth);

  const calendarCells = useMemo(() => {
    const blanks = Array.from({ length: startWeekday }, () => null);
    const days = Array.from({ length: monthLength }, (_, index) => index + 1);
    return [...blanks, ...days];
  }, [monthLength, startWeekday]);

  const sortedSelectedDates = sortIsoDatesAsc(selectedDates);

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

  const toggleDate = (day: number) => {
    const isoDate = jalaliToIsoDate({ jy: viewYear, jm: viewMonth, jd: day });

    if (selectedSet.has(isoDate)) {
      onChange(selectedDates.filter((date) => date !== isoDate));
      return;
    }

    onChange(sortIsoDatesAsc([...selectedDates, isoDate]));
  };

  const removeDate = (isoDate: string) => {
    onChange(selectedDates.filter((date) => date !== isoDate));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Card style={{ flex: '1 1 280px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
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
          aria-label={t('doctor.patients.exercisePlan.wizard.dates.calendar')}
        >
          {calendarCells.map((day, index) => {
            if (day === null) {
              return <span key={`blank-${index}`} />;
            }

            const isoDate = jalaliToIsoDate({ jy: viewYear, jm: viewMonth, jd: day });
            const isSelected = selectedSet.has(isoDate);
            const jalali = isoDateToJalali(isoDate);
            const isToday =
              jalali.jy === initial.jy && jalali.jm === initial.jm && jalali.jd === initial.jd;

            return (
              <Button
                key={isoDate}
                type={isSelected ? 'primary' : 'text'}
                role="gridcell"
                aria-pressed={isSelected}
                onClick={() => toggleDate(day)}
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
      </Card>

      <Card
        title={t('doctor.patients.exercisePlan.wizard.dates.selectedTitle')}
        style={{ flex: '1 1 220px' }}
        aria-label={t('doctor.patients.exercisePlan.wizard.dates.selectedTitle')}
      >
        {sortedSelectedDates.length === 0 ? (
          <Text type="secondary">{t('doctor.patients.exercisePlan.wizard.dates.empty')}</Text>
        ) : (
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            {sortedSelectedDates.map((isoDate) => (
              <div
                key={isoDate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <Text>{formatPersianCalendarDateLong(isoDate)}</Text>
                <Button
                  type="text"
                  size="small"
                  danger
                  aria-label={t('doctor.patients.exercisePlan.wizard.dates.removeDate')}
                  onClick={() => removeDate(isoDate)}
                >
                  ×
                </Button>
              </div>
            ))}
          </Space>
        )}
      </Card>
    </div>
  );
}
