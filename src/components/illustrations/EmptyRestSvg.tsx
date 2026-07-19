interface EmptyRestSvgProps {
  size?: number;
}

export function EmptyRestSvg({ size = 112 }: EmptyRestSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rest-aura" x1="20" y1="16" x2="92" y2="96">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="rest-body" x1="36" y1="34" x2="76" y2="88">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      <circle cx="56" cy="56" r="50" fill="url(#rest-aura)" />
      <circle
        cx="56"
        cy="56"
        r="40"
        stroke="rgba(59, 130, 246, 0.35)"
        strokeWidth="2"
        strokeDasharray="5 7"
      />

      <ellipse cx="56" cy="78" rx="22" ry="6" fill="rgba(59, 130, 246, 0.15)" />

      <circle cx="56" cy="38" r="14" fill="url(#rest-body)" />
      <path
        d="M44 54 C44 54 48 68 56 68 C64 68 68 54 68 54 L64 86 C64 90 60 92 56 92 C52 92 48 90 48 86 Z"
        fill="url(#rest-body)"
        fillOpacity="0.85"
      />

      <path
        d="M36 58 C30 50 28 42 34 38 C38 35 42 40 44 46"
        stroke="#60a5fa"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M76 58 C82 50 84 42 78 38 C74 35 70 40 68 46"
        stroke="#60a5fa"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      <circle cx="50" cy="36" r="2.5" fill="#0d1b2a" fillOpacity="0.65" />
      <circle cx="62" cy="36" r="2.5" fill="#0d1b2a" fillOpacity="0.65" />
      <path
        d="M50 44 Q56 48 62 44"
        stroke="#0d1b2a"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      <circle cx="84" cy="30" r="8" fill="rgba(34, 197, 94, 0.2)" />
      <path d="M84 26 V34 M80 30 H88" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
