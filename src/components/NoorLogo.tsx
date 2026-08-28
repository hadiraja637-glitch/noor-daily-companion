import React from "react";

export interface NoorLogoProps {
  size?: number | string;
  className?: string;
}

const NoorLogo: React.FC<NoorLogoProps> = ({
  size = 76,
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Noor"
    >
      <defs>
        <linearGradient
          id="noor-gold"
          x1="15"
          y1="10"
          x2="105"
          y2="130"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8C6828" />
          <stop offset="20%" stopColor="#E8CD7A" />
          <stop offset="42%" stopColor="#FFF1A8" />
          <stop offset="62%" stopColor="#C79B3B" />
          <stop offset="82%" stopColor="#F4D978" />
          <stop offset="100%" stopColor="#84601F" />
        </linearGradient>

        <filter
          id="noor-glow"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="2.5" result="blur" />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer arch */}
      <path
        d="
          M22 103
          V58
          C22 32 37 15 60 5
          C83 15 98 32 98 58
          V103
          C98 117 83 128 60 137
          C37 128 22 117 22 103
          Z
        "
        stroke="url(#noor-gold)"
        strokeWidth="3.2"
        strokeLinejoin="round"
        filter="url(#noor-glow)"
      />

      {/* Inner arch */}
      <path
        d="
          M34 91
          V60
          C34 40 44 28 60 20
          C76 28 86 40 86 60
          V91
        "
        stroke="url(#noor-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Top rays */}
      <g
        stroke="url(#noor-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M60 27V15" />
        <path d="M51 30L43 20" />
        <path d="M69 30L77 20" />
      </g>

      {/* Side decorative dots */}
      <g fill="url(#noor-gold)">
        <circle cx="31" cy="57" r="2" />
        <circle cx="89" cy="57" r="2" />
        <circle cx="31" cy="70" r="1.5" />
        <circle cx="89" cy="70" r="1.5" />
        <circle cx="31" cy="82" r="1.5" />
        <circle cx="89" cy="82" r="1.5" />
      </g>

      {/* Noor inspired calligraphy */}
      <g
        fill="url(#noor-gold)"
        filter="url(#noor-glow)"
      >
        <path
          d="
            M35 88
            C44 85 51 80 55 72
            C59 64 59 54 58 43
            C64 52 67 61 73 68
            C77 74 83 79 88 82
            C82 91 72 98 60 99
            C49 100 40 96 35 88
            Z
          "
        />

        <path
          d="
            M59 42
            C55 58 53 71 57 82
            C60 91 67 94 74 90
          "
          fill="none"
          stroke="url(#noor-gold)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <path
          d="
            M74 61
            C82 66 86 74 87 82
          "
          fill="none"
          stroke="url(#noor-gold)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <circle cx="67" cy="37" r="2.8" />
        <circle cx="72" cy="47" r="2.3" />
      </g>

      {/* Bottom accent */}
      <path
        d="M35 108C50 112 70 112 85 108"
        stroke="url(#noor-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
};

export default NoorLogo;
