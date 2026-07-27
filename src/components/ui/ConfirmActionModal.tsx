import { Modal } from 'antd';
import type { ReactNode } from 'react';

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmText: string;
  cancelText: string;
  confirming?: boolean;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Shared confirmation modal for destructive / irreversible actions. */
export function ConfirmActionModal({
  open,
  title,
  message,
  confirmText,
  cancelText,
  confirming = false,
  danger = true,
  onCancel,
  onConfirm,
}: ConfirmActionModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText={confirmText}
      cancelText={cancelText}
      confirmLoading={confirming}
      okButtonProps={{ danger }}
      cancelButtonProps={{ disabled: confirming }}
      closable={!confirming}
      maskClosable={!confirming}
      centered
      destroyOnHidden
    >
      {message}
    </Modal>
  );
}
