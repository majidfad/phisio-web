import { Alert, Button, Input, Modal, Space, Typography } from 'antd';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { denseIconProps } from '@/components/icons/app-icon';
import { useToast } from '@/hooks/useToast';

const { Text, Paragraph } = Typography;

interface AdminGeneratedPasswordModalProps {
  open: boolean;
  password: string | null;
  userName?: string;
  onClose: () => void;
}

export function AdminGeneratedPasswordModal({
  open,
  password,
  userName,
  onClose,
}: AdminGeneratedPasswordModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!password) {
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success(t('admin.password.copied'));
    } catch {
      toast.error(t('admin.password.copyFailed'));
    }
  };

  return (
    <Modal
      title={t('admin.password.generatedTitle')}
      open={open}
      onCancel={onClose}
      afterClose={() => setCopied(false)}
      footer={
        <Button type="primary" onClick={onClose}>
          {t('admin.password.close')}
        </Button>
      }
      destroyOnHidden
      centered
    >
      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
        message={t('admin.password.generatedWarning')}
      />

      {userName ? (
        <Paragraph type="secondary" style={{ marginBottom: 8 }}>
          {t('admin.password.forUser', { name: userName })}
        </Paragraph>
      ) : null}

      <Space.Compact style={{ width: '100%' }}>
        <Input value={password ?? ''} readOnly dir="ltr" />
        <Button
          icon={<Copy {...denseIconProps} />}
          onClick={() => void handleCopy()}
          aria-label={t('admin.password.copy')}
        >
          {copied ? t('admin.password.copied') : t('admin.password.copy')}
        </Button>
      </Space.Compact>

      <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
        {t('admin.password.generatedHint')}
      </Text>
    </Modal>
  );
}
