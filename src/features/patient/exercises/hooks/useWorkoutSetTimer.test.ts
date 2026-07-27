import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useWorkoutSetTimer } from '@/features/patient/exercises/hooks/useWorkoutSetTimer';

describe('useWorkoutSetTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('enters rest after completing a set when more sets remain', () => {
    const onExerciseComplete = vi.fn().mockResolvedValue(true);
    const { result } = renderHook(() =>
      useWorkoutSetTimer({
        holdSeconds: null,
        restSeconds: 10,
        totalSets: 3,
        skipRest: false,
        enabled: true,
        resetKey: 'ex-1',
        onExerciseComplete,
      }),
    );

    act(() => {
      result.current.completeSetManually();
    });

    expect(result.current.phase).toBe('rest');
    expect(result.current.secondsLeft).toBe(10);
    expect(result.current.currentSet).toBe(1);
    expect(onExerciseComplete).not.toHaveBeenCalled();
  });

  it('advances to next set when rest timer finishes', () => {
    const { result } = renderHook(() =>
      useWorkoutSetTimer({
        holdSeconds: null,
        restSeconds: 2,
        totalSets: 3,
        skipRest: false,
        enabled: true,
        resetKey: 'ex-1',
        onExerciseComplete: vi.fn().mockResolvedValue(true),
      }),
    );

    act(() => {
      result.current.completeSetManually();
    });
    expect(result.current.phase).toBe('rest');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.secondsLeft).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.secondsLeft).toBe(0);

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.phase).toBe('work');
    expect(result.current.currentSet).toBe(2);
  });

  it('skip timer advances once even if rest already hit zero', () => {
    const { result } = renderHook(() =>
      useWorkoutSetTimer({
        holdSeconds: null,
        restSeconds: 1,
        totalSets: 3,
        skipRest: false,
        enabled: true,
        resetKey: 'ex-1',
        onExerciseComplete: vi.fn().mockResolvedValue(true),
      }),
    );

    act(() => {
      result.current.completeSetManually();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.skipTimer();
      vi.runOnlyPendingTimers();
    });

    expect(result.current.phase).toBe('work');
    expect(result.current.currentSet).toBe(2);
  });

  it('skips rest entirely when skipRest is true', () => {
    const onExerciseComplete = vi.fn().mockResolvedValue(true);
    const { result } = renderHook(() =>
      useWorkoutSetTimer({
        holdSeconds: null,
        restSeconds: 15,
        totalSets: 2,
        skipRest: true,
        enabled: true,
        resetKey: 'ex-last',
        onExerciseComplete,
      }),
    );

    act(() => {
      result.current.completeSetManually();
    });

    expect(result.current.phase).toBe('work');
    expect(result.current.currentSet).toBe(2);
    expect(onExerciseComplete).not.toHaveBeenCalled();
  });

  it('completes exercise after the last set', async () => {
    const onExerciseComplete = vi.fn().mockResolvedValue(true);
    const { result } = renderHook(() =>
      useWorkoutSetTimer({
        holdSeconds: null,
        restSeconds: 10,
        totalSets: 1,
        skipRest: false,
        enabled: true,
        resetKey: 'ex-1',
        onExerciseComplete,
      }),
    );

    act(() => {
      result.current.completeSetManually();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(onExerciseComplete).toHaveBeenCalledTimes(1);
  });

  it('does not reset progress when enabled flips to false', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) =>
        useWorkoutSetTimer({
          holdSeconds: null,
          restSeconds: 10,
          totalSets: 3,
          skipRest: false,
          enabled,
          resetKey: 'ex-1',
          onExerciseComplete: vi.fn().mockResolvedValue(true),
        }),
      { initialProps: { enabled: true } },
    );

    act(() => {
      result.current.completeSetManually();
    });
    expect(result.current.phase).toBe('rest');

    rerender({ enabled: false });
    expect(result.current.phase).toBe('rest');
    expect(result.current.currentSet).toBe(1);
  });
});
