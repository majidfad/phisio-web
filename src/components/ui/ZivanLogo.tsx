import { useTranslation } from 'react-i18next';

interface ZivanLogoProps {
  size?: number;
  className?: string;
}

/** Official Zivan mark — image only (no wordmark). */
export function ZivanLogo({ size = 24, className }: ZivanLogoProps) {
  const { t } = useTranslation();

  return (
    <img
      src="/brand/zivan-mark.png"
      alt={t('app.name')}
      width={size}
      height={size}
      className={className}
      draggable={false}
      decoding="async"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
