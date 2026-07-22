import { useId } from 'react';

interface ZivanLogoProps {
  size?: number;
  className?: string;
}

/** Zivan brand mark — figure + head in logo gradient (teal → cobalt). */
export function ZivanLogo({ size = 24, className }: ZivanLogoProps) {
  const uid = useId();
  const bodyId = `zivan-body-${uid}`;
  const headId = `zivan-head-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={bodyId}
          x1="256"
          y1="180"
          x2="256"
          y2="440"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#48c9b0" />
          <stop offset="48%" stopColor="#3498db" />
          <stop offset="100%" stopColor="#2e5bcc" />
        </linearGradient>
        <linearGradient
          id={headId}
          x1="252"
          y1="60"
          x2="344"
          y2="152"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#64d2b1" />
          <stop offset="100%" stopColor="#48c9b0" />
        </linearGradient>
      </defs>
      <circle cx="298" cy="106" r="46" fill={`url(#${headId})`} />
      <path
        d="M172 232 C226 218 288 218 342 230 L180 398 C238 414 300 414 350 402"
        stroke={`url(#${bodyId})`}
        strokeWidth="62"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
