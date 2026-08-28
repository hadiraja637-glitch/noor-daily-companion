export default function NoorLogo({ size = 40 }: { size?: number }) {
  const s = size;
  return (
    <img 
      src="/images/Gemini_Generated_Image_hwgnv7hwgnv7hwgn.jfif" 
      alt="Noor Logo" 
      style={{ 
        height: `${s}px`, 
        width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle',
        mixBlendMode: 'lighten', // Ye gray background ko poora blend/remove kar dega
        objectFit: 'contain'
      }} 
    />
  );
}
