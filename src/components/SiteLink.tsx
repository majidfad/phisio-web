import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { appUrl, isCrossOriginHref, landingUrl } from '@/constants/site';

type SiteLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

function resolveHref(to: string, site: 'app' | 'landing'): string {
  return site === 'app' ? appUrl(to) : landingUrl(to);
}

/**
 * Same-origin → React Router `Link`. Cross-origin (landing ↔ app) → plain `<a>`.
 */
function SiteLink({
  to,
  site,
  children,
  className,
  ...rest
}: SiteLinkProps & { site: 'app' | 'landing' }) {
  const href = resolveHref(to, site);

  if (isCrossOriginHref(href)) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

/** Link into the authenticated app (login, register, panels). */
export function AppLink(props: SiteLinkProps) {
  return <SiteLink {...props} site="app" />;
}

/** Link into the marketing site. */
export function LandingLink(props: SiteLinkProps) {
  return <SiteLink {...props} site="landing" />;
}
