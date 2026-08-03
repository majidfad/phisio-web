import { Button, Modal } from 'antd';
import { Award, CheckCircle2, Clock3, Flame } from 'lucide-react';
import type { ReactNode } from 'react';

import { convertToPersianDigits } from '@/utils/persian-format';

interface WorkoutCompletionModalProps {
  open: boolean;
  completedCount: number;
  totalCount: number;
  streakDays?: number;
  durationMinutes?: number;
  onClose: () => void;
  onViewProgress: () => void;
}

export function WorkoutCompletionModal({
  open,
  completedCount,
  totalCount,
  streakDays = 3,
  durationMinutes,
  onClose,
  onViewProgress,
}: WorkoutCompletionModalProps) {
  const minutes =
    durationMinutes ?? Math.max(completedCount * 4, completedCount > 0 ? 5 : 0);

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={380}
      styles={{
        body: {
          padding: '20px 16px 16px',
          backgroundColor: 'var(--phisio-surface)',
          textAlign: 'center',
        },
      }}
      style={{ borderRadius: 'var(--phisio-radius-xl)', overflow: 'hidden' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--phisio-accent-soft)',
            color: 'var(--phisio-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle2 size={36} strokeWidth={2} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--phisio-text)',
              margin: 0,
            }}
          >
            خسته نباشید
          </h2>
          <p
            style={{
              fontSize: 'var(--phisio-font-meta)',
              fontWeight: 500,
              color: 'var(--phisio-text-secondary)',
              margin: 0,
            }}
          >
            تمرین‌های امروز شما با موفقیت ثبت شد
          </p>
        </div>

        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
          }}
        >
          <StatMini
            icon={<Clock3 size={15} />}
            label="مدت"
            value={`${convertToPersianDigits(minutes)} دقیقه`}
            accent="var(--phisio-primary)"
          />
          <StatMini
            icon={<Award size={15} />}
            label="تمرین"
            value={`${convertToPersianDigits(completedCount)} از ${convertToPersianDigits(totalCount)}`}
            accent="var(--phisio-teal)"
          />
          <StatMini
            icon={<Flame size={15} />}
            label="زنجیره"
            value={`${convertToPersianDigits(streakDays)} روز`}
            accent="var(--phisio-warning)"
          />
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button
            type="primary"
            size="large"
            block
            style={{
              height: '44px',
              borderRadius: 'var(--phisio-radius-pill)',
              fontWeight: 600,
            }}
            onClick={onViewProgress}
          >
            مشاهده جزئیات
          </Button>
          <Button
            size="large"
            block
            style={{
              height: '40px',
              borderRadius: 'var(--phisio-radius)',
              fontWeight: 600,
              borderColor: 'var(--phisio-border)',
              color: 'var(--phisio-text)',
            }}
            onClick={onClose}
          >
            بستن
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function StatMini({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: '10px 6px',
        borderRadius: 'var(--phisio-radius-md)',
        backgroundColor: 'var(--phisio-bg-elevated)',
        border: '1px solid var(--phisio-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: accent }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
      </div>
      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--phisio-text)' }}>
        {value}
      </span>
    </div>
  );
}
