import { Button, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Eye, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { denseIconProps } from '@/components/icons/app-icon';
import { AppEmpty, AppTable, StatusCapsule } from '@/components/ui';
import type { ClinicDto } from '@/features/clinics/types/clinic';
import { formatDisplayPhone, formatPersianDate } from '@/utils/persian-format';

interface ClinicsTableProps {
  clinics: ClinicDto[];
  showInactiveView: boolean;
  emptyDescription?: string;
  isDisabling?: boolean;
  disablingClinicId?: string | null;
  onView: (clinic: ClinicDto) => void;
  onEdit: (clinic: ClinicDto) => void;
  onDisable: (clinic: ClinicDto) => void;
}

export function ClinicsTable({
  clinics,
  showInactiveView,
  emptyDescription,
  isDisabling = false,
  disablingClinicId = null,
  onView,
  onEdit,
  onDisable,
}: ClinicsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<ClinicDto> = [
    {
      title: t('clinics.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name: string) => <bdi style={{ unicodeBidi: 'plaintext' }}>{name}</bdi>,
    },
    {
      title: t('clinics.columns.address'),
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: t('clinics.columns.phones'),
      dataIndex: 'phoneNumbers',
      key: 'phoneNumbers',
      width: 180,
      render: (phoneNumbers: string[]) =>
        phoneNumbers.length === 0 ? (
          t('clinics.notSet')
        ) : (
          <span dir="ltr">{phoneNumbers.map((phone) => formatDisplayPhone(phone)).join('، ')}</span>
        ),
    },
    {
      title: t('clinics.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (value: string) => formatPersianDate(value),
    },
    ...(showInactiveView
      ? [
          {
            title: t('clinics.columns.status'),
            key: 'status',
            width: 120,
            render: () => (
              <StatusCapsule
                status="cancelled"
                label={t('admin.common.status.inactive')}
                showDot={false}
              />
            ),
          } as ColumnsType<ClinicDto>[number],
        ]
      : []),
    {
      title: t('clinics.columns.actions'),
      key: 'actions',
      width: 170,
      align: 'center',
      render: (_, clinic) => (
        <Space size={0}>
          <Tooltip title={t('clinics.actions.view')}>
            <Button
              type="text"
              className="table-icon-actions__btn"
              icon={<Eye {...denseIconProps} />}
              aria-label={t('clinics.actions.view')}
              onClick={() => onView(clinic)}
            />
          </Tooltip>
          <Tooltip title={t('clinics.actions.edit')}>
            <Button
              type="text"
              className="table-icon-actions__btn table-icon-actions__btn--edit"
              icon={<Pencil {...denseIconProps} />}
              aria-label={t('clinics.actions.edit')}
              onClick={() => onEdit(clinic)}
            />
          </Tooltip>
          {showInactiveView ? null : (
            <Button
              type="link"
              danger
              size="small"
              loading={isDisabling && disablingClinicId === clinic.clinicId}
              onClick={() => onDisable(clinic)}
            >
              {t('clinics.actions.disable')}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (clinics.length === 0) {
    return (
      <AppEmpty
        description={
          emptyDescription ?? t(showInactiveView ? 'clinics.emptyInactive' : 'clinics.empty')
        }
      />
    );
  }

  return (
    <AppTable
      rowKey="clinicId"
      columns={columns}
      dataSource={clinics}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      size="middle"
    />
  );
}
