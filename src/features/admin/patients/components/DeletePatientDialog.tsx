import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

interface DeletePatientDialogProps {
  isOpen: boolean;
  patientName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeletePatientDialog({
  isOpen,
  patientName,
  isDeleting,
  onClose,
  onConfirm,
}: DeletePatientDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('admin.patients.delete.title')}
      open={isOpen}
      onCancel={onClose}
      onOk={onConfirm}
      okText={isDeleting ? t('admin.patients.delete.deleting') : t('admin.patients.delete.confirm')}
      cancelText={t('admin.patients.delete.cancel')}
      okButtonProps={{ danger: true, loading: isDeleting }}
      cancelButtonProps={{ disabled: isDeleting }}
      closable={!isDeleting}
      maskClosable={!isDeleting}
    >
      {t('admin.patients.delete.message', { name: patientName })}
    </Modal>
  );
}
