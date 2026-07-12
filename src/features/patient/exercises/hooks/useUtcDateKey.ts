import { useEffect, useState } from 'react';

import { getUtcDateKey } from '@/features/patient/exercises/utils/get-utc-date-key';

/**
 * Tracks the current UTC calendar date so exercise queries refetch when the day changes.
 * No persisted checkbox state — completion for "today" always comes from the API.
 */
export function useUtcDateKey(): string {
  const [dateKey, setDateKey] = useState(() => getUtcDateKey());

  useEffect(() => {
    const syncDateKey = () => {
      const nextDateKey = getUtcDateKey();
      setDateKey((current) => (current === nextDateKey ? current : nextDateKey));
    };

    syncDateKey();
    const intervalId = window.setInterval(syncDateKey, 60_000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncDateKey();
      }
    };

    window.addEventListener('focus', syncDateKey);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', syncDateKey);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return dateKey;
}
