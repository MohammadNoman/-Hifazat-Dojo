export default function ShieldIcon({ className = '', size = 120 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer glow */}
      <defs>
        <linearGradient id="shieldGrad" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#17bf3e" />
          <stop offset="100%" stopColor="#1b3780" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Shield body */}
      <path
        d="M60 8L16 28V56C16 82 34 106 60 114C86 106 104 82 104 56V28L60 8Z"
        fill="url(#shieldGrad)"
        stroke="#39c95b"
        strokeWidth="2"
        filter="url(#glow)"
      />
      {/* Inner shield */}
      <path
        d="M60 18L24 34V56C24 78 40 98 60 106C80 98 96 78 96 56V34L60 18Z"
        fill="#0d1b3e"
        fillOpacity="0.6"
      />
      {/* Checkmark */}
      <path
        d="M42 58L54 70L78 46"
        stroke="#39c95b"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Lock icon */}
      <rect x="52" y="78" width="16" height="12" rx="2" fill="#39c95b" fillOpacity="0.8" />
      <path
        d="M55 78V74C55 71.2 57.2 69 60 69C62.8 69 65 71.2 65 74V78"
        stroke="#39c95b"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}
