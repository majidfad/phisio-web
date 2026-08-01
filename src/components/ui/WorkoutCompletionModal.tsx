import { Button, Modal } from 'antd';
import { Award, CheckCircle2, Flame } from 'lucide-react';

import { convertToPersianDigits } from '@/utils/persian-format';

interface WorkoutCompletionModalProps {
  open: boolean;
  completedCount: number;
  totalCount: number;
  streakDays?: number;
  onClose: () => void;
  onViewProgress: () => void;
}

export function WorkoutCompletionModal({
  open,
  completedCount,
  totalCount,
  streakDays = 3,
  onClose,
  onViewProgress,
}: WorkoutCompletionModalProps) {
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
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--phisio-radius-md)',
              backgroundColor: 'var(--phisio-bg-elevated)',
              border: '1px solid var(--phisio-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--phisio-primary)',
              }}
            >
              <Award size={16} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>تکمیل شده</span>
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--phisio-text)' }}>
              {convertToPersianDigits(completedCount)} از {convertToPersianDigits(totalCount)}
            </span>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--phisio-radius-md)',
              backgroundColor: 'var(--phisio-bg-elevated)',
              border: '1px solid var(--phisio-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--phisio-warning)',
              }}
            >
              <Flame size={16} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>زنجیره تمرین</span>
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--phisio-text)' }}>
              {convertToPersianDigits(streakDays)} روز
            </span>
          </div>
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
            onClick={onClose}
          >
            بازگشت به داشبورد
          </Button>
          <Button
            size="large"
            block
            style={{
              height: '40px',
              borderRadius: 'var(--phisio-radius-md)',
              fontWeight: 600,
              borderColor: 'var(--phisio-border)',
              color: 'var(--phisio-text)',
            }}
            onClick={onViewProgress}
          >
            مشاهده روند پیشرفت
          </Button>
        </div>
      </div>
    </Modal>
  );
}
