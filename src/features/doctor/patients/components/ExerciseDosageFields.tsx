import { Button, Form, Input, InputNumber, Select, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import type { AssignPatientExerciseItem } from '@/features/doctor/patients/types/patient-exercise-plan';
import {
  applyDosagePreset,
  type DosagePresetId,
} from '@/features/doctor/patients/utils/dosage-presets';
import { ExerciseSide, type ExerciseSide as ExerciseSideType } from '@/features/exercises/types';

interface ExerciseDosageFieldsProps {
  exercises: ExerciseDto[];
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {exercises.map((exercise) => {
        const value = values[exercise.exerciseId] ?? {
          exerciseId: exercise.exerciseId,
          sets: 3,
          reps: '10',
          side: ExerciseSide.None,
        };
        const update = (patch: Partial<AssignPatientExerciseItem>) =>
          onChange(exercise.exerciseId, { ...value, ...patch });

        return (
          <section
            key={exercise.exerciseId}
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid var(--phisio-border)',
              background: 'var(--phisio-bg-elevated, #fff)',
            }}
          >
            <strong style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>
              {exercise.title}
            </strong>

            {copiedFromLastIds?.has(exercise.exerciseId) ? (
              <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                {t(`${dosageKey}.copiedFromLast`)}
              </Typography.Text>
            ) : null}

            <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
              {PRESET_IDS.map((presetId) => (
                <Button
                  key={presetId}
                  size="small"
                  onClick={() => onChange(exercise.exerciseId, applyDosagePreset(value, presetId))}
                >
                  {t(`${dosageKey}.presets.${presetId}`)}
                </Button>
              ))}
            </Space>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 12,
              }}
            >
              <Form.Item label={t(`${dosageKey}.sets`)} style={{ marginBottom: 0 }}>
                <InputNumber
                  min={1}
                  value={value.sets}
                  onChange={(sets) => update({ sets: sets ?? undefined })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label={t(`${dosageKey}.reps`)} style={{ marginBottom: 0 }}>
                <Input
                  value={value.reps}
                  onChange={(event) => update({ reps: event.target.value })}
                  placeholder="10"
                />
              </Form.Item>
              <Form.Item label={t(`${dosageKey}.hold`)} style={{ marginBottom: 0 }}>
                <InputNumber
                  min={0}
                  value={value.holdSeconds}
                  onChange={(holdSeconds) => update({ holdSeconds: holdSeconds ?? undefined })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label={t(`${dosageKey}.rest`)} style={{ marginBottom: 0 }}>
                <InputNumber
                  min={0}
                  value={value.restSeconds}
                  onChange={(restSeconds) => update({ restSeconds: restSeconds ?? undefined })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label={t(`${dosageKey}.side`)} style={{ marginBottom: 0 }}>
                <Select
                  value={value.side}
                  onChange={(side: ExerciseSideType) => update({ side })}
                  options={[0, 1, 2, 3].map((side) => ({
                    value: side,
                    label: t(`exerciseMeta.side.${side}`),
                  }))}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              <Form.Item label={t(`${dosageKey}.patientCue`)} style={{ marginBottom: 0 }}>
                <Input
                  value={value.patientCue}
                  onChange={(event) => update({ patientCue: event.target.value })}
                  placeholder={t(`${dosageKey}.patientCue`)}
                />
              </Form.Item>
              <Form.Item label={t(`${dosageKey}.clinicianNote`)} style={{ marginBottom: 0 }}>
                <Input.TextArea
                  value={value.clinicianNote}
                  onChange={(event) => update({ clinicianNote: event.target.value })}
                  placeholder={t(`${dosageKey}.clinicianNote`)}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              </Form.Item>
            </div>
          </section>
        );
      })}
    </div>
  );
}
