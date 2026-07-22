import { Moon, Sun } from 'lucide-react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { useTheme } from '@/theme/use-theme';

export function ThemeToggleButton() {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === 'dark';
  const label = isDark ? t('layout.switchToLight') : t('layout.switchToDark');

  return (
    <Button
      type="text"
      icon={isDark ? <Moon {...appIconProps} /> : <Sun {...appIconProps} />}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    />
  );
}
