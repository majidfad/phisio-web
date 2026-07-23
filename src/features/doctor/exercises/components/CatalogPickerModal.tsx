import { AppEmpty, AppResult } from '@/components/ui';
import { Button, List, Modal, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { useDoctorExerciseCatalog } from '@/features/doctor/exercises/hooks/useDoctorExercises';
import { getErrorMessage } from '@/utils/get-error-message';

const { Text } = Typography;

interface CatalogPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: ExerciseDto) => void;
}

export function CatalogPickerModal({ open, onClose, onSelect }: CatalogPickerModalProps) {
  const { t } = useTranslation();
  const { data: exercises = [], isLoading, isError, error, refetch } = useDoctorExerciseCatalog(open);

  return (
    <Modal
      title={t('doctor.exercises.addFromCatalog.title')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnHidden
      centered
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin tip={t('doctor.exercises.loading')} />
        </div>
      ) : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('doctor.exercises.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('doctor.exercises.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && exercises.length === 0 ? (
        <AppEmpty description={t('doctor.exercises.addFromCatalog.empty')} />
      ) : null}

      {!isLoading && !isError && exercises.length > 0 ? (
        <List
          dataSource={exercises}
          renderItem={(exercise) => (
            <List.Item
              actions={[
                <Button
                  key="add"
                  type="link"
                  onClick={() => {
                    onSelect(exercise);
                    onClose();
                  }}
                >
                  {t('doctor.exercises.addFromCatalog.select')}
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={exercise.title}
                description={
                  <Text type="secondary" ellipsis>
                    {exercise.description || exercise.instructions || '—'}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      ) : null}
    </Modal>
  );
}
