import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

interface DeleteDoctorDialogProps {
  isOpen: boolean;
  doctorName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteDoctorDialog({
  isOpen,
  doctorName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteDoctorDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('admin.doctors.delete.title')}
      open={isOpen}
      onCancel={onClose}
      onOk={onConfirm}
      okText={isDeleting ? t('admin.doctors.delete.deleting') : t('admin.doctors.delete.confirm')}
      cancelText={t('admin.doctors.delete.cancel')}
      okButtonProps={{ danger: true, loading: isDeleting }}
      cancelButtonProps={{ disabled: isDeleting }}
      closable={!isDeleting}
      maskClosable={!isDeleting}
    >
      {t('admin.doctors.delete.message', { name: doctorName })}
    </Modal>
  );
}
