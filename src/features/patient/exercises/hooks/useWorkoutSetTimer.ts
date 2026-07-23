import { useCallback, useEffect, useRef, useState } from 'react';

export type WorkoutPhase = 'work' | 'rest';

interface UseWorkoutSetTimerOptions {
  holdSeconds: number | null;
  restSeconds: number | null;
  totalSets: number;
  onExerciseComplete: () => void;
  enabled: boolean;
  resetKey: string | number;
}

function initialSeconds(holdSeconds: number | null): number | null {
  return holdSeconds && holdSeconds > 0 ? holdSeconds : null;
}

export function useWorkoutSetTimer({
  holdSeconds,
  restSeconds,
  totalSets,
  onExerciseComplete,
  enabled,
  resetKey,
}: UseWorkoutSetTimerOptions) {
  const [phase, setPhase] = useState<WorkoutPhase>('work');
  const [currentSet, setCurrentSet] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() => initialSeconds(holdSeconds));
  const [completionToken, setCompletionToken] = useState(0);
  const onCompleteRef = useRef(onExerciseComplete);

  const [trackedResetKey, setTrackedResetKey] = useState(resetKey);
  const [trackedHold, setTrackedHold] = useState(holdSeconds);
  const [trackedEnabled, setTrackedEnabled] = useState(enabled);

  if (trackedResetKey !== resetKey || trackedHold !== holdSeconds || trackedEnabled !== enabled) {
    setTrackedResetKey(resetKey);
    setTrackedHold(holdSeconds);
    setTrackedEnabled(enabled);
    setCompletionToken(0);
    setPhase('work');
    setCurrentSet(1);
    setSecondsLeft(initialSeconds(holdSeconds));
  }

  useEffect(() => {
    onCompleteRef.current = onExerciseComplete;
  }, [onExerciseComplete]);

  const hasHoldTimer = Boolean(holdSeconds && holdSeconds > 0);
  const hasRestTimer = Boolean(restSeconds && restSeconds > 0);

  const advanceAfterWork = useCallback(
    (setNumber: number) => {
      if (setNumber < totalSets && hasRestTimer && restSeconds) {
        setPhase('rest');
        setSecondsLeft(restSeconds);
        return;
      }

      if (setNumber < totalSets) {
        setCurrentSet(setNumber + 1);
        setPhase('work');
        setSecondsLeft(initialSeconds(holdSeconds));
        return;
      }

      if (completionToken > 0) {
        return;
      }

      setCompletionToken(1);
      setSecondsLeft(null);
      onCompleteRef.current();
    },
    [completionToken, hasRestTimer, holdSeconds, restSeconds, totalSets],
  );

  const advanceAfterRest = useCallback(() => {
    setCurrentSet((setNumber) => {
      const nextSet = setNumber + 1;
      setPhase('work');
      setSecondsLeft(initialSeconds(holdSeconds));
      return nextSet;
    });
  }, [holdSeconds]);

  useEffect(() => {
    if (!enabled || secondsLeft === null) {
      return;
    }

    if (secondsLeft > 0) {
      const id = window.setTimeout(() => {
        setSecondsLeft((value) => (value === null ? null : Math.max(value - 1, 0)));
      }, 1000);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      if (phase === 'work') {
        advanceAfterWork(currentSet);
        return;
      }
      advanceAfterRest();
    }, 0);

    return () => window.clearTimeout(id);
  }, [advanceAfterRest, advanceAfterWork, currentSet, enabled, phase, secondsLeft]);

  const completeSetManually = () => {
    if (phase === 'rest') {
      advanceAfterRest();
      return;
    }
    advanceAfterWork(currentSet);
  };

  const skipTimer = () => {
    setSecondsLeft(0);
  };

  return {
    phase,
    currentSet,
    totalSets,
    secondsLeft,
    hasHoldTimer,
    hasRestTimer,
    completeSetManually,
    skipTimer,
  };
}
