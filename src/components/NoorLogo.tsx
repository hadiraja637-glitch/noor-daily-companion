export default function NoorLogo({ size = 45 }: { size?: number }) {
  const s = size;
  return (
    <img 
      src="/images/Gemini_Generated_Image_ykfflqykfflqykff.jfif" 
      alt="Noor Logo" 
      style={{ 
        height: `${s}px`, 
        width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle',
        mixBlendMode: 'screen',
        filter: 'drop-shadow(0 0 6px rgba(232, 189, 75, 0.5))',
        objectFit: 'contain'
      }} 
    />
  );
}
