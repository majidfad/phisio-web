import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Checkbox, Form, Input, Typography } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { denseIconProps } from '@/components/icons/app-icon';
import { lookupClinicsByPhonesApi, registerApi } from '@/features/auth/api/auth-api';
import {
  createRegisterNewClinicStepSchema,
  createRegisterSchema,
  toRegisterClinicPhonePayload,
  type RegisterFormValues,
  type RegistrationRole,
} from '@/features/auth/schemas/register-schema';
import type { ClinicDto } from '@/features/clinics/types/clinic';
import { useToast } from '@/hooks/useToast';
import { routes } from '@/routes/routes';
import { UserRoleCode } from '@/types/auth';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatDisplayPhone } from '@/utils/persian-format';

const { Text, Title } = Typography;

const EMPTY_PHONE = { value: '' };

type DoctorRegisterStep = 'doctor' | 'existingClinic' | 'newClinic';

interface RegisterFormProps {
  role: RegistrationRole;
  onBack: () => void;
}

export function RegisterForm({ role, onBack }: RegisterFormProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const isDoctor = role === 'doctor';
  const registerSchema = useMemo(() => createRegisterSchema(t, role), [t, role]);
  const newClinicSchema = useMemo(() => createRegisterNewClinicStepSchema(t), [t]);

  const [doctorStep, setDoctorStep] = useState<DoctorRegisterStep>('doctor');
  const [foundClinic, setFoundClinic] = useState<ClinicDto | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      medicalLicenseNumber: '',
      specialty: '',
      clinicPhoneNumbers: [EMPTY_PHONE],
      newClinicName: '',
      newClinicAddress: '',
      managerIsThisDoctor: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'clinicPhoneNumbers',
  });

  useEffect(() => {
    setDoctorStep('doctor');
    setFoundClinic(null);
    setLookupError(null);
    setIsLookingUp(false);
  }, [role]);

  const submitRegistration = async (values: RegisterFormValues) => {
    const clinicPhoneNumbers = isDoctor
      ? toRegisterClinicPhonePayload(values.clinicPhoneNumbers ?? [])
      : undefined;
    const newClinicName = values.newClinicName?.trim() ?? '';
    const newClinicAddress = values.newClinicAddress?.trim() ?? '';

    await registerApi({
      name: values.name.trim(),
      phoneNumber: values.phoneNumber.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
      role: isDoctor ? UserRoleCode.Doctor : UserRoleCode.Patient,
      ...(isDoctor
        ? {
            medicalLicenseNumber: values.medicalLicenseNumber?.trim(),
            specialty: values.specialty?.trim(),
            clinicPhoneNumbers,
            newClinicName: newClinicName.length > 0 ? newClinicName : null,
            newClinicAddress: newClinicAddress.length > 0 ? newClinicAddress : null,
            managerIsThisDoctor: values.managerIsThisDoctor ?? true,
          }
        : {}),
    });

    navigate(routes.login, {
      replace: true,
      state: { registrationSuccess: true, registeredRole: role },
    });
  };

  const handleLookupAndContinue = async () => {
    setLookupError(null);
    clearErrors();

    const valid = await trigger([
      'name',
      'phoneNumber',
      'password',
      'confirmPassword',
      'medicalLicenseNumber',
      'specialty',
      'clinicPhoneNumbers',
    ]);

    if (!valid) {
      return;
    }

    const phoneNumbers = toRegisterClinicPhonePayload(getValues('clinicPhoneNumbers') ?? []);
    setIsLookingUp(true);

    try {
      const lookup = await lookupClinicsByPhonesApi(phoneNumbers);

      if (lookup.status === 'Conflict') {
        setLookupError(t('auth.clinic.phoneConflict'));
        return;
      }

      if (lookup.status === 'Found' && lookup.clinic) {
        setFoundClinic(lookup.clinic);
        setDoctorStep('existingClinic');
        return;
      }

      setFoundClinic(null);
      setDoctorStep('newClinic');
    } catch (error) {
      setLookupError(getErrorMessage(error, t('auth.clinic.lookupFailed')));
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleRegisterWithNewClinic = async () => {
    clearErrors();
    const values = getValues();
    const stepResult = newClinicSchema.safeParse({
      newClinicName: values.newClinicName,
      newClinicAddress: values.newClinicAddress,
      clinicPhoneNumbers: values.clinicPhoneNumbers,
      managerIsThisDoctor: values.managerIsThisDoctor,
    });

    if (!stepResult.success) {
      for (const issue of stepResult.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          setError(field as keyof RegisterFormValues, { message: issue.message });
        }
      }
      return;
    }

    try {
      await submitRegistration(values);
    } catch (error) {
      toast.error(getErrorMessage(error, t('auth.unableToRegister')));
    }
  };

  const onPatientSubmit = handleSubmit(async (values) => {
    try {
      await submitRegistration(values);
    } catch (error) {
      toast.error(getErrorMessage(error, t('auth.unableToRegister')));
    }
  });

  const renderDoctorFields = () => (
    <>
      <Form.Item
        label={t('auth.fullName')}
        validateStatus={errors.name ? 'error' : undefined}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} autoComplete="name" size="large" />}
        />
      </Form.Item>

      <Form.Item
        label={t('auth.mobileNumber')}
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
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('auth.password')}
        validateStatus={errors.password ? 'error' : undefined}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} autoComplete="new-password" size="large" />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('auth.confirmPassword')}
        validateStatus={errors.confirmPassword ? 'error' : undefined}
        help={errors.confirmPassword?.message}
      >
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} autoComplete="new-password" size="large" />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('auth.medicalLicenseNumber')}
        validateStatus={errors.medicalLicenseNumber ? 'error' : undefined}
        help={errors.medicalLicenseNumber?.message}
      >
        <Controller
          name="medicalLicenseNumber"
          control={control}
          render={({ field }) => <Input {...field} dir="ltr" size="large" />}
        />
      </Form.Item>

      <Form.Item
        label={t('auth.specialty')}
        validateStatus={errors.specialty ? 'error' : undefined}
        help={errors.specialty?.message}
      >
        <Controller
          name="specialty"
          control={control}
          render={({ field }) => <Input {...field} size="large" />}
        />
      </Form.Item>
    </>
  );

  const renderClinicPhoneFields = () => (
    <Form.Item
      label={t('auth.clinic.phones')}
      validateStatus={errors.clinicPhoneNumbers ? 'error' : undefined}
      help={
        typeof errors.clinicPhoneNumbers?.message === 'string'
          ? errors.clinicPhoneNumbers.message
          : undefined
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {fields.map((item, index) => (
          <div key={item.id} style={{ display: 'flex', gap: 8 }}>
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
                    size="large"
                  />
                )}
              />
            </Form.Item>
            <Button
              icon={<Trash2 {...denseIconProps} />}
              aria-label={t('auth.clinic.removePhone')}
              disabled={fields.length <= 1}
              onClick={() => remove(index)}
            />
          </div>
        ))}
        <Button
          type="dashed"
          icon={<Plus {...denseIconProps} />}
          onClick={() => append({ value: '' })}
          block
        >
          {t('auth.clinic.addPhone')}
        </Button>
      </div>
    </Form.Item>
  );

  if (!isDoctor) {
    return (
      <form onSubmit={onPatientSubmit} noValidate className="auth-form">
        <div className="auth-form__header">
          <h1 className="auth-form__title">{t('auth.registerPatientTitle')}</h1>
        </div>

        <Form layout="vertical" component={false} className="auth-form__fields">
          <Form.Item
            label={t('auth.fullName')}
            validateStatus={errors.name ? 'error' : undefined}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} autoComplete="name" size="large" />}
            />
          </Form.Item>

          <Form.Item
            label={t('auth.mobileNumber')}
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
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t('auth.password')}
            validateStatus={errors.password ? 'error' : undefined}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} autoComplete="new-password" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t('auth.confirmPassword')}
            validateStatus={errors.confirmPassword ? 'error' : undefined}
            help={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} autoComplete="new-password" size="large" />
              )}
            />
          </Form.Item>
        </Form>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={isSubmitting}
          className="auth-form__submit"
        >
          {isSubmitting ? t('auth.registering') : t('auth.registerButton')}
        </Button>

        <Button type="text" block size="large" style={{ marginTop: 8 }} onClick={onBack}>
          {t('auth.backToRoleSelect')}
        </Button>

        <div className="auth-form__footer">
          <Text type="secondary">{t('auth.haveAccountPrompt')} </Text>
          <Link to={routes.login}>{t('auth.signInLink')}</Link>
        </div>
      </form>
    );
  }

  return (
    <div className="auth-form">
      <div className="auth-form__header">
        <h1 className="auth-form__title">{t('auth.registerDoctorTitle')}</h1>
      </div>

      <Form layout="vertical" component={false} className="auth-form__fields">
        {doctorStep === 'doctor' ? (
          <>
            {renderDoctorFields()}
            <Title level={5} style={{ marginTop: 8 }}>
              {t('auth.clinic.sectionTitle')}
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
              {t('auth.clinic.phoneStepHint')}
            </Text>
            {renderClinicPhoneFields()}
            {lookupError ? (
              <Alert type="error" showIcon style={{ marginBottom: 16 }} message={lookupError} />
            ) : null}
            <Button
              type="primary"
              block
              size="large"
              loading={isLookingUp}
              className="auth-form__submit"
              onClick={() => void handleLookupAndContinue()}
            >
              {isLookingUp ? t('auth.clinic.searching') : t('auth.clinic.continue')}
            </Button>
          </>
        ) : null}

        {doctorStep === 'existingClinic' && foundClinic ? (
          <>
            <Alert
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
              message={t('auth.clinic.foundTitle')}
              description={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Text strong>{foundClinic.name}</Text>
                  <Text>
                    {t('auth.clinic.address')}: {foundClinic.address}
                  </Text>
                  <Text dir="ltr">
                    {t('auth.clinic.phones')}:{' '}
                    {foundClinic.phoneNumbers.map((phone) => formatDisplayPhone(phone)).join('، ')}
                  </Text>
                  <Text type="secondary">{t('auth.clinic.foundHint')}</Text>
                </div>
              }
            />
            <Button
              type="primary"
              block
              size="large"
              loading={isSubmitting}
              className="auth-form__submit"
              onClick={() =>
                void handleSubmit(async (values) => {
                  try {
                    await submitRegistration(values);
                  } catch (error) {
                    toast.error(getErrorMessage(error, t('auth.unableToRegister')));
                  }
                })()
              }
            >
              {isSubmitting ? t('auth.registering') : t('auth.registerButton')}
            </Button>
            <Button
              block
              size="large"
              style={{ marginTop: 8 }}
              onClick={() => setDoctorStep('doctor')}
            >
              {t('auth.clinic.back')}
            </Button>
          </>
        ) : null}

        {doctorStep === 'newClinic' ? (
          <>
            <Title level={5}>{t('auth.clinic.createStepTitle')}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
              {t('auth.clinic.createStepHint')}
            </Text>

            <Form.Item
              label={t('auth.clinic.name')}
              validateStatus={errors.newClinicName ? 'error' : undefined}
              help={errors.newClinicName?.message}
            >
              <Controller
                name="newClinicName"
                control={control}
                render={({ field }) => (
                  <Input {...field} autoComplete="organization" size="large" />
                )}
              />
            </Form.Item>

            <Form.Item
              label={t('auth.clinic.address')}
              validateStatus={errors.newClinicAddress ? 'error' : undefined}
              help={errors.newClinicAddress?.message}
            >
              <Controller
                name="newClinicAddress"
                control={control}
                render={({ field }) => <Input.TextArea {...field} rows={3} size="large" />}
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
                    {t('auth.clinic.managerIsThisDoctor')}
                  </Checkbox>
                )}
              />
            </Form.Item>

            <Button
              type="primary"
              block
              size="large"
              loading={isSubmitting}
              className="auth-form__submit"
              onClick={() => void handleRegisterWithNewClinic()}
            >
              {isSubmitting ? t('auth.registering') : t('auth.registerButton')}
            </Button>
            <Button
              block
              size="large"
              style={{ marginTop: 8 }}
              onClick={() => setDoctorStep('doctor')}
            >
              {t('auth.clinic.back')}
            </Button>
          </>
        ) : null}
      </Form>

      {doctorStep === 'doctor' ? (
        <Button type="text" block size="large" style={{ marginTop: 8 }} onClick={onBack}>
          {t('auth.backToRoleSelect')}
        </Button>
      ) : null}

      <div className="auth-form__footer">
        <Text type="secondary">{t('auth.haveAccountPrompt')} </Text>
        <Link to={routes.login}>{t('auth.signInLink')}</Link>
      </div>
    </div>
  );
}
