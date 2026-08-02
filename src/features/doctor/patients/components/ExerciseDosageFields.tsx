import { Button, Form, Input } from 'antd';
import { Dumbbell, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { TactileSlider } from '@/components/ui/TactileSlider';
import type { DoctorExerciseDto } from '@/features/doctor/exercises/types/doctor-exercise';
import type { AssignPatientExerciseItem } from '@/features/doctor/patients/types/patient-exercise-plan';
import {
  applyDosagePreset,
  type DosagePresetId,
} from '@/features/doctor/patients/utils/dosage-presets';

interface ExerciseDosageFieldsProps {
  exercises: DoctorExerciseDto[];
  values: Record<string, AssignPatientExerciseItem>;
  copiedFromLastIds?: ReadonlySet<string>;
  onChange: (exerciseId: string, value: AssignPatientExerciseItem) => void;
}

const dosageKey = 'doctor.patients.exercisePlan.dosage';

const PRESET_IDS: DosagePresetId[] = ['strength', 'stretch', 'activation'];

export function ExerciseDosageFields({
  exercises,
  values,
  copiedFromLastIds,
  onChange,
}: ExerciseDosageFieldsProps) {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {exercises.map((exercise) => {
        const value = values[exercise.exerciseId] ?? {
          exerciseId: exercise.exerciseId,
          sets: 3,
          reps: '10',
        };
        const update = (patch: Partial<AssignPatientExerciseItem>) =>
          onChange(exercise.exerciseId, { ...value, ...patch });

        return (
          <section
            key={exercise.exerciseId}
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--phisio-radius-md)',
              border: '1px solid var(--phisio-border)',
              background: 'var(--phisio-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <div
                  style={{
                    padding: '7px',
                    borderRadius: 'var(--phisio-radius-sm)',
                    backgroundColor: 'var(--phisio-primary-soft)',
                    color: 'var(--phisio-primary)',
                    flexShrink: 0,
                  }}
                >
                  <Dumbbell size={16} />
                </div>
                <bdi
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--phisio-text)',
                    unicodeBidi: 'plaintext',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {exercise.title}
                </bdi>
              </div>
              {copiedFromLastIds?.has(exercise.exerciseId) ? (
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--phisio-teal)',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  از نسخه قبلی
                </span>
              ) : null}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--phisio-text-secondary)',
                }}
              >
                پیش‌فرض:
              </span>
              {PRESET_IDS.map((presetId) => (
                <Button
                  key={presetId}
                  size="small"
                  icon={<Sparkles size={11} />}
                  style={{
                    borderRadius: 'var(--phisio-radius-sm)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                  onClick={() => onChange(exercise.exerciseId, applyDosagePreset(value, presetId))}
                >
                  {t(`${dosageKey}.presets.${presetId}`)}
                </Button>
              ))}
            </div>

            <TactileSlider
              label="تعداد ست"
              value={value.sets ?? 3}
              min={1}
              max={10}
              unit="ست"
              onChange={(sets) => update({ sets })}
            />

            <Form.Item label={t(`${dosageKey}.reps`)} style={{ marginBottom: 0 }}>
              <Input
                value={value.reps}
                onChange={(event) => update({ reps: event.target.value })}
                placeholder="10"
              />
            </Form.Item>
          </section>
        );
      })}
    </div>
  );
}
