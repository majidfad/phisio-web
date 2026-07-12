import { App, ConfigProvider } from 'antd';
import faIR from 'antd/locale/fa_IR';
import enUS from 'antd/locale/en_US';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { getLanguageDirection } from '@/i18n/config';
import { phisioTheme } from '@/theme/phisio-theme';

interface AntdProviderProps {
  children: ReactNode;
}

export function AntdProvider({ children }: AntdProviderProps) {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(() =>
    getLanguageDirection(i18n.language),
  );

  useEffect(() => {
    const handleLanguageChange = (language: string) => {
      setDirection(getLanguageDirection(language));
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const locale = i18n.language === 'fa' ? faIR : enUS;

  return (
    <ConfigProvider theme={phisioTheme} direction={direction} locale={locale}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
