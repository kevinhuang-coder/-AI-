import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 group ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Shield Gradient */}
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          {/* Gold Moat Sparkle */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Emerald Checkmark / Line */}
          <linearGradient id="emeraldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>

          {/* Outer Glow Filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Hexagon / Shield Container */}
        <path
          d="M24 4L40 10V22C40 32.5 33.2 41.8 24 44C14.8 41.8 8 32.5 8 22V10L24 4Z"
          fill="url(#shieldGrad)"
          stroke="#38bdf8"
          strokeWidth="1.5"
          filter="url(#logoGlow)"
        />

        {/* Inner Subtle Moat Ring */}
        <path
          d="M24 8L36 12.8V22C36 30.2 30.8 37.6 24 39.5C17.2 37.6 12 30.2 12 22V12.8L24 8Z"
          fill="#0f172a"
          fillOpacity="0.75"
          stroke="#1e293b"
          strokeWidth="1"
        />

        {/* Compounding Exponential Growth Curve (價值投資複利線) */}
        <path
          d="M16 30C19 30 22 28 24 24C26 20 28 16 33 15"
          stroke="url(#emeraldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Growth Arrow / Star at Top Right */}
        <circle cx="33" cy="15" r="2.5" fill="#34d399" />

        {/* Center Audit Diamond / Moat Star (審計金鑰鑽石) */}
        <path
          d="M24 16L27.5 21L24 26L20.5 21L24 16Z"
          fill="url(#goldGrad)"
          stroke="#fef08a"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
};
