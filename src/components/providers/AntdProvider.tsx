import { App, ConfigProvider } from 'antd';
import faIR from 'antd/locale/fa_IR';
import enUS from 'antd/locale/en_US';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { AppEmpty } from '@/components/ui/AppEmpty';
import { getLanguageDirection } from '@/i18n/config';
import { createPhisioTheme } from '@/theme/phisio-theme';
import { useTheme } from '@/theme/use-theme';

interface AntdProviderProps {
  children: ReactNode;
}

export function AntdProvider({ children }: AntdProviderProps) {
  const { i18n } = useTranslation();
  const { mode } = useTheme();
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(() =>
    getLanguageDirection(i18n.language),
  );

  const antdTheme = useMemo(() => createPhisioTheme(mode), [mode]);

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
    <ConfigProvider
      theme={antdTheme}
      direction={direction}
      locale={locale}
      renderEmpty={() => <AppEmpty />}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
