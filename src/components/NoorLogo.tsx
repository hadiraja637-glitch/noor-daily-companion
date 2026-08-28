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
        filter: 'brightness(1.15) contrast(1.25) grayscale(10%)',
        mixBlendMode: 'color-dodge',
        objectFit: 'contain'
      }} 
    />
  );
}
