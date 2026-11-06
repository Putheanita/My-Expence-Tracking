import React from 'react';

interface CloudMascotProps {
  status?: 'good' | 'warning' | 'alert';
  size?: number;
}

export const CloudMascot: React.FC<CloudMascotProps> = ({ size = 180 }) => {
  return (
    <div className="cloud-mascot-container" style={{ width: size, height: size * 0.9 }}>
      <svg
        viewBox="0 0 240 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cloud-mascot-svg"
      >
        <defs>
          {/* Soft 3D Cloud Gradient */}
          <linearGradient id="cloudBody" x1="120" y1="20" x2="120" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#EDF6FD" />
            <stop offset="100%" stopColor="#D2E8FB" />
          </linearGradient>

          {/* Shadow Filter for soft fluffy feel */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Heart/Coin glow */}
          <radialGradient id="glowPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2A3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFDE6A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer soft aura */}
        <ellipse cx="120" cy="115" rx="85" ry="60" fill="url(#glowPulse)" />

        {/* Fluffy Cloud Puffs */}
        <g className="floating-cloud-body">
          {/* Back puffs for volume */}
          <circle cx="85" cy="85" r="42" fill="#E1EFFD" />
          <circle cx="155" cy="85" r="42" fill="#E1EFFD" />
          <circle cx="120" cy="65" r="48" fill="#F4F9FE" />

          {/* Main Cloud Base */}
          <path
            d="M75 145 C45 145 35 120 48 95 C45 70 70 50 95 60 C105 38 135 38 145 60 C170 50 195 70 192 95 C205 120 195 145 165 145 Z"
            fill="url(#cloudBody)"
            filter="drop-shadow(0px 14px 22px rgba(135, 185, 230, 0.35))"
          />

          {/* Cute Cheeks */}
          <circle cx="82" cy="112" r="7.5" fill="#FFB7C5" opacity="0.65" />
          <circle cx="158" cy="112" r="7.5" fill="#FFB7C5" opacity="0.65" />

          {/* Happy Closed Eyes (Arc) */}
          <path
            d="M93 104 Q 100 97 107 104"
            stroke="#4A6572"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M133 104 Q 140 97 147 104"
            stroke="#4A6572"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tiny Smile */}
          <path
            d="M116 112 Q 120 117 124 112"
            stroke="#4A6572"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Little hands hugging a coin/heart */}
          <g className="mascot-hands">
            {/* Glowing token/heart */}
            <circle cx="120" cy="132" r="16" fill="#FFE875" filter="drop-shadow(0px 2px 6px rgba(255,210,50,0.5))" />
            <text x="120" y="137" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#B38600">✦</text>

            {/* Left hand */}
            <ellipse cx="102" cy="132" rx="7" ry="5.5" fill="#FFFFFF" transform="rotate(-15 102 132)" />
            {/* Right hand */}
            <ellipse cx="138" cy="132" rx="7" ry="5.5" fill="#FFFFFF" transform="rotate(15 138 132)" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export const StarMascot: React.FC<{ size?: number }> = ({ size = 130 }) => {
  return (
    <div className="star-mascot-container" style={{ width: size, height: size }}>
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="star-mascot-svg">
        <defs>
          <linearGradient id="starGrad" x1="80" y1="20" x2="80" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#C8E5FF" />
            <stop offset="100%" stopColor="#96CDFC" />
          </linearGradient>
        </defs>

        {/* Soft glow */}
        <circle cx="80" cy="80" r="60" fill="rgba(195, 230, 255, 0.4)" filter="blur(14px)" />

        {/* 5-Point Rounded Soft Star */}
        <g className="floating-star-body">
          <path
            d="M80 25 C82 25 87 50 93 58 C99 66 125 72 125 74 C125 76 104 88 100 97 C96 106 103 132 101 133 C99 134 78 118 70 118 C62 118 41 134 39 133 C37 132 44 106 40 97 C36 88 15 76 15 74 C15 72 41 66 47 58 C53 50 58 25 80 25 Z"
            fill="url(#starGrad)"
            filter="drop-shadow(0px 8px 16px rgba(110, 175, 230, 0.35))"
          />

          {/* Cheeks */}
          <circle cx="58" cy="84" r="5" fill="#FFB7C5" opacity="0.75" />
          <circle cx="98" cy="84" r="5" fill="#FFB7C5" opacity="0.75" />

          {/* Happy eyes */}
          <path d="M64 77 Q 69 72 74 77" stroke="#3D5A70" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M86 77 Q 91 72 96 77" stroke="#3D5A70" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Smile */}
          <path d="M77 84 Q 80 87 83 84" stroke="#3D5A70" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
};
