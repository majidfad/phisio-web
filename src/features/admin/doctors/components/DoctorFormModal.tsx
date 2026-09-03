import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Checkbox, Form, Input, Modal, Select, Space, Spin, Typography } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { denseIconProps } from '@/components/icons/app-icon';
import { AdminPasswordFormFields } from '@/features/admin/password/components/AdminPasswordFormFields';
import { EMPTY_ADMIN_PASSWORD_FIELDS } from '@/features/admin/password/schemas/admin-password-schema';
import {
  createDoctorEditFormSchema,
  createDoctorFormSchema,
  createNewClinicStepSchema,
  toClinicPhonePayload,
  type DoctorEditFormSchemaValues,
  type DoctorFormSchemaValues,
} from '@/features/admin/doctors/schemas/doctor-form-schema';
import type { DoctorDto } from '@/features/admin/doctors/types/doctor';
import { clinicService } from '@/features/clinics/services/clinicService';
import type { ClinicDto } from '@/features/clinics/types/clinic';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatDisplayPhone } from '@/utils/persian-format';

const { Text, Title } = Typography;

const EMPTY_PHONE = { value: '' };

type CreateStep = 'doctor' | 'existingClinic' | 'newClinic';

export type DoctorFormSubmitValues = DoctorFormSchemaValues | DoctorEditFormSchemaValues;

function getDoctorFormDefaultValues(doctor?: DoctorDto | null): DoctorFormSchemaValues {
  return {
    name: doctor?.name ?? '',
    phoneNumber: doctor?.phoneNumber ?? '',
    email: doctor?.email ?? '',
    specialty: doctor?.specialty ?? '',
    medicalLicenseNumber: doctor?.medicalLicenseNumber ?? '',
    clinicAddress: doctor?.clinicAddress ?? '',
    clinicPhoneNumbers: [EMPTY_PHONE],
    newClinicName: '',
    newClinicAddress: '',
    managerIsThisDoctor: true,
    clinicManagerId: '',
    ...EMPTY_ADMIN_PASSWORD_FIELDS,
  };
}

interface DoctorFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  doctor?: DoctorDto | null;
  /** Existing doctors for clinic-manager selection when creating a new clinic. */
  managerCandidates?: Pick<DoctorDto, 'id' | 'name'>[];
  isLoadingManagers?: boolean;
  isManagersError?: boolean;
  onRetryManagers?: () => void;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: DoctorFormSubmitValues) => Promise<void>;
}

export function DoctorFormModal(props: DoctorFormModalProps) {
  const { t } = useTranslation();
  const { isOpen, onClose, mode, doctor } = props;
  const title =
    mode === 'create' ? t('admin.doctors.form.createTitle') : t('admin.doctors.form.editTitle');

  return (
    <Modal title={title} open={isOpen} onCancel={onClose} footer={null} destroyOnHidden centered>
      {isOpen ? <DoctorFormModalBody key={`${mode}:${doctor?.id ?? 'new'}`} {...props} /> : null}
    </Modal>
  );
}

