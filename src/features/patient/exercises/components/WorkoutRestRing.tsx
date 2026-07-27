interface WorkoutRestRingProps {
  secondsLeft: number;
  totalSeconds: number;
  label: string;
  displaySeconds: string;
  nextLabel: string;
  skipLabel: string;
  onSkip: () => void;
  skipDisabled?: boolean;
}

/** Circular countdown for rest phase — high contrast on dark media. */
export function WorkoutRestRing({
  secondsLeft,
  totalSeconds,
  label,
  displaySeconds,
  nextLabel,
  skipLabel,
  onSkip,
  skipDisabled = false,
}: WorkoutRestRingProps) {
  const size = 196;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = Math.max(totalSeconds, 1);
  const progress = Math.min(Math.max(secondsLeft / safeTotal, 0), 1);
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="workout-rest-ring" aria-live="polite">
      <span className="workout-rest-ring__pill">{label}</span>

      <div className="workout-rest-ring__dial" style={{ width: size, height: size }}>
        <svg
          className="workout-rest-ring__svg"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          <circle
            className="workout-rest-ring__track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
          />
          <circle
            className="workout-rest-ring__progress"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="workout-rest-ring__seconds">{displaySeconds}</div>
      </div>

      <p className="workout-rest-ring__next">{nextLabel}</p>

      <button
        type="button"
        className="workout-rest-ring__skip"
        onClick={onSkip}
        disabled={skipDisabled}
      >
        {skipLabel}
      </button>
    </div>
  );
}
