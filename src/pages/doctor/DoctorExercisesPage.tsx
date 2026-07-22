import { Plus, Search } from 'lucide-react';
import { Button, Input, Select, Tabs } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { PageHeader } from '@/components/PageHeader';
import { LoadingState, PageContainer, AppEmpty, AppResult } from '@/components/ui';
import { DoctorExercisesCatalog } from '@/features/doctor/exercises/components/DoctorExercisesCatalog';
import { ExerciseFormModal } from '@/features/admin/exercises/components/ExerciseFormModal';
import type { ExerciseFormSchemaValues } from '@/features/admin/exercises/schemas/exercise-form-schema';
import {
  useArchiveDoctorExercise,
  useDoctorExercises,
  useSaveDoctorExercise,
} from '@/features/doctor/exercises/hooks/useDoctorExercises';
import type {
  DoctorExerciseDto,
  DoctorExerciseScope,
} from '@/features/doctor/exercises/types/doctor-exercise';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

export function DoctorExercisesPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [scope, setScope] = useState<DoctorExerciseScope>('all');
  const { data: exercises = [], isLoading, isError, error, refetch } = useDoctorExercises(scope);
  const [searchQuery, setSearchQuery] = useState('');
  const [bodyRegion, setBodyRegion] = useState<number | undefined>();
  const [equipment, setEquipment] = useState<number | undefined>();
  const [difficulty, setDifficulty] = useState<number | undefined>();
  const [editingExercise, setEditingExercise] = useState<DoctorExerciseDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const handleSubmit = async (values: ExerciseFormSchemaValues) => {
    try {
      await saveExercise.mutateAsync({
        id: editingExercise?.exerciseId,
        videoFile: values.video?.[0],
        request: {
          title: values.title.trim(),
          description: values.description.trim(),
          instructions: values.instructions.trim(),
          videoUrl: values.videoUrl || null,
          mediaType: values.mediaType,
          bodyRegion: values.bodyRegion,
          equipment: values.equipment,
          difficulty: values.difficulty,
          isClinicShared: Boolean(values.isClinicShared),
        },
      });
      setIsFormOpen(false);
      setEditingExercise(null);
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
            icon={<Plus {...appIconProps} />}
            onClick={() => setIsFormOpen(true)}
          >
            {t('doctor.exercises.create')}
          </Button>
        }
      />
      <Tabs
        activeKey={scope}
        onChange={(value) => setScope(value as DoctorExerciseScope)}
        items={['all', 'mine', 'clinic'].map((value) => ({
          key: value,
          label: t(`doctor.exercises.scopes.${value}`),
        }))}
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
          onEdit={(exercise) => {
            setEditingExercise(exercise);
            setIsFormOpen(true);
          }}
          onArchive={(exercise) => void archiveExercise.mutateAsync(exercise.exerciseId)}
        />
      ) : null}
      <ExerciseFormModal
        isOpen={isFormOpen}
        isSubmitting={saveExercise.isPending}
        initialValues={
          editingExercise
            ? {
                ...editingExercise,
                description: editingExercise.description ?? '',
                instructions: editingExercise.instructions ?? '',
                videoUrl: editingExercise.videoUrl ?? '',
              }
            : undefined
        }
        showClinicShare
        onClose={() => {
          setIsFormOpen(false);
          setEditingExercise(null);
        }}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
