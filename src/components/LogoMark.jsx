import React from 'react';

const LogoMark = ({ size = 96, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="4000 Weeks logo"
    className={className}
  >
    <defs>
      <linearGradient id="logo-sun" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
      <linearGradient id="logo-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
    </defs>

    <rect width="160" height="160" rx="36" fill="url(#logo-shadow)" />

    <g transform="translate(24 24)">
      <rect width="112" height="112" rx="30" fill="rgba(15, 23, 42, 0.45)" />
      <rect
        x="6"
        y="6"
        width="100"
        height="100"
        rx="28"
        fill="url(#logo-sun)"
      />
      <rect
        x="18"
        y="18"
        width="76"
        height="76"
        rx="24"
        fill="url(#logo-shadow)"
        opacity="0.92"
      />
      <path
        d="M34 80c10-18 20-36 30-54l30 54z"
        fill="url(#logo-sun)"
        opacity="0.85"
      />
      <text
        x="56"
        y="68"
        textAnchor="middle"
        fontSize="40"
        fontWeight="700"
        fontFamily="'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif"
        fill="#f8fafc"
      >
        4W
      </text>
    </g>
  </svg>
);

export default LogoMark;
