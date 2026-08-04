import { AppEmpty } from '@/components/ui';
import { Dumbbell, Filter, Play } from 'lucide-react';
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
        className="library-today__filters"
        role="toolbar"
        aria-label={t('patient.library.filterLabel')}
      >
        <span className="library-today__filter-label">
          <Filter size={13} aria-hidden />
          {t('patient.library.filterLabel')}
        </span>
        <button
          type="button"
          className={`kit-filter-chip${activeCategoryId === 'all' ? ' kit-filter-chip--active' : ''}`}
          onClick={() => setActiveCategoryId('all')}
        >
          {t('patient.library.filterAll')}
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
        <div className="library-today__list">
          <h2 className="library-today__section-title">{t('patient.library.listTitle')}</h2>

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

              const openVideo = () => {
                if (hasVideo) setSelectedExercise(exercise);
              };

              return (
                <div
                  key={exercise.exerciseId}
                  role={hasVideo ? 'button' : 'listitem'}
                  tabIndex={hasVideo ? 0 : undefined}
                  className={`exercise-row${hasVideo ? ' exercise-row--clickable' : ''}`}
                  onClick={hasVideo ? openVideo : undefined}
                  onKeyDown={
                    hasVideo
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openVideo();
                          }
                        }
                      : undefined
                  }
                  aria-label={
                    hasVideo
                      ? t('patient.library.video.play', { title: exercise.title })
                      : exercise.title
                  }
                >
                  <div className="exercise-row__thumb" aria-hidden="true">
                    {thumbSrc ? (
                      <img src={thumbSrc} alt="" />
                    ) : (
                      <span className="exercise-row__thumb-fallback">
                        <Dumbbell size={22} opacity={0.5} />
                      </span>
                    )}
                  </div>

                  <div className="exercise-row__body">
                    <bdi className="exercise-row__name">{exercise.title}</bdi>
                    {meta ? <span className="exercise-row__meta">{meta}</span> : null}
                  </div>

                  <div className="exercise-row__action" aria-hidden="true">
                    {hasVideo ? (
                      <span className="exercise-row__play">
                        <Play size={16} fill="currentColor" />
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
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
