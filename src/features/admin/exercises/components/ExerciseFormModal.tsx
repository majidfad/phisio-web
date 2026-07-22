import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Form, Input, Modal, Select, Space, Tabs } from 'antd';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  createExerciseFormSchema,
  type ExerciseFormSchemaValues,
} from '@/features/admin/exercises/schemas/exercise-form-schema';
import {
  exerciseBodyRegionOptions,
  exerciseDifficultyOptions,
  exerciseEquipmentOptions,
  ExerciseMediaType,
} from '@/features/exercises/types';

interface ExerciseFormModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  initialValues?: Partial<ExerciseFormSchemaValues>;
  showClinicShare?: boolean;
  onClose: () => void;
  onSubmit: (values: ExerciseFormSchemaValues) => Promise<void>;
}

export function ExerciseFormModal({
  isOpen,
  isSubmitting,
  initialValues,
  showClinicShare = false,
  onClose,
  onSubmit,
}: ExerciseFormModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createExerciseFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExerciseFormSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      bodyRegion: 5,
      equipment: 1,
      difficulty: 1,
      mediaMode: 'upload',
      mediaType: ExerciseMediaType.UploadedVideo,
      videoUrl: '',
      video: undefined,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      title: '',
      description: '',
      instructions: '',
      bodyRegion: 5,
      equipment: 1,
      difficulty: 1,
      mediaMode:
        initialValues?.mediaType === ExerciseMediaType.Gif
          ? 'gif'
          : initialValues?.videoUrl
            ? 'url'
            : 'upload',
      mediaType: initialValues?.mediaType ?? ExerciseMediaType.UploadedVideo,
      videoUrl: initialValues?.videoUrl ?? '',
      video: undefined,
      ...initialValues,
    });
  }, [initialValues, isOpen, reset]);

  return (
    <Modal
      title={
        initialValues ? t('admin.exercises.form.editTitle') : t('admin.exercises.form.createTitle')
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form
        layout="vertical"
        onFinish={() =>
          void handleSubmit(async (values) => {
            await onSubmit(values);
          })()
        }
      >
        <Form.Item
          label={t('admin.exercises.form.name')}
          validateStatus={errors.title ? 'error' : undefined}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} autoComplete="off" />}
          />
        </Form.Item>
        <Form.Item label={t('admin.exercises.form.description')}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={2} />}
          />
        </Form.Item>
        <Form.Item label={t('admin.exercises.form.instructions')}>
          <Controller
            name="instructions"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={3} />}
          />
        </Form.Item>
        <Space size="middle" style={{ display: 'flex' }}>
          <Form.Item label={t('admin.exercises.form.bodyRegion')} style={{ flex: 1 }}>
            <Controller
              name="bodyRegion"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={exerciseBodyRegionOptions.map((value) => ({
                    value,
                    label: t(`exerciseMeta.bodyRegion.${value}`),
                  }))}
                />
              )}
            />
          </Form.Item>
          <Form.Item label={t('admin.exercises.form.equipment')} style={{ flex: 1 }}>
            <Controller
              name="equipment"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={exerciseEquipmentOptions.map((value) => ({
                    value,
                    label: t(`exerciseMeta.equipment.${value}`),
                  }))}
                />
              )}
            />
          </Form.Item>
          <Form.Item label={t('admin.exercises.form.difficulty')} style={{ flex: 1 }}>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={exerciseDifficultyOptions.map((value) => ({
                    value,
                    label: t(`exerciseMeta.difficulty.${value}`),
                  }))}
                />
              )}
            />
          </Form.Item>
        </Space>

        <Form.Item
          label={t('admin.exercises.form.video')}
          validateStatus={errors.video ? 'error' : undefined}
          help={errors.video?.message as string | undefined}
        >
          <Controller
            name="mediaMode"
            control={control}
            render={({ field }) => (
              <Tabs
                activeKey={field.value}
                onChange={(mediaMode) => {
                  field.onChange(mediaMode);
                  setValue(
                    'mediaType',
                    mediaMode === 'upload'
                      ? ExerciseMediaType.UploadedVideo
                      : mediaMode === 'gif'
                        ? ExerciseMediaType.Gif
                        : ExerciseMediaType.ExternalVideo,
                  );
                }}
                items={[
                  {
                    key: 'upload',
                    label: t('admin.exercises.form.mediaUpload'),
                    children: (
                      <Controller
                        name="video"
                        control={control}
                        render={({ field: fileField }) => (
                          <input
                            type="file"
                            accept="video/mp4,image/gif,.mp4,.gif"
                            onChange={(e) => fileField.onChange(e.target.files)}
                          />
                        )}
                      />
                    ),
                  },
                  {
                    key: 'url',
                    label: t('admin.exercises.form.mediaUrl'),
                    children: (
                      <Controller
                        name="videoUrl"
                        control={control}
                        render={({ field: urlField }) => (
                          <Input
                            {...urlField}
                            placeholder="https://youtube.com/watch?v=…"
                            onChange={(event) => {
                              const videoUrl = event.target.value;
                              urlField.onChange(videoUrl);
                              setValue(
                                'mediaType',
                                /(^|\/\/)(www\.)?(youtube\.com|youtu\.be)\//i.test(videoUrl)
                                  ? ExerciseMediaType.Youtube
                                  : ExerciseMediaType.ExternalVideo,
                              );
                            }}
                          />
                        )}
                      />
                    ),
                  },
                  {
                    key: 'gif',
                    label: t('admin.exercises.form.mediaGif'),
                    children: (
                      <Controller
                        name="videoUrl"
                        control={control}
                        render={({ field: urlField }) => (
                          <Input {...urlField} placeholder="https://example.com/exercise.gif" />
                        )}
                      />
                    ),
                  },
                ]}
              />
            )}
          />
        </Form.Item>
        {showClinicShare ? (
          <Form.Item>
            <Controller
              name="isClinicShared"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={Boolean(field.value)}
                  onChange={(event) => field.onChange(event.target.checked)}
                >
                  {t('doctor.exercises.shareClinic')}
                </Checkbox>
              )}
            />
          </Form.Item>
        ) : null}

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} disabled={isSubmitting}>
              {t('admin.exercises.form.cancel')}
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isSubmitting
                ? t('admin.exercises.form.saving')
                : initialValues
                  ? t('admin.exercises.form.update')
                  : t('admin.exercises.form.create')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
