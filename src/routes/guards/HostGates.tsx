import { Outlet, useLocation } from 'react-router-dom';

import { appUrl, getSiteMode, landingUrl } from '@/constants/site';
import { ExternalRedirect } from '@/routes/guards/ExternalRedirect';

function currentPathWithSearch(location: { pathname: string; search: string; hash: string }) {
  return `${location.pathname}${location.search}${location.hash}`;
}

/** Marketing routes — on app.zivan.me, bounce to zivan.me. */
export function RequireLandingHost() {
  const location = useLocation();
  if (getSiteMode() === 'app') {
    return <ExternalRedirect to={landingUrl(currentPathWithSearch(location))} />;
  }
  return <Outlet />;
}

/** Auth + panel routes — on zivan.me, bounce to app.zivan.me. */
export function RequireAppHost() {
  const location = useLocation();
  if (getSiteMode() === 'landing') {
    return <ExternalRedirect to={appUrl(currentPathWithSearch(location))} />;
  }
  return <Outlet />;
}
