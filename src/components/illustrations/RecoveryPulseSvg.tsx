interface RecoveryPulseSvgProps {
  variant?: 'recovery' | 'care' | 'progress' | 'admin';
  size?: number;
}

export function RecoveryPulseSvg({ variant = 'recovery', size = 88 }: RecoveryPulseSvgProps) {
  const uid = variant;
  const accent = variant === 'progress' ? '#22c55e' : '#3b82f6';
  const accentMid = variant === 'progress' ? '#4ade80' : '#60a5fa';
  const accentSoft = variant === 'progress' ? 'rgba(34,197,94,0.22)' : 'rgba(59,130,246,0.22)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`pulse-ring-${uid}`} x1="0" y1="0" x2="96" y2="96">
          <stop offset="0%" stopColor={accentMid} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <radialGradient id={`pulse-glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="48" cy="48" r="44" fill={`url(#pulse-glow-${uid})`} />
      <circle cx="48" cy="48" r="38" stroke={accentSoft} strokeWidth="2" />
      <circle
        cx="48"
        cy="48"
        r="30"
        stroke={`url(#pulse-ring-${uid})`}
        strokeWidth="2.5"
        strokeDasharray="6 8"
      />

      {variant === 'recovery' || variant === 'progress' ? (
        <>
          <path
            d="M16 54 L28 40 L38 56 L50 30 L64 46 L80 54"
            stroke={`url(#pulse-ring-${uid})`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="50" cy="30" r="4" fill={accentMid} />
        </>
      ) : null}

      {variant === 'care' ? (
        <>
          <path
            d="M48 22 C48 22 30 32 30 46 C30 56 37 63 48 68 C59 63 66 56 66 46 C66 32 48 22 48 22Z"
            fill={`url(#pulse-ring-${uid})`}
            fillOpacity="0.9"
          />
          <path d="M48 34 V54 M40 44 H56" stroke="#0d1b2a" strokeWidth="0" fill="none" />
        </>
      ) : null}

      {variant === 'admin' ? (
        <>
          <rect
            x="28"
            y="28"
            width="40"
            height="40"
            rx="10"
            stroke={`url(#pulse-ring-${uid})`}
            strokeWidth="2.5"
            fill="rgba(59,130,246,0.08)"
          />
          <path
            d="M38 48 H58 M48 38 V58"
            stroke={accentMid}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="68" cy="28" r="6" fill="#22c55e" fillOpacity="0.85" />
        </>
      ) : null}

      <circle cx="48" cy="48" r="5" fill={accent} />
    </svg>
  );
}
