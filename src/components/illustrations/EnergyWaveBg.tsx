import type { CSSProperties } from 'react';

interface EnergyWaveBgProps {
  className?: string;
  style?: CSSProperties;
  idSuffix?: string;
}

export function EnergyWaveBg({ className, style, idSuffix = 'default' }: EnergyWaveBgProps) {
  const blueId = `energy-wave-blue-${idSuffix}`;
  const greenId = `energy-wave-green-${idSuffix}`;
  const meshId = `energy-mesh-${idSuffix}`;

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={blueId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={greenId} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={meshId} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#1a2c44" stopOpacity="0" />
        </radialGradient>
        <filter id={`blur-${idSuffix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <rect width="400" height="200" fill={`url(#${meshId})`} />
      <ellipse
        cx="320"
        cy="36"
        rx="130"
        ry="86"
        fill={`url(#${greenId})`}
        filter={`url(#blur-${idSuffix})`}
      />
      <ellipse
        cx="72"
        cy="128"
        rx="110"
        ry="76"
        fill={`url(#${blueId})`}
        filter={`url(#blur-${idSuffix})`}
      />
      <path
        d="M0 148 C70 118 140 162 210 138 C280 114 340 156 400 132 V200 H0 Z"
        fill="rgba(59, 130, 246, 0.1)"
      />
      <path
        d="M0 168 C90 150 160 176 250 160 C320 148 360 170 400 158"
        stroke="rgba(59, 130, 246, 0.22)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
