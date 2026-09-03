import { useEffect } from 'react';

interface ExternalRedirectProps {
  to: string;
}

/** Full-page navigation to another origin (or absolute URL). */
export function ExternalRedirect({ to }: ExternalRedirectProps) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return <div className="route-loading" aria-busy="true" />;
}
