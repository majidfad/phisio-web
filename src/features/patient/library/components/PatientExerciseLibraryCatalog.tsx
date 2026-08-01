import { AppEmpty, StatusCapsule } from '@/components/ui';
import { CirclePlay, Dumbbell, Filter } from 'lucide-react';
import { Card, Col, Row } from 'antd';
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
        <FilterChip
          label="همه"
          active={activeCategoryId === 'all'}
          onClick={() => setActiveCategoryId('all')}
        />
        {categories.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.title}
            active={activeCategoryId === cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <AppEmpty description={t('patient.library.empty')} />
      ) : (
        <Row gutter={[12, 12]}>
          {filtered.map((exercise) => {
            const hasDescription = Boolean(exercise.description?.trim());
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

            return (
              <Col key={exercise.exerciseId} xs={24} sm={12} lg={8}>
                <Card
                  style={{
                    borderRadius: 'var(--phisio-radius-md)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--phisio-surface)',
                    border: '1px solid var(--phisio-border)',
                    boxShadow: 'var(--phisio-shadow-sm)',
                  }}
                  styles={{ body: { padding: '12px' } }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '140px',
                      borderRadius: 'var(--phisio-radius-sm)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--phisio-bg-elevated)',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {thumbSrc ? (
                      <img
                        src={thumbSrc}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          color: 'var(--phisio-text-secondary)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Dumbbell size={28} opacity={0.45} />
                        <span style={{ fontSize: '11px', fontWeight: 600 }}>بدون پیش‌نمایش</span>
                      </div>
                    )}

                    {hasVideo ? (
                      <button
                        type="button"
                        onClick={() => setSelectedExercise(exercise)}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(15, 23, 42, 0.35)',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                        aria-label={t('patient.library.video.play', { title: exercise.title })}
                      >
                        <CirclePlay size={40} strokeWidth={1.75} />
                      </button>
                    ) : null}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <bdi
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--phisio-text)',
                        margin: 0,
                        unicodeBidi: 'plaintext',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'block',
                      }}
                    >
                      {exercise.title}
                    </bdi>
                    {hasDescription ? (
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: 'var(--phisio-text-secondary)',
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {exercise.description}
                      </p>
                    ) : null}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '6px',
                        gap: '8px',
                      }}
                    >
                      {categoryLabel ? (
                        <StatusCapsule status="info" label={categoryLabel} showDot={false} />
                      ) : (
                        <StatusCapsule status="info" label="تمرین" showDot={false} />
                      )}
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--phisio-text-secondary)',
                        }}
                      >
                        {t(`exerciseMeta.difficulty.${exercise.difficulty}`, {
                          defaultValue: String(exercise.difficulty),
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
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

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: 'var(--phisio-radius-sm)',
        fontSize: '12px',
        fontWeight: 600,
        border: '1px solid',
        borderColor: active ? 'var(--phisio-primary)' : 'var(--phisio-border)',
        backgroundColor: active ? 'var(--phisio-primary-soft)' : 'var(--phisio-surface)',
        color: active ? 'var(--phisio-primary)' : 'var(--phisio-text)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <bdi style={{ unicodeBidi: 'plaintext' }}>{label}</bdi>
    </button>
  );
}
