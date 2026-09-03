import { Button, Drawer, Form, Grid, Input, Modal, Radio, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSubmitVisitFeedback } from '@/features/visits/hooks/usePatientVisits';
import {
  VISIT_FEEDBACK_COMMENT_MAX_LENGTH,
  VISIT_FEEDBACK_SCORE_MAX,
  VISIT_FEEDBACK_SCORE_MIN,
  type PatientVisitDto,
} from '@/features/visits/types/patient-visit';
import { useToast } from '@/hooks/useToast';
import { formatPersianDate, formatPersianNumber } from '@/utils/persian-format';
import { getErrorMessage } from '@/utils/get-error-message';

const { Text, Paragraph } = Typography;

interface VisitFeedbackModalProps {
  visit: PatientVisitDto | null;
  onClose: () => void;
}

export function VisitFeedbackModal({ visit, onClose }: VisitFeedbackModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const submitFeedback = useSubmitVisitFeedback();

  const [satisfactionScore, setSatisfactionScore] = useState<number | null>(null);
  const [communicationScore, setCommunicationScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [wasOpen, setWasOpen] = useState(Boolean(visit));

  const isOpen = Boolean(visit);

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setSatisfactionScore(null);
      setCommunicationScore(null);
      setComment('');
    }
  }

  const scoreOptions = Array.from(
    { length: VISIT_FEEDBACK_SCORE_MAX - VISIT_FEEDBACK_SCORE_MIN + 1 },
    (_, index) => VISIT_FEEDBACK_SCORE_MIN + index,
  );

  const handleSubmit = async () => {
    if (!visit || satisfactionScore === null || communicationScore === null) {
      toast.error(t('patient.visits.feedback.errors.scoresRequired'));
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        visitId: visit.visitId,
        request: {
          satisfactionScore,
          doctorCommunicationScore: communicationScore,
          comment: comment.trim() || null,
        },
      });
      toast.success(t('patient.visits.feedback.success'));
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, t('patient.visits.feedback.errors.submitFailed')));
    }
  };

  const content = (
    <div className="patient-stack patient-stack--loose">
      {visit ? (
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {t('patient.visits.feedback.visitSummary', {
            doctor: visit.doctorName,
            date: formatPersianDate(visit.visitAt),
          })}
        </Paragraph>
      ) : null}

      <div>
        <Paragraph strong style={{ marginBottom: 8 }}>
          {t('patient.visits.feedback.satisfactionQuestion')}
        </Paragraph>
        <Radio.Group
          value={satisfactionScore ?? undefined}
          onChange={(e) => setSatisfactionScore(e.target.value as number)}
          className="feedback-score-stack"
        >
          {scoreOptions.map((score) => (
            <Radio.Button key={`sat-${score}`} value={score} className="feedback-score-option">
              {formatPersianNumber(score)} —{' '}
              {t(`patient.visits.feedback.satisfactionLabels.${score}`)}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <div>
        <Paragraph strong style={{ marginBottom: 8 }}>
          {t('patient.visits.feedback.communicationQuestion')}
        </Paragraph>
        <Radio.Group
          value={communicationScore ?? undefined}
          onChange={(e) => setCommunicationScore(e.target.value as number)}
          className="feedback-score-stack"
        >
          {scoreOptions.map((score) => (
            <Radio.Button key={`com-${score}`} value={score} className="feedback-score-option">
              {formatPersianNumber(score)} —{' '}
              {t(`patient.visits.feedback.communicationLabels.${score}`)}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <Form.Item label={t('patient.visits.feedback.commentLabel')} style={{ marginBottom: 0 }}>
        <Input.TextArea
          value={comment}
          maxLength={VISIT_FEEDBACK_COMMENT_MAX_LENGTH}
          placeholder={t('patient.visits.feedback.commentPlaceholder')}
          rows={3}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Item>
      <Text type="secondary">
        {t('patient.visits.feedback.commentHint', {
          count: formatPersianNumber(VISIT_FEEDBACK_COMMENT_MAX_LENGTH - comment.length),
        })}
      </Text>

      <div className="patient-media-card__actions" style={{ justifyContent: 'flex-end' }}>
        <Button size="large" onClick={onClose} disabled={submitFeedback.isPending}>
          {t('patient.visits.feedback.cancel')}
        </Button>
        <Button
          type="primary"
          size="large"
          loading={submitFeedback.isPending}
          disabled={satisfactionScore === null || communicationScore === null}
          onClick={() => void handleSubmit()}
        >
          {t('patient.visits.feedback.submit')}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        title={t('patient.visits.feedback.title')}
        open={isOpen}
        onClose={onClose}
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
      title={t('patient.visits.feedback.title')}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      destroyOnHidden
    >
      {content}
    </Modal>
  );
}
