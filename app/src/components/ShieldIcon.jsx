export default function ShieldIcon({ className = '', size = 130 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Core Shield Neon Gradient */}
        <linearGradient id="shieldCoreGrad" x1="20" y1="10" x2="120" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#24c37f" />
          <stop offset="50%" stopColor="#10a867" />
          <stop offset="100%" stopColor="#1b335e" />
        </linearGradient>

        {/* Outer Halo Glow Gradient */}
        <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#53d89d" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#24c37f" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#081126" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="borderGrad" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8ee9bf" />
          <stop offset="50%" stopColor="#24c37f" />
          <stop offset="100%" stopColor="#3864aa" />
        </linearGradient>

        <filter id="neonBloom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Cyber Halo Rings */}
      <circle cx="70" cy="70" r="66" fill="url(#haloGlow)" />
      <circle cx="70" cy="70" r="62" stroke="#24c37f" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
      <circle cx="70" cy="70" r="54" stroke="#5481c4" strokeWidth="0.75" strokeDasharray="8 4" opacity="0.3" />

      {/* Outer Tactical Brackets */}
      <path d="M70 12 L18 35 V70 C18 100 40 125 70 134 C100 125 122 100 122 70 V35 L70 12 Z"
        fill="url(#shieldCoreGrad)"
        stroke="url(#borderGrad)"
        strokeWidth="2.5"
        filter="url(#neonBloom)"
      />

      {/* Inner Armored Plate */}
      <path d="M70 24 L28 42 V70 C28 94 46 114 70 122 C94 114 112 94 112 70 V42 L70 24 Z"
        fill="#081126"
        fillOpacity="0.85"
        stroke="#53d89d"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />

      {/* Circuit Trace Details */}
      <path d="M70 24 V50 M50 60 H90 M70 85 V122" stroke="#24c37f" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="70" cy="50" r="2.5" fill="#8ee9bf" />
      <circle cx="50" cy="60" r="2" fill="#8ee9bf" />
      <circle cx="90" cy="60" r="2" fill="#8ee9bf" />

      {/* Heroic Checkmark */}
      <path
        d="M48 68 L63 83 L94 52"
        stroke="#8ee9bf"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#neonBloom)"
      />

      {/* Security Vault Keyhole Lock */}
      <rect x="62" y="93" width="16" height="12" rx="3" fill="#24c37f" fillOpacity="0.9" />
      <path
        d="M66 93 V89 C66 86.8 67.8 85 70 85 C72.2 85 74 86.8 74 89 V93"
        stroke="#8ee9bf"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="70" cy="99" r="1.5" fill="#081126" />
    </svg>
  );
}
