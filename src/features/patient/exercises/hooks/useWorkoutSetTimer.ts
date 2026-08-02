import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

export type WorkoutPhase = 'work' | 'idle';

interface UseWorkoutSetTimerOptions {
  totalSets: number;
  onExerciseComplete: () => Promise<boolean>;
  /** Kept for caller compatibility; set progression no longer depends on this flag. */
  enabled: boolean;
  resetKey: string | number;
}

interface TimerState {
  phase: WorkoutPhase;
  currentSet: number;
  completionToken: number;
}

type TimerAction =
  { type: 'RESET' } | { type: 'COMPLETE_SET'; totalSets: number } | { type: 'COMPLETION_FAILED' };

function createInitialState(): TimerState {
  return {
    phase: 'work',
    currentSet: 1,
    completionToken: 0,
  };
}

function reducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'RESET':
      return createInitialState();

    case 'COMPLETE_SET': {
      if (state.phase !== 'work' && state.phase !== 'idle') {
        return state;
      }

      if (state.completionToken > 0) {
        return state;
      }

      const setNumber = state.currentSet;

      if (setNumber < action.totalSets) {
        return {
          ...state,
          currentSet: setNumber + 1,
          phase: 'work',
        };
      }

      return {
        ...state,
        completionToken: 1,
        phase: 'idle',
      };
    }

    case 'COMPLETION_FAILED':
      if (state.completionToken === 0) {
        return state;
      }
      return { ...state, completionToken: 0, phase: 'idle' };

    default:
      return state;
  }
}

/**
 * Tracks set progression only. completeSetManually advances to the next set,
 * and triggers onExerciseComplete after the last set.
 */
export function useWorkoutSetTimer({
  totalSets,
  onExerciseComplete,
  resetKey,
}: UseWorkoutSetTimerOptions) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const onCompleteRef = useRef(onExerciseComplete);
  const handledTokenRef = useRef(0);
  const [appliedResetKey, setAppliedResetKey] = useState(resetKey);

  if (appliedResetKey !== resetKey) {
    setAppliedResetKey(resetKey);
    dispatch({ type: 'RESET' });
  }

  useEffect(() => {
    onCompleteRef.current = onExerciseComplete;
  }, [onExerciseComplete]);

  useEffect(() => {
    if (state.completionToken === 0) {
      handledTokenRef.current = 0;
      return;
    }

    if (handledTokenRef.current === state.completionToken) {
      return;
    }

    handledTokenRef.current = state.completionToken;
    let cancelled = false;

    void (async () => {
      const ok = await onCompleteRef.current();
      if (cancelled) {
        return;
      }
      if (!ok) {
        handledTokenRef.current = 0;
        dispatch({ type: 'COMPLETION_FAILED' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state.completionToken]);

  const completeSetManually = useCallback(() => {
    dispatch({ type: 'COMPLETE_SET', totalSets });
  }, [totalSets]);

  return {
    phase: state.phase,
    currentSet: state.currentSet,
    totalSets,
    completeSetManually,
  };
}
