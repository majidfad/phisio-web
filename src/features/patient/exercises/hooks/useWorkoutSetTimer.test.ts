import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useWorkoutSetTimer } from '@/features/patient/exercises/hooks/useWorkoutSetTimer';

describe('useWorkoutSetTimer', () => {
  it('advances to next set when more sets remain', () => {
    const onExerciseComplete = vi.fn().mockResolvedValue(true);
    const { result } = renderHook(() =>
      useWorkoutSetTimer({
        totalSets: 3,
        enabled: true,
        resetKey: 'ex-1',
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
        totalSets: 1,
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
          totalSets: 3,
          enabled,
          resetKey: 'ex-1',
          onExerciseComplete: vi.fn().mockResolvedValue(true),
        }),
      { initialProps: { enabled: true } },
    );

    act(() => {
      result.current.completeSetManually();
    });
    expect(result.current.currentSet).toBe(2);

    rerender({ enabled: false });
    expect(result.current.phase).toBe('work');
    expect(result.current.currentSet).toBe(2);
  });

  it('resets set progress when resetKey changes', () => {
    const { result, rerender } = renderHook(
      ({ resetKey }) =>
        useWorkoutSetTimer({
          totalSets: 3,
          enabled: true,
          resetKey,
          onExerciseComplete: vi.fn().mockResolvedValue(true),
        }),
      { initialProps: { resetKey: 'ex-1' } },
    );

    act(() => {
      result.current.completeSetManually();
    });
    expect(result.current.currentSet).toBe(2);

    rerender({ resetKey: 'ex-2' });
    expect(result.current.currentSet).toBe(1);
    expect(result.current.phase).toBe('work');
  });
});
