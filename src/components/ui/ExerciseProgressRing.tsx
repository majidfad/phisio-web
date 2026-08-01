import { useId } from 'react';

interface ExerciseProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function ExerciseProgressRing({
  percent,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  className = '',
}: ExerciseProgressRingProps) {
  const reactId = useId().replace(/:/g, '');
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validPercent = Math.min(100, Math.max(0, percent));
  const strokeDashoffset = circumference - (validPercent / 100) * circumference;
  const gradientId = `progress-ring-gradient-${reactId}`;

  return (
    <div
      className={`progress-ring-wrapper ${className}`.trim()}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          transform: 'rotate(-90deg)',
          display: 'block',
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--phisio-teal)" />
            <stop offset="100%" stopColor="var(--phisio-primary)" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--phisio-border)"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />
        {/* Progress Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      {/* Inner Label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: size > 100 ? '1.25rem' : '1rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--phisio-text)',
            lineHeight: 1.2,
          }}
        >
          {label ?? `${validPercent}%`}
        </span>
        {sublabel ? (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--phisio-text-secondary)',
              marginTop: '2px',
            }}
          >
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
