export default function NoorLogo({ size = 42 }: { size?: number }) {
  const s = size;
  return (
    <svg 
      width={s} 
      height={Math.round(s * 1.1)} 
      viewBox="0 0 100 110" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E29C" />
          <stop offset="50%" stopColor="#E8BD4B" />
          <stop offset="100%" stopColor="#B38728" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Dome Arch */}
      <path 
        d="M 15 95 V 45 C 15 20 50 5 50 5 C 50 5 85 20 85 45 V 95 Z" 
        stroke="url(#goldGrad)" 
        strokeWidth="3.5" 
        fill="none" 
        filter="url(#glow)"
      />
      
      {/* Inner Decorative Arch */}
      <path 
        d="M 23 90 V 48 C 23 28 50 15 50 15 C 50 15 77 28 77 48 V 90" 
        stroke="url(#goldGrad)" 
        strokeWidth="1.5" 
        strokeDasharray="3 2"
        fill="none" 
        opacity="0.8"
      />

      {/* Arabic Calligraphy 'Noor' (نور) */}
      <g fill="url(#goldGrad)">
        {/* Nuqta */}
        <circle cx="58" cy="34" r="3.5" />
        
        {/* Calligraphy Strokes */}
        <path d="M 32 65 C 32 50 42 42 48 42 C 52 42 54 45 51 49 C 47 55 40 60 40 68 C 40 73 45 75 52 71 C 62 65 70 50 67 44 C 65 40 68 38 71 40 C 76 43 75 53 66 66 C 56 80 40 82 33 76 C 29 73 32 68 32 65 Z" />
        <path d="M 52 56 C 56 48 64 48 64 54 C 64 62 52 74 46 86 C 44 90 40 89 42 85 C 47 75 56 65 52 56 Z" />
      </g>

      {/* Bottom Text Frame */}
      <path d="M 28 95 H 72" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