function DoctorFormModalBody({
  mode,
  doctor,
  managerCandidates = [],
  isLoadingManagers = false,
  isManagersError = false,
  onRetryManagers,
  isSubmitting,
  onClose,
  onSubmit,
}: DoctorFormModalProps) {
  const { t } = useTranslation();
  const [createStep, setCreateStep] = useState<CreateStep>('doctor');
  const [foundClinic, setFoundClinic] = useState<ClinicDto | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const createSchema = useMemo(() => createDoctorFormSchema(t), [t]);
  const editSchema = useMemo(() => createDoctorEditFormSchema(t), [t]);
  const newClinicSchema = useMemo(() => createNewClinicStepSchema(t), [t]);

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<DoctorFormSchemaValues>({
    // Edit uses a narrower schema; cast keeps a single form values type for create+edit.
    resolver: zodResolver(mode === 'create' ? createSchema : editSchema) as never,
    defaultValues: getDoctorFormDefaultValues(doctor),
  });

  const passwordMode = useWatch({ control, name: 'passwordMode' });
  const managerIsThisDoctor = useWatch({ control, name: 'managerIsThisDoctor' });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'clinicPhoneNumbers',
  });

  const handleLookupAndContinue = async () => {
    setLookupError(null);
    clearErrors();

    const valid = await trigger([
      'name',
      'phoneNumber',
      'email',
      'specialty',
      'medicalLicenseNumber',
      'clinicPhoneNumbers',
      'passwordMode',
      'password',
      'confirmPassword',
    ]);

    if (!valid) {
      return;
    }

    const phoneNumbers = toClinicPhonePayload(getValues('clinicPhoneNumbers'));
    setIsLookingUp(true);

    try {
      const lookup = await clinicService.lookupByPhones(phoneNumbers);

      if (lookup.status === 'Conflict') {
        setLookupError(t('admin.doctors.clinic.phoneConflict'));
        return;
      }

      if (lookup.status === 'Found' && lookup.clinic) {
        setFoundClinic(lookup.clinic);
        setCreateStep('existingClinic');
        return;
      }

      setFoundClinic(null);
      setCreateStep('newClinic');
    } catch (error) {
      setLookupError(getErrorMessage(error, t('admin.doctors.clinic.lookupFailed')));
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleCreateWithExistingClinic = async () => {
    if (!foundClinic) {
      return;
    }

    setValue('clinicAddress', foundClinic.address);
    await handleSubmit(async (values) => {
      await onSubmit({
        ...values,
        clinicAddress: foundClinic.address,
      });
    })();
  };

  const handleCreateWithNewClinic = async () => {
    clearErrors();
    const values = getValues();
    const stepResult = newClinicSchema.safeParse({
      newClinicName: values.newClinicName,
      newClinicAddress: values.newClinicAddress,
      clinicPhoneNumbers: values.clinicPhoneNumbers,
      managerIsThisDoctor: values.managerIsThisDoctor,
      clinicManagerId: values.clinicManagerId,
    });

    if (!stepResult.success) {
      for (const issue of stepResult.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          setError(field as keyof DoctorFormSchemaValues, { message: issue.message });
        }
      }
      return;
    }

    const clinicAddress = values.newClinicAddress.trim();
    setValue('clinicAddress', clinicAddress);
    await handleSubmit(async (formValues) => {
      await onSubmit({
        ...formValues,
        clinicAddress,
      });
    })();
  };

  const handleEditSubmit = async () => {
    await handleSubmit(async (values) => {
      const editValues: DoctorEditFormSchemaValues = {
        name: values.name,
        phoneNumber: values.phoneNumber,
        email: values.email,
        specialty: values.specialty,
        medicalLicenseNumber: values.medicalLicenseNumber,
        clinicAddress: values.clinicAddress,
      };
      await onSubmit(editValues);
    })();
  };

  const renderDoctorFields = (options?: { includeClinicAddress?: boolean }) => (
    <>
      <Form.Item
        label={t('admin.doctors.form.name')}
        validateStatus={errors.name ? 'error' : undefined}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} autoComplete="name" />}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.doctors.form.phone')}
        validateStatus={errors.phoneNumber ? 'error' : undefined}
        help={errors.phoneNumber?.message}
      >
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder={t('auth.phonePlaceholder')}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={
          <>
            {t('admin.doctors.form.email')}{' '}
            <Text type="secondary">({t('admin.doctors.form.optional')})</Text>
          </>
        }
        validateStatus={errors.email ? 'error' : undefined}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input {...field} type="email" autoComplete="email" />}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.doctors.form.specialty')}
        validateStatus={errors.specialty ? 'error' : undefined}
        help={errors.specialty?.message}
      >
        <Controller
          name="specialty"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.doctors.form.license')}
        validateStatus={errors.medicalLicenseNumber ? 'error' : undefined}
        help={errors.medicalLicenseNumber?.message}
      >
        <Controller
          name="medicalLicenseNumber"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      {options?.includeClinicAddress ? (
        <Form.Item
          label={t('admin.doctors.form.address')}
          validateStatus={errors.clinicAddress ? 'error' : undefined}
          help={errors.clinicAddress?.message}
        >
          <Controller
            name="clinicAddress"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={3} />}
          />
        </Form.Item>
      ) : null}
    </>
  );

  const renderClinicPhoneFields = () => (
    <Form.Item
      label={t('admin.doctors.clinic.phones')}
      validateStatus={errors.clinicPhoneNumbers ? 'error' : undefined}
      help={
        typeof errors.clinicPhoneNumbers?.message === 'string'
          ? errors.clinicPhoneNumbers.message
          : undefined
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        {fields.map((item, index) => (
          <Space.Compact key={item.id} style={{ width: '100%' }}>
            <Form.Item
              validateStatus={errors.clinicPhoneNumbers?.[index]?.value ? 'error' : undefined}
              help={errors.clinicPhoneNumbers?.[index]?.value?.message}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Controller
                name={`clinicPhoneNumbers.${index}.value`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    inputMode="tel"
                    placeholder={t('auth.phonePlaceholder')}
                  />
                )}
              />
            </Form.Item>
            <Button
              icon={<Trash2 {...denseIconProps} />}
              aria-label={t('admin.doctors.clinic.removePhone')}
              disabled={fields.length <= 1}
              onClick={() => remove(index)}
            />
          </Space.Compact>
        ))}
        <Button
          type="dashed"
          icon={<Plus {...denseIconProps} />}
          onClick={() => append({ value: '' })}
        >
          {t('admin.doctors.clinic.addPhone')}
        </Button>
      </Space>
    </Form.Item>
  );

  return (
    <Form layout="vertical">
      {mode === 'edit' ? (
        <>
          {renderDoctorFields({ includeClinicAddress: true })}
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={onClose}>{t('admin.doctors.form.cancel')}</Button>
              <Button type="primary" loading={isSubmitting} onClick={() => void handleEditSubmit()}>
                {isSubmitting ? t('admin.doctors.form.saving') : t('admin.doctors.form.save')}
              </Button>
            </Space>
          </Form.Item>
        </>
      ) : null}

      {mode === 'create' && createStep === 'doctor' ? (
        <>
          {renderDoctorFields()}
          <Title level={5} style={{ marginTop: 8 }}>
            {t('admin.doctors.clinic.sectionTitle')}
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            {t('admin.doctors.clinic.phoneStepHint')}
          </Text>
          {renderClinicPhoneFields()}
          <AdminPasswordFormFields
            control={control as never}
            errors={errors}
            passwordMode={passwordMode ?? 'generate'}
          />
          {lookupError ? (
            <Alert type="error" showIcon style={{ marginBottom: 16 }} message={lookupError} />
          ) : null}
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={onClose}>{t('admin.doctors.form.cancel')}</Button>
              <Button
                type="primary"
                loading={isLookingUp}
                onClick={() => void handleLookupAndContinue()}
              >
                {isLookingUp
                  ? t('admin.doctors.clinic.searching')
                  : t('admin.doctors.clinic.continue')}
              </Button>
            </Space>
          </Form.Item>
        </>
      ) : null}

      {mode === 'create' && createStep === 'existingClinic' && foundClinic ? (
        <>
          <Alert
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
            message={t('admin.doctors.clinic.foundTitle')}
            description={
              <Space direction="vertical" size={4}>
                <Text strong>{foundClinic.name}</Text>
                <Text>
                  {t('admin.doctors.clinic.address')}: {foundClinic.address}
                </Text>
                <Text dir="ltr">
                  {t('admin.doctors.clinic.phones')}:{' '}
                  {foundClinic.phoneNumbers.map((phone) => formatDisplayPhone(phone)).join('، ')}
                </Text>
                <Text type="secondary">{t('admin.doctors.clinic.foundHint')}</Text>
              </Space>
            }
          />
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCreateStep('doctor')}>
                {t('admin.doctors.clinic.back')}
              </Button>
              <Button
                type="primary"
                loading={isSubmitting}
                onClick={() => void handleCreateWithExistingClinic()}
              >
                {isSubmitting ? t('admin.doctors.form.saving') : t('admin.doctors.form.create')}
              </Button>
            </Space>
          </Form.Item>
        </>
      ) : null}

      {mode === 'create' && createStep === 'newClinic' ? (
        <>
          <Title level={5}>{t('admin.doctors.clinic.createStepTitle')}</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            {t('admin.doctors.clinic.createStepHint')}
          </Text>

          <Form.Item
            label={t('admin.doctors.clinic.name')}
            validateStatus={errors.newClinicName ? 'error' : undefined}
            help={errors.newClinicName?.message}
          >
            <Controller
              name="newClinicName"
              control={control}
              render={({ field }) => <Input {...field} autoComplete="organization" />}
            />
          </Form.Item>

          <Form.Item
            label={t('admin.doctors.clinic.address')}
            validateStatus={errors.newClinicAddress ? 'error' : undefined}
            help={errors.newClinicAddress?.message}
          >
            <Controller
              name="newClinicAddress"
              control={control}
              render={({ field }) => <Input.TextArea {...field} rows={3} />}
            />
          </Form.Item>

          {renderClinicPhoneFields()}

          <Form.Item>
            <Controller
              name="managerIsThisDoctor"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                >
                  {t('admin.doctors.clinic.managerIsThisDoctor')}
                </Checkbox>
              )}
            />
          </Form.Item>

          {!managerIsThisDoctor ? (
            <Form.Item
              label={t('admin.doctors.clinic.clinicManager')}
              validateStatus={errors.clinicManagerId ? 'error' : undefined}
              help={errors.clinicManagerId?.message}
            >
              <Controller
                name="clinicManagerId"
                control={control}
                render={({ field }) => (
                  <Select
                    allowClear
                    showSearch
                    loading={isLoadingManagers}
                    disabled={isManagersError}
                    placeholder={t('admin.doctors.clinic.clinicManagerPlaceholder')}
                    optionFilterProp="label"
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(value ?? '')}
                    onBlur={field.onBlur}
                    notFoundContent={
                      isLoadingManagers ? (
                        <Spin size="small" />
                      ) : (
                        t('admin.doctors.clinic.clinicManagerEmpty')
                      )
                    }
                    options={managerCandidates.map((candidate) => ({
                      value: candidate.id,
                      label: candidate.name,
                    }))}
                  />
                )}
              />
              {isManagersError ? (
                <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
                  <Text type="danger">{t('admin.doctors.clinic.clinicManagerLoadFailed')}</Text>
                  {onRetryManagers ? (
                    <Button size="small" onClick={onRetryManagers}>
                      {t('admin.doctors.retry')}
                    </Button>
                  ) : null}
                </Space>
              ) : null}
            </Form.Item>
          ) : null}

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCreateStep('doctor')}>
                {t('admin.doctors.clinic.back')}
              </Button>
              <Button
                type="primary"
                loading={isSubmitting}
                onClick={() => void handleCreateWithNewClinic()}
              >
                {isSubmitting ? t('admin.doctors.form.saving') : t('admin.doctors.form.create')}
              </Button>
            </Space>
          </Form.Item>
        </>
      ) : null}
    </Form>
  );
}
