import { AppEmpty } from '@/components/ui';
import { Dumbbell, Filter, Play } from 'lucide-react';
import { Button } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';

interface PatientExerciseLibraryCatalogProps {
  exercises: ExerciseDto[];
}

export function PatientExerciseLibraryCatalog({ exercises }: PatientExerciseLibraryCatalogProps) {
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDto | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const exercise of exercises) {
      for (const category of exercise.categories ?? []) {
        if (category.exerciseCategoryId) {
          const label = category.nameFa || category.nameEn;
          if (label) map.set(category.exerciseCategoryId, label);
        }
      }
    }
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [exercises]);

  const filtered = useMemo(() => {
    if (activeCategoryId === 'all') return exercises;
    return exercises.filter((exercise) =>
      (exercise.categories ?? []).some((c) => c.exerciseCategoryId === activeCategoryId),
    );
  }, [exercises, activeCategoryId]);

  if (exercises.length === 0) {
    return <AppEmpty description={t('patient.library.empty')} />;
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          marginBottom: '14px',
        }}
      >
        <div
          style={{
            padding: '6px 10px',
            borderRadius: 'var(--phisio-radius-sm)',
            backgroundColor: 'var(--phisio-bg-elevated)',
            color: 'var(--phisio-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          <Filter size={13} />
          <span>فیلتر</span>
        </div>
        <button
          type="button"
          className={`kit-filter-chip${activeCategoryId === 'all' ? ' kit-filter-chip--active' : ''}`}
          onClick={() => setActiveCategoryId('all')}
        >
          همه
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`kit-filter-chip${activeCategoryId === cat.id ? ' kit-filter-chip--active' : ''}`}
            onClick={() => setActiveCategoryId(cat.id)}
          >
            <bdi style={{ unicodeBidi: 'plaintext' }}>{cat.title}</bdi>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <AppEmpty description={t('patient.library.empty')} />
      ) : (
        <div className="exercise-list" role="list">
          {filtered.map((exercise) => {
            const preview = getVideoPreviewSource(exercise.videoUrl, exercise.mediaType);
            const hasVideo = Boolean(preview);
            const youtubeId =
              preview?.kind === 'iframe' && preview.src.includes('/embed/')
                ? (preview.src.split('/embed/')[1]?.split(/[?/]/)[0] ?? null)
                : null;
            const thumbSrc =
              preview?.kind === 'image'
                ? preview.src
                : youtubeId
                  ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                  : null;
            const categoryLabel =
              exercise.categories?.[0]?.nameFa || exercise.categories?.[0]?.nameEn;
            const difficulty = t(`exerciseMeta.difficulty.${exercise.difficulty}`, {
              defaultValue: String(exercise.difficulty),
            });
            const meta = [categoryLabel, difficulty].filter(Boolean).join(' · ');

            return (
              <div key={exercise.exerciseId} role="listitem" className="exercise-row">
                <button
                  type="button"
                  className="exercise-row__thumb"
                  disabled={!hasVideo}
                  onClick={() => hasVideo && setSelectedExercise(exercise)}
                  aria-label={
                    hasVideo
                      ? t('patient.library.video.play', { title: exercise.title })
                      : exercise.title
                  }
                >
                  {thumbSrc ? (
                    <img src={thumbSrc} alt="" />
                  ) : (
                    <span
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--phisio-text-secondary)',
                        background: 'var(--phisio-bg-elevated)',
                      }}
                    >
                      <Dumbbell size={22} opacity={0.5} />
                    </span>
                  )}
                </button>

                <div className="exercise-row__body">
                  <bdi className="exercise-row__name">{exercise.title}</bdi>
                  {meta ? <span className="exercise-row__meta">{meta}</span> : null}
                </div>

                <div className="exercise-row__action">
                  {hasVideo ? (
                    <Button
                      type="primary"
                      shape="circle"
                      className="exercise-row__play"
                      icon={<Play size={16} fill="currentColor" />}
                      onClick={() => setSelectedExercise(exercise)}
                      aria-label={t('patient.library.video.play', { title: exercise.title })}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ExerciseVideoModal
        title={selectedExercise?.title ?? null}
        videoUrl={selectedExercise?.videoUrl}
        mediaType={selectedExercise?.mediaType}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}
