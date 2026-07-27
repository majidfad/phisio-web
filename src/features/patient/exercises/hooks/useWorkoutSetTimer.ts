import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

export type WorkoutPhase = 'work' | 'rest' | 'idle';

interface UseWorkoutSetTimerOptions {
  holdSeconds: number | null;
  restSeconds: number | null;
  totalSets: number;
  /** When true, never enter rest — jump straight to the next set (e.g. last exercise in session). */
  skipRest: boolean;
  onExerciseComplete: () => Promise<boolean>;
  enabled: boolean;
  resetKey: string | number;
}

interface TimerState {
  phase: WorkoutPhase;
  currentSet: number;
  secondsLeft: number | null;
  completionToken: number;
}

type TimerAction =
  | { type: 'RESET'; holdSeconds: number | null }
  | { type: 'TICK' }
  | { type: 'HOLD_EXPIRED' }
  | {
      type: 'COMPLETE_SET';
      totalSets: number;
      restSeconds: number | null;
      holdSeconds: number | null;
      skipRest: boolean;
    }
  | { type: 'ADVANCE_AFTER_REST'; holdSeconds: number | null }
  | { type: 'SKIP_TIMER'; holdSeconds: number | null }
  | { type: 'COMPLETION_FAILED' };

function initialSeconds(holdSeconds: number | null): number | null {
  return holdSeconds && holdSeconds > 0 ? holdSeconds : null;
}

function createInitialState(holdSeconds: number | null): TimerState {
  return {
    phase: 'work',
    currentSet: 1,
    secondsLeft: initialSeconds(holdSeconds),
    completionToken: 0,
  };
}

function advanceAfterRest(state: TimerState, holdSeconds: number | null): TimerState {
  if (state.phase !== 'rest') {
    return state;
  }

  return {
    ...state,
    currentSet: state.currentSet + 1,
    phase: 'work',
    secondsLeft: initialSeconds(holdSeconds),
  };
}

function reducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'RESET':
      return createInitialState(action.holdSeconds);

    case 'TICK':
      if (state.secondsLeft === null || state.secondsLeft <= 0) {
        return state;
      }
      return { ...state, secondsLeft: state.secondsLeft - 1 };

    case 'HOLD_EXPIRED':
      if (state.phase !== 'work' || state.secondsLeft !== 0) {
        return state;
      }
      return { ...state, phase: 'idle', secondsLeft: null };

    case 'COMPLETE_SET': {
      if (state.phase === 'rest') {
        return advanceAfterRest(state, action.holdSeconds);
      }

      if (state.phase !== 'work' && state.phase !== 'idle') {
        return state;
      }

      if (state.completionToken > 0) {
        return state;
      }

      const setNumber = state.currentSet;
      const hasRest = !action.skipRest && Boolean(action.restSeconds && action.restSeconds > 0);

      if (setNumber < action.totalSets && hasRest && action.restSeconds) {
        return {
          ...state,
          phase: 'rest',
          secondsLeft: action.restSeconds,
        };
      }

      if (setNumber < action.totalSets) {
        return {
          ...state,
          currentSet: setNumber + 1,
          phase: 'work',
          secondsLeft: initialSeconds(action.holdSeconds),
        };
      }

      return {
        ...state,
        completionToken: 1,
        phase: 'idle',
        secondsLeft: null,
      };
    }

    case 'ADVANCE_AFTER_REST':
      return advanceAfterRest(state, action.holdSeconds);

    case 'SKIP_TIMER':
      if (state.phase === 'rest') {
        return advanceAfterRest(state, action.holdSeconds);
      }
      if (state.phase === 'work') {
        return { ...state, phase: 'idle', secondsLeft: null };
      }
      return state;

    case 'COMPLETION_FAILED':
      if (state.completionToken === 0) {
        return state;
      }
      return { ...state, completionToken: 0, phase: 'idle', secondsLeft: null };

    default:
      return state;
  }
}

/**
 * Hold timer can auto-count during work.
 * Rest starts only after the user marks the set done (completeSetManually),
 * never automatically when hold reaches zero.
 * Rest is between sets only; callers pass skipRest for the last session exercise.
 */
export function useWorkoutSetTimer({
  holdSeconds,
  restSeconds,
  totalSets,
  skipRest,
  onExerciseComplete,
  enabled,
  resetKey,
}: UseWorkoutSetTimerOptions) {
  const [state, dispatch] = useReducer(reducer, holdSeconds, createInitialState);
  const onCompleteRef = useRef(onExerciseComplete);
  const handledTokenRef = useRef(0);
  const [appliedConfig, setAppliedConfig] = useState({ resetKey, holdSeconds });

  if (appliedConfig.resetKey !== resetKey || appliedConfig.holdSeconds !== holdSeconds) {
    setAppliedConfig({ resetKey, holdSeconds });
    dispatch({ type: 'RESET', holdSeconds });
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

  useEffect(() => {
    if (!enabled || state.secondsLeft === null) {
      return;
    }

    if (state.secondsLeft > 0) {
      const id = window.setTimeout(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      return () => window.clearTimeout(id);
    }

    if (state.phase === 'work') {
      const id = window.setTimeout(() => {
        dispatch({ type: 'HOLD_EXPIRED' });
      }, 0);
      return () => window.clearTimeout(id);
    }

    if (state.phase === 'rest') {
      const id = window.setTimeout(() => {
        dispatch({ type: 'ADVANCE_AFTER_REST', holdSeconds });
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [enabled, holdSeconds, state.phase, state.secondsLeft]);

  const completeSetManually = useCallback(() => {
    dispatch({
      type: 'COMPLETE_SET',
      totalSets,
      restSeconds,
      holdSeconds,
      skipRest,
    });
  }, [holdSeconds, restSeconds, skipRest, totalSets]);

  const skipTimer = useCallback(() => {
    dispatch({ type: 'SKIP_TIMER', holdSeconds });
  }, [holdSeconds]);

  return {
    phase: state.phase,
    currentSet: state.currentSet,
    totalSets,
    secondsLeft: state.secondsLeft,
    hasHoldTimer: Boolean(holdSeconds && holdSeconds > 0),
    hasRestTimer: Boolean(restSeconds && restSeconds > 0) && !skipRest,
    completeSetManually,
    skipTimer,
  };
}
