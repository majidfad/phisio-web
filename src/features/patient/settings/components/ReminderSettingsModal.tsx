import { Bell } from 'lucide-react';
import {
  Button,
  Form,
  InputNumber,
  Modal,
  Radio,
  Space,
  Switch,
  TimePicker,
  Typography,
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import {
  usePatientReminderSettings,
  useUpdatePatientReminderSettings,
} from '@/features/patient/settings/hooks/usePatientReminderSettings';
import {
  ALL_DAYS_MASK,
  type PatientReminderSettingsDto,
  ReminderRepeatMode,
  WEEKDAY_VALUES,
  buildDaysOfWeekMask,
  daysFromMask,
} from '@/features/patient/settings/types/reminder-settings';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

interface ReminderSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function parseTime(value: string | undefined, fallback: string): Dayjs {
  const parsed = dayjs(value || fallback, ['HH:mm:ss', 'HH:mm'], true);
  return parsed.isValid() ? parsed : dayjs(fallback, 'HH:mm');
}

interface ReminderSettingsFormProps {
  data: PatientReminderSettingsDto;
  formDisabled: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: {
    exerciseRemindersEnabled: boolean;
    preferredReminderTime: string;
    timeZoneId: string;
    repeatMode: ReminderRepeatMode;
    daysOfWeekMask: number;
    intervalDays: number;
    followUpEnabled: boolean;
    followUpReminderTime: string;
  }) => Promise<void>;
}

