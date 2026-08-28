export default function NoorLogo({ size = 50 }: { size?: number }) {
  const s = size;
  return (
    <svg 
      width={s} 
      height={Math.round(s * 1.35)} 
      viewBox="0 0 200 270" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        {/* Exact Metallic Gold Gradient from Image */}
        <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="25%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F3E5AB" />
          <stop offset="75%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#E6CA65" />
        </linearGradient>

        {/* Soft Gold Glow Effect */}
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Geometric Star Pattern in Outer Arch */}
        <pattern id="archGeoPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 16 8 L 8 16 L 0 8 Z" stroke="url(#goldMetallic)" strokeWidth="0.8" fill="none" opacity="0.6"/>
          <path d="M 0 0 L 16 16 M 16 0 L 0 16" stroke="url(#goldMetallic)" strokeWidth="0.5" fill="none" opacity="0.4"/>
        </pattern>
      </defs>

      {/* 1. Outer Dome Frame */}
      <path 
        d="M 20 220 V 105 C 20 45 100 12 100 12 C 100 12 180 45 180 105 V 220 C 180 238 100 258 100 258 C 100 258 20 238 20 220 Z" 
        stroke="url(#goldMetallic)" 
        strokeWidth="4" 
        fill="none" 
        filter="url(#softGlow)"
      />

      {/* 2. Geometric Arch Pattern Fill Area */}
      <path 
        d="M 28 214 V 107 C 28 53 100 24 100 24 C 100 24 172 53 172 107 V 214 C 172 228 100 248 100 248 C 100 248 28 228 28 214 Z" 
        stroke="url(#goldMetallic)" 
        strokeWidth="1.5" 
        fill="url(#archGeoPattern)" 
        opacity="0.8"
      />

      {/* 3. Inner Arch Frame */}
      <path 
        d="M 46 172 V 96 C 46 60 100 38 100 38 C 100 38 154 60 154 96 V 172 Z" 
        stroke="url(#goldMetallic)" 
        strokeWidth="3" 
        fill="#041E17" 
      />

      {/* 4. Exact Arabic Thuluth Calligraphy "نُور" */}
      <g fill="url(#goldMetallic)" filter="url(#softGlow)">
        {/* Top Harkat / Tashkeel & Nuqta */}
        <polygon points="106,70 112,65 116,71 110,76" />
        <path d="M 120 86 C 123 78 132 82 128 90 C 124 96 116 92 120 86 Z" />
        <path d="M 92 82 Q 100 76 104 84 Q 96 90 92 82 Z" />

        {/* Calligraphic Body (Noon, Waw, Re) */}
        <path d="M 52 138 C 42 136 34 148 48 154 C 70 162 94 168 114 150 C 128 138 142 110 134 94 C 130 86 136 82 140 86 C 148 94 146 114 132 134 C 118 154 88 174 62 166 C 48 162 38 150 44 140 Q 48 134 52 138 Z" />
        <path d="M 94 122 C 102 102 124 106 120 120 C 114 138 92 152 82 168 C 78 174 72 172 74 166 C 82 150 104 134 94 122 Z" />
        <path d="M 112 110 Q 124 102 120 114 Q 108 126 112 110 Z" />
      </g>

      {/* 5. English Serif Typography "NOOR" */}
      <text 
        x="100" 
        y="210" 
        textAnchor="middle" 
        fill="url(#goldMetallic)" 
        fontFamily="'Cinzel', 'Times New Roman', serif" 
        fontSize="28" 
        fontWeight="bold" 
        letterSpacing="5"
        filter="url(#softGlow)"
      >
        NOOR
      </text>

      {/* 6. Subtitle "Islamic Daily Companion" */}
      <text 
        x="100" 
        y="228" 
        textAnchor="middle" 
        fill="url(#goldMetallic)" 
        fontFamily="'Montserrat', 'Arial', sans-serif" 
        fontSize="8" 
        letterSpacing="1.2" 
        opacity="0.9"
      >
        Islamic Daily Companion
      </text>
    </svg>
  );
}
