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
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const completingRef = useRef(false);

  const onCompleteRef = useRef(onExerciseComplete);
  onCompleteRef.current = onExerciseComplete;

  const hasHoldTimer = Boolean(holdSeconds && holdSeconds > 0);
  const hasRestTimer = Boolean(restSeconds && restSeconds > 0);

  useEffect(() => {
    completingRef.current = false;
    setPhase('work');
    setCurrentSet(1);
    setSecondsLeft(holdSeconds && holdSeconds > 0 ? holdSeconds : null);
  }, [resetKey, holdSeconds, enabled]);

  useEffect(() => {
    if (!enabled || secondsLeft === null || secondsLeft <= 0) {
      return;
    }

    const id = window.setTimeout(() => {
      setSecondsLeft((value) => (value === null ? null : Math.max(value - 1, 0)));
    }, 1000);

    return () => window.clearTimeout(id);
  }, [enabled, secondsLeft]);

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
        setSecondsLeft(hasHoldTimer && holdSeconds ? holdSeconds : null);
        return;
      }

      if (completingRef.current) {
        return;
      }
      completingRef.current = true;
      setSecondsLeft(null);
      onCompleteRef.current();
    },
    [hasHoldTimer, hasRestTimer, holdSeconds, restSeconds, totalSets],
  );

  const advanceAfterRest = useCallback(() => {
    setCurrentSet((setNumber) => {
      const nextSet = setNumber + 1;
      setPhase('work');
      setSecondsLeft(hasHoldTimer && holdSeconds ? holdSeconds : null);
      return nextSet;
    });
  }, [hasHoldTimer, holdSeconds]);

  useEffect(() => {
    if (!enabled || secondsLeft !== 0) {
      return;
    }

    if (phase === 'work') {
      advanceAfterWork(currentSet);
      return;
    }

    advanceAfterRest();
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
