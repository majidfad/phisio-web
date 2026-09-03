import { CheckCircle2 } from 'lucide-react';
import { Button, Drawer, Form, Grid, Input, Modal, Radio, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { patientDailyFeedbackService } from '@/features/patient/feedback/services/patientDailyFeedbackService';
import {
  DAILY_FEEDBACK_COMMENT_MAX_LENGTH,
  DAILY_FEEDBACK_HARDNESS_LABEL_KEYS,
  DAILY_FEEDBACK_SCORE_LABEL_KEYS,
  DAILY_FEEDBACK_SCORE_MAX,
  DAILY_FEEDBACK_SCORE_MIN,
} from '@/features/patient/feedback/types/daily-feedback';
import { useToast } from '@/hooks/useToast';
import { formatPersianNumber } from '@/utils/persian-format';
import { getErrorMessage } from '@/utils/get-error-message';

const { Text, Paragraph } = Typography;

interface DailyFeedbackModalProps {
  isOpen: boolean;
  doctorId?: string | null;
  clinicId?: string | null;
  doctorName?: string | null;
  completedCount?: number;
  onClose: () => void;
}

export function DailyFeedbackModal({
  isOpen,
  doctorId,
  clinicId,
  doctorName,
  completedCount = 0,
  onClose,
}: DailyFeedbackModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [hardnessScore, setHardnessScore] = useState<number | null>(null);
  const [improvementScore, setImprovementScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setHardnessScore(null);
      setImprovementScore(null);
      setComment('');
    }
  }

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (hardnessScore === null || improvementScore === null) {
      toast.error(t('patient.feedback.errors.scoresRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      await patientDailyFeedbackService.submitFeedback({
        doctorId: doctorId ?? undefined,
        clinicId: clinicId ?? undefined,
        hardnessScore,
        improvementScore,
        comment: comment.trim() || null,
      });

      toast.success(t('patient.feedback.success'));
      handleClose();
    } catch (error) {
      toast.error(getErrorMessage(error, t('patient.feedback.errors.submitFailed')));
    } finally {
      setIsSubmitting(false);
    }
  };

  const scoreOptions = Array.from(
    { length: DAILY_FEEDBACK_SCORE_MAX - DAILY_FEEDBACK_SCORE_MIN + 1 },
    (_, index) => DAILY_FEEDBACK_SCORE_MIN + index,
  );

  const content = (
    <div className="patient-stack patient-stack--loose">
      <div className="workout-summary">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'var(--phisio-accent-soft)',
            color: 'var(--phisio-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <CheckCircle2 size={26} strokeWidth={2} />
        </div>
        <h3 className="workout-summary__title">{t('patient.feedback.greatJob')}</h3>
        <p className="workout-summary__text">
          {t('patient.feedback.summary', {
            count: formatPersianNumber(completedCount),
            doctorName: doctorName ?? '',
          })}
        </p>
      </div>

      <div>
        <Paragraph strong style={{ marginBottom: 8 }}>
          {t('patient.feedback.hardnessQuestion')}
        </Paragraph>
        <Radio.Group
          value={hardnessScore ?? undefined}
          onChange={(e) => setHardnessScore(e.target.value as number)}
          className="feedback-score-stack"
        >
          {scoreOptions.map((score) => (
            <Radio.Button key={`hardness-${score}`} value={score} className="feedback-score-option">
              {formatPersianNumber(score)} — {t(DAILY_FEEDBACK_HARDNESS_LABEL_KEYS[score - 1])}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <div>
        <Paragraph strong style={{ marginBottom: 8 }}>
          {t('patient.feedback.question')}
        </Paragraph>
        <Radio.Group
          value={improvementScore ?? undefined}
          onChange={(e) => setImprovementScore(e.target.value as number)}
          className="feedback-score-stack"
        >
          {scoreOptions.map((score) => (
            <Radio.Button
              key={`improvement-${score}`}
              value={score}
              className="feedback-score-option"
            >
              {formatPersianNumber(score)} — {t(DAILY_FEEDBACK_SCORE_LABEL_KEYS[score - 1])}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <Form.Item label={t('patient.feedback.commentLabel')} style={{ marginBottom: 0 }}>
        <Input.TextArea
          value={comment}
          maxLength={DAILY_FEEDBACK_COMMENT_MAX_LENGTH}
          placeholder={t('patient.feedback.commentPlaceholder')}
          rows={3}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Item>
      <Text type="secondary">
        {t('patient.feedback.commentHint', {
          count: formatPersianNumber(DAILY_FEEDBACK_COMMENT_MAX_LENGTH - comment.length),
        })}
      </Text>

      <div className="patient-media-card__actions" style={{ justifyContent: 'flex-end' }}>
        <Button size="large" onClick={handleClose} disabled={isSubmitting}>
          {t('patient.feedback.skip')}
        </Button>
        <Button
          type="primary"
          size="large"
          loading={isSubmitting}
          disabled={hardnessScore === null || improvementScore === null}
          onClick={() => void handleSubmit()}
        >
          {t('patient.feedback.submit')}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        title={t('patient.feedback.title')}
        open={isOpen}
        onClose={handleClose}
        placement="bottom"
        height="auto"
        styles={{ body: { paddingBottom: 24 } }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Modal
      title={t('patient.feedback.title')}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={480}
      centered
      style={{ borderRadius: 'var(--phisio-radius-xl)', overflow: 'hidden' }}
    >
      {content}
    </Modal>
  );
}