function ReminderSettingsForm({
  data,
  formDisabled,
  saving,
  onClose,
  onSave,
}: ReminderSettingsFormProps) {
  const { t } = useTranslation();
  const toast = useToast();

  const [enabled, setEnabled] = useState(data.exerciseRemindersEnabled);
  const [time, setTime] = useState<Dayjs>(() => parseTime(data.preferredReminderTime, '09:00'));
  const [repeatMode, setRepeatMode] = useState<ReminderRepeatMode>(
    data.repeatMode ?? ReminderRepeatMode.Daily,
  );
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>(() =>
    daysFromMask(data.daysOfWeekMask || ALL_DAYS_MASK),
  );
  const [intervalDays, setIntervalDays] = useState(data.intervalDays || 2);
  const [followUpEnabled, setFollowUpEnabled] = useState(data.followUpEnabled);
  const [followUpTime, setFollowUpTime] = useState<Dayjs>(() =>
    parseTime(data.followUpReminderTime, '18:00'),
  );

  const summary = useMemo(() => {
    if (!enabled) {
      return t('patient.reminderSettings.summary.off');
    }

    const timeLabel = time.format('HH:mm');
    if (repeatMode === ReminderRepeatMode.Interval) {
      return t('patient.reminderSettings.summary.interval', {
        time: timeLabel,
        count: intervalDays,
      });
    }

    if (repeatMode === ReminderRepeatMode.DaysOfWeek) {
      const days = selectedWeekdays
        .map((day) => t(`patient.reminderSettings.weekdays.${day}`))
        .join(t('patient.reminderSettings.summary.daySeparator'));
      return t('patient.reminderSettings.summary.daysOfWeek', {
        time: timeLabel,
        days,
      });
    }

    return t('patient.reminderSettings.summary.daily', { time: timeLabel });
  }, [enabled, intervalDays, repeatMode, selectedWeekdays, t, time]);

  const handleSave = async () => {
    if (enabled && repeatMode === ReminderRepeatMode.DaysOfWeek && selectedWeekdays.length === 0) {
      toast.error(t('patient.reminderSettings.errors.noWeekdays'));
      return;
    }

    if (enabled && followUpEnabled && followUpTime.isBefore(time.add(1, 'minute'))) {
      toast.error(t('patient.reminderSettings.errors.followUpAfterPrimary'));
      return;
    }

    await onSave({
      exerciseRemindersEnabled: enabled,
      preferredReminderTime: time.format('HH:mm'),
      timeZoneId: data.timeZoneId ?? 'Asia/Tehran',
      repeatMode,
      daysOfWeekMask:
        repeatMode === ReminderRepeatMode.Daily
          ? ALL_DAYS_MASK
          : buildDaysOfWeekMask(selectedWeekdays),
      intervalDays: Math.max(1, intervalDays),
      followUpEnabled,
      followUpReminderTime: followUpTime.format('HH:mm'),
    });
  };

  return (
    <>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
        {t('patient.reminderSettings.description')}
      </Typography.Paragraph>

      <div className="reminder-settings__summary">{summary}</div>

      <Form layout="vertical" disabled={formDisabled} style={{ marginTop: 16 }}>
        <Form.Item label={t('patient.reminderSettings.enabled')}>
          <Switch checked={enabled} onChange={setEnabled} />
        </Form.Item>

        <Form.Item
          label={t('patient.reminderSettings.time')}
          extra={t('patient.reminderSettings.timeHint')}
        >
          <TimePicker
            value={time}
            onChange={(value) => {
              if (value) setTime(value);
            }}
            format="HH:mm"
            minuteStep={15}
            needConfirm={false}
            style={{ width: '100%' }}
            disabled={!enabled}
          />
        </Form.Item>

        <Form.Item label={t('patient.reminderSettings.repeat.label')}>
          <Radio.Group
            value={repeatMode}
            onChange={(event) => setRepeatMode(event.target.value)}
            optionType="button"
            buttonStyle="solid"
            disabled={!enabled}
            options={[
              {
                value: ReminderRepeatMode.Daily,
                label: t('patient.reminderSettings.repeat.daily'),
              },
              {
                value: ReminderRepeatMode.DaysOfWeek,
                label: t('patient.reminderSettings.repeat.daysOfWeek'),
              },
              {
                value: ReminderRepeatMode.Interval,
                label: t('patient.reminderSettings.repeat.interval'),
              },
            ]}
          />
        </Form.Item>

        {repeatMode === ReminderRepeatMode.DaysOfWeek ? (
          <Form.Item label={t('patient.reminderSettings.repeat.weekdaysLabel')}>
            <div className="reminder-settings__weekdays">
              {WEEKDAY_VALUES.map((day) => {
                const active = selectedWeekdays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    className={`kit-filter-chip${active ? ' kit-filter-chip--active' : ''}`}
                    aria-pressed={active}
                    disabled={!enabled || formDisabled}
                    onClick={() => {
                      setSelectedWeekdays((current) =>
                        current.includes(day)
                          ? current.filter((value) => value !== day)
                          : [...current, day].sort((a, b) => a - b),
                      );
                    }}
                  >
                    {t(`patient.reminderSettings.weekdays.${day}`)}
                  </button>
                );
              })}
            </div>
          </Form.Item>
        ) : null}

        {repeatMode === ReminderRepeatMode.Interval ? (
          <Form.Item
            label={t('patient.reminderSettings.repeat.intervalLabel')}
            extra={t('patient.reminderSettings.repeat.intervalHint')}
          >
            <Space>
              <Typography.Text>{t('patient.reminderSettings.repeat.every')}</Typography.Text>
              <InputNumber
                min={1}
                max={30}
                value={intervalDays}
                onChange={(value) => setIntervalDays(value ?? 1)}
                disabled={!enabled}
              />
              <Typography.Text>{t('patient.reminderSettings.repeat.days')}</Typography.Text>
            </Space>
          </Form.Item>
        ) : null}

        <Form.Item
          label={t('patient.reminderSettings.followUp.enabled')}
          extra={t('patient.reminderSettings.followUp.hint')}
        >
          <Switch checked={followUpEnabled} onChange={setFollowUpEnabled} disabled={!enabled} />
        </Form.Item>

        {followUpEnabled ? (
          <Form.Item label={t('patient.reminderSettings.followUp.time')}>
            <TimePicker
              value={followUpTime}
              onChange={(value) => {
                if (value) setFollowUpTime(value);
              }}
              format="HH:mm"
              minuteStep={15}
              needConfirm={false}
              style={{ width: '100%' }}
              disabled={!enabled}
            />
          </Form.Item>
        ) : null}

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>{t('patient.reminderSettings.cancel')}</Button>
            <Button
              type="primary"
              icon={<Bell {...appIconProps} />}
              loading={saving}
              onClick={() => void handleSave()}
            >
              {t('patient.reminderSettings.save')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}

export function ReminderSettingsModal({ open, onClose }: ReminderSettingsModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { data, isLoading } = usePatientReminderSettings(open);
  const updateSettings = useUpdatePatientReminderSettings();

  const handleSave = async (payload: Parameters<ReminderSettingsFormProps['onSave']>[0]) => {
    try {
      await updateSettings.mutateAsync(payload);
      toast.success(t('patient.reminderSettings.success'));
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, t('patient.reminderSettings.error')));
    }
  };

  return (
    <Modal
      title={t('patient.reminderSettings.title')}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={440}
      loading={isLoading && !data}
    >
      {data ? (
        <ReminderSettingsForm
          data={data}
          formDisabled={isLoading || updateSettings.isPending}
          saving={updateSettings.isPending}
          onClose={onClose}
          onSave={handleSave}
        />
      ) : null}
    </Modal>
  );
}
