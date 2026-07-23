import { BookPlus, Search } from 'lucide-react';
import { Button, Input, Select } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { PageHeader } from '@/components/PageHeader';
import { LoadingState, PageContainer, AppEmpty, AppResult } from '@/components/ui';
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
  | { mode: 'add'; exercise: ExerciseDto }
  | { mode: 'edit'; exercise: DoctorExerciseDto }
  | null;

export function DoctorExercisesPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: exercises = [], isLoading, isError, error, refetch } = useDoctorExerciseLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [bodyRegion, setBodyRegion] = useState<number | undefined>();
  const [equipment, setEquipment] = useState<number | undefined>();
  const [difficulty, setDifficulty] = useState<number | undefined>();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [textsModal, setTextsModal] = useState<TextsModalState>(null);
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
    if (bodyRegion && exercise.bodyRegion !== bodyRegion) return false;
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
            videoUrl: exercise.videoUrl,
            mediaType: exercise.mediaType,
            bodyRegion: exercise.bodyRegion,
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
            videoUrl: exercise.videoUrl,
            mediaType: exercise.mediaType,
            bodyRegion: exercise.bodyRegion,
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

  return (
    <PageContainer>
      <PageHeader
        title={t('doctor.exercises.title')}
        description={t('doctor.exercises.description')}
        action={
          <Button
            type="primary"
            icon={<BookPlus {...appIconProps} />}
            onClick={() => setIsCatalogOpen(true)}
          >
            {t('doctor.exercises.addFromCatalog.action')}
          </Button>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <Input
          size="large"
          allowClear
          prefix={<Search {...appIconProps} />}
          placeholder={t('doctor.exercises.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: 480 }}
        />
        <Select
          allowClear
          placeholder={t('doctor.exercises.bodyRegion')}
          value={bodyRegion}
          onChange={setBodyRegion}
          options={Array.from({ length: 9 }, (_, index) => ({
            value: index + 1,
            label: t(`exerciseMeta.bodyRegion.${index + 1}`),
          }))}
          style={{ minWidth: 160 }}
        />
        <Select
          allowClear
          placeholder={t('doctor.exercises.equipment')}
          value={equipment}
          onChange={setEquipment}
          options={Array.from({ length: 6 }, (_, index) => ({
            value: index + 1,
            label: t(`exerciseMeta.equipment.${index + 1}`),
          }))}
          style={{ minWidth: 160 }}
        />
        <Select
          allowClear
          placeholder={t('doctor.exercises.difficulty')}
          value={difficulty}
          onChange={setDifficulty}
          options={Array.from({ length: 3 }, (_, index) => ({
            value: index + 1,
            label: t(`exerciseMeta.difficulty.${index + 1}`),
          }))}
          style={{ minWidth: 160 }}
        />
      </div>

      {isLoading ? <LoadingState tip={t('doctor.exercises.loading')} /> : null}

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

      {!isLoading && !isError && visibleExercises.length === 0 ? (
        <AppEmpty description={t('doctor.exercises.empty')} />
      ) : null}

      {!isLoading && !isError && visibleExercises.length > 0 ? (
        <DoctorExercisesCatalog
          exercises={visibleExercises}
          onEdit={(exercise) => setTextsModal({ mode: 'edit', exercise })}
          onArchive={(exercise) => void archiveExercise.mutateAsync(exercise.exerciseId)}
        />
      ) : null}

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
    </PageContainer>
  );
}
