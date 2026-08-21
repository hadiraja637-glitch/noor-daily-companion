export default function NoorLogo({ size = 36 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s} height={Math.round(s * 1.1)} viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="23" width="26" height="14" fill="rgba(232,189,75,0.1)" stroke="#E8BD4B" strokeWidth="0.9"/>
      <path d="M10 23 Q10 9 18 7 Q26 9 26 23 Z" fill="rgba(232,189,75,0.18)" stroke="#E8BD4B" strokeWidth="1.1"/>
      <path d="M15 37 L15 28 Q15 25.5 18 25.5 Q21 25.5 21 28 L21 37" fill="rgba(232,189,75,0.28)"/>
      <rect x="1" y="16" width="4" height="21" rx="0.5" fill="rgba(232,189,75,0.08)" stroke="#E8BD4B" strokeWidth="0.7"/>
      <rect x="31" y="16" width="4" height="21" rx="0.5" fill="rgba(232,189,75,0.08)" stroke="#E8BD4B" strokeWidth="0.7"/>
      <path d="M3 16 L3 13 Q2 11 3 9.5 Q4 11 3 13" fill="#E8BD4B" opacity="0.75"/>
      <path d="M33 16 L33 13 Q32 11 33 9.5 Q34 11 33 13" fill="#E8BD4B" opacity="0.75"/>
      <path d="M19.8 6.5 C18.8 4.8 16.5 4.6 16 6 C16.4 5 17.4 4.5 18.5 5 C17.5 5 16.7 5.9 17 7 C17.2 8 18.3 8.4 19.3 7.9" fill="#E8BD4B"/>
      <circle cx="21.5" cy="4" r="1.1" fill="#E8BD4B"/>
    </svg>
  );
}
