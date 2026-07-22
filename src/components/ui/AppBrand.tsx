import { ZivanLogo } from './ZivanLogo';

interface AppBrandProps {
  /** Kept for call-site compatibility; brand is image-only. */
  collapsed?: boolean;
  showLogo?: boolean;
  size?: number;
}

/** Brand mark only — no wordmark typography. */
export function AppBrand({ showLogo = true, size = 36 }: AppBrandProps) {
  if (!showLogo) {
    return null;
  }

  return (
    <div className="app-sider__brand app-sider__brand--mark-only">
      <span className="app-sider__logo">
        <ZivanLogo size={size} />
      </span>
    </div>
  );
}
