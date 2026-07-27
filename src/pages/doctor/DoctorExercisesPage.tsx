import { BookPlus, Search } from 'lucide-react';
import { Button, Input, Select } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { PageHeader } from '@/components/PageHeader';
import {
  ConfirmActionModal,
  LoadingState,
  PageContainer,
  AppResult,
  WarmEmptyState,
} from '@/components/ui';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { CatalogPickerModal } from '@/features/doctor/exercises/components/CatalogPickerModal';
import { DoctorExerciseTextsModal } from '@/features/doctor/exercises/components/DoctorExerciseTextsModal';
import { DoctorExercisesCatalog } from '@/features/doctor/exercises/components/DoctorExercisesCatalog';
import {
  useArchiveDoctorExercise,
  useDoctorExerciseLibrary,
  useSaveDoctorExercise,
} from '@/features/doctor/exercises/hooks/useDoctorExercises';
import type { DoctorExerciseDto } from '@/features/doctor/exercises/types/doctor-exercise';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

type TextsModalState =
  { mode: 'add'; exercise: ExerciseDto } | { mode: 'edit'; exercise: DoctorExerciseDto } | null;

export function DoctorExercisesPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: exercises = [], isLoading, isError, error, refetch } = useDoctorExerciseLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [equipment, setEquipment] = useState<number | undefined>();
  const [difficulty, setDifficulty] = useState<number | undefined>();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [textsModal, setTextsModal] = useState<TextsModalState>(null);
  const [exerciseToArchive, setExerciseToArchive] = useState<DoctorExerciseDto | null>(null);
  const saveExercise = useSaveDoctorExercise();
  const archiveExercise = useArchiveDoctorExercise();

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return exercises;
    }

    return exercises.filter(
      (exercise) =>
        exercise.title.toLowerCase().includes(query) ||
        exercise.description?.toLowerCase().includes(query),
    );
  }, [exercises, searchQuery]);
  const visibleExercises = filteredExercises.filter((exercise) => {
    if (equipment && exercise.equipment !== equipment) return false;
    if (difficulty && exercise.difficulty !== difficulty) return false;
    return true;
  });

  const handleSaveTexts = async (values: { description: string; instructions: string }) => {
    if (!textsModal) {
      return;
    }

    if (!values.description || !values.instructions) {
      toast.error(t('doctor.exercises.addToLibrary.validationRequired'));
      return;
    }

    const { exercise, mode } = textsModal;

    try {
      if (mode === 'add') {
        await saveExercise.mutateAsync({
          request: {
            title: exercise.title,
            description: values.description,
            instructions: values.instructions,
            videoUrl: exercise.videoUrl ?? null,
            mediaType: exercise.mediaType,
            equipment: exercise.equipment,
            difficulty: exercise.difficulty,
          },
        });
        toast.success(t('doctor.exercises.addToLibrary.success'));
      } else {
        await saveExercise.mutateAsync({
          id: exercise.exerciseId,
          request: {
            title: exercise.title,
            description: values.description,
            instructions: values.instructions,
            videoUrl: exercise.videoUrl ?? null,
            mediaType: exercise.mediaType,
            equipment: exercise.equipment,
            difficulty: exercise.difficulty,
          },
        });
        toast.success(t('doctor.exercises.editTexts.success'));
      }
      setTextsModal(null);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('doctor.exercises.errors.saveFailed')));
    }
  };

  const handleArchiveConfirm = async () => {
    if (!exerciseToArchive) {
      return;
    }

    try {
      await archiveExercise.mutateAsync(exerciseToArchive.exerciseId);
      setExerciseToArchive(null);
    } catch {
      // Keep dialog open
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('doctor.exercises.title')}
        description={t('doctor.exercises.description')}
        action={
          <Button
            type="primary"
            size="large"
            icon={<BookPlus {...appIconProps} />}
            onClick={() => setIsCatalogOpen(true)}
          >
            {t('doctor.exercises.addFromCatalog.action')}
          </Button>
        }
      />

      <div className="patient-stack patient-stack--loose">
        <div className="patient-filter-bar">
          <Input
            size="large"
            allowClear
            prefix={<Search {...appIconProps} />}
            placeholder={t('doctor.exercises.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            allowClear
            size="large"
            placeholder={t('doctor.exercises.equipment')}
            value={equipment}
            onChange={setEquipment}
            options={Array.from({ length: 6 }, (_, index) => ({
              value: index + 1,
              label: t(`exerciseMeta.equipment.${index + 1}`),
            }))}
          />
          <Select
            allowClear
            size="large"
            placeholder={t('doctor.exercises.difficulty')}
            value={difficulty}
            onChange={setDifficulty}
            options={Array.from({ length: 3 }, (_, index) => ({
              value: index + 1,
              label: t(`exerciseMeta.difficulty.${index + 1}`),
            }))}
          />
        </div>

        {isLoading ? <LoadingState tip={t('doctor.exercises.loading')} /> : null}

        {isError ? (
          <AppResult
            status="error"
            title={getErrorMessage(error, t('doctor.exercises.errors.loadFailed'))}
            extra={
              <Button type="primary" size="large" onClick={() => void refetch()}>
                {t('doctor.exercises.retry')}
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && visibleExercises.length === 0 ? (
          <WarmEmptyState description={t('doctor.exercises.empty')} />
        ) : null}

        {!isLoading && !isError && visibleExercises.length > 0 ? (
          <DoctorExercisesCatalog
            exercises={visibleExercises}
            onEdit={(exercise) => setTextsModal({ mode: 'edit', exercise })}
            onArchive={setExerciseToArchive}
          />
        ) : null}
      </div>

      <CatalogPickerModal
        open={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelect={(exercise) => setTextsModal({ mode: 'add', exercise })}
      />

      <DoctorExerciseTextsModal
        exercise={textsModal?.exercise ?? null}
        mode={textsModal?.mode ?? 'add'}
        isSubmitting={saveExercise.isPending}
        onClose={() => setTextsModal(null)}
        onSubmit={handleSaveTexts}
      />

      <ConfirmActionModal
        open={exerciseToArchive !== null}
        title={t('doctor.exercises.archive.title')}
        message={t('doctor.exercises.archive.message', {
          title: exerciseToArchive?.title ?? '',
        })}
        confirmText={t('doctor.exercises.archive.confirm')}
        cancelText={t('doctor.exercises.archive.cancel')}
        confirming={archiveExercise.isPending}
        onCancel={() => setExerciseToArchive(null)}
        onConfirm={() => void handleArchiveConfirm()}
      />
    </PageContainer>
  );
}
