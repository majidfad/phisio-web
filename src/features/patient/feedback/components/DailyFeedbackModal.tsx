import { Alert, Button, Drawer, Form, Grid, Input, Modal, Radio, Space, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { patientDailyFeedbackService } from '@/features/patient/feedback/services/patientDailyFeedbackService';
import {
  DAILY_FEEDBACK_COMMENT_MAX_LENGTH,
  DAILY_FEEDBACK_SCORE_LABEL_KEYS,
  DAILY_FEEDBACK_SCORE_MAX,
  DAILY_FEEDBACK_SCORE_MIN,
} from '@/features/patient/feedback/types/daily-feedback';
import { formatPersianNumber } from '@/utils/persian-format';
import { getErrorMessage } from '@/utils/get-error-message';

const { Text, Paragraph } = Typography;

interface DailyFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyFeedbackModal({ isOpen, onClose }: DailyFeedbackModalProps) {
  const { t } = useTranslation();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleClose = () => {
    setSelectedScore(null);
    setComment('');
    setSubmitError(null);
    setSuccessMessage(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (selectedScore === null) {
      setSubmitError(t('patient.feedback.errors.scoreRequired'));
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await patientDailyFeedbackService.submitFeedback({
        improvementScore: selectedScore,
        comment: comment.trim() || null,
      });

      setSuccessMessage(t('patient.feedback.success'));
      window.setTimeout(() => handleClose(), 1200);
    } catch (error) {
      setSubmitError(getErrorMessage(error, t('patient.feedback.errors.submitFailed')));
    } finally {
      setIsSubmitting(false);
    }
  };

  const scoreOptions = Array.from(
    { length: DAILY_FEEDBACK_SCORE_MAX - DAILY_FEEDBACK_SCORE_MIN + 1 },
    (_, index) => DAILY_FEEDBACK_SCORE_MIN + index,
  );

  const content = (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Paragraph>{t('patient.feedback.question')}</Paragraph>

      <Radio.Group
        value={selectedScore ?? undefined}
        onChange={(e) => {
          setSelectedScore(e.target.value as number);
          setSubmitError(null);
        }}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {scoreOptions.map((score) => {
            const labelKey = DAILY_FEEDBACK_SCORE_LABEL_KEYS[score - 1];
            return (
              <Radio.Button
                key={score}
                value={score}
                style={{ width: '100%', textAlign: 'center', height: 48, lineHeight: '48px' }}
              >
                {formatPersianNumber(score)} — {t(labelKey)}
              </Radio.Button>
            );
          })}
        </Space>
      </Radio.Group>

      <Form.Item label={t('patient.feedback.commentLabel')} style={{ marginBottom: 0 }}>
        <Input.TextArea
          value={comment}
          maxLength={DAILY_FEEDBACK_COMMENT_MAX_LENGTH}
          placeholder={t('patient.feedback.commentPlaceholder')}
          rows={4}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Item>
      <Text type="secondary">
        {t('patient.feedback.commentHint', {
          count: formatPersianNumber(DAILY_FEEDBACK_COMMENT_MAX_LENGTH - comment.length),
        })}
      </Text>

      {submitError ? <Alert type="error" message={submitError} showIcon /> : null}
      {successMessage ? <Alert type="success" message={successMessage} showIcon /> : null}

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {t('patient.feedback.skip')}
        </Button>
        <Button
          type="primary"
          loading={isSubmitting}
          disabled={selectedScore === null}
          onClick={() => void handleSubmit()}
        >
          {t('patient.feedback.submit')}
        </Button>
      </Space>
    </Space>
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
    >
      {content}
    </Modal>
  );
}
