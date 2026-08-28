export default function NoorLogo({ size = 36 }: { size?: number }) {
  const s = size;
  return (
    <img 
      src="/images/noor-logo.png.jfif" 
      alt="Noor Logo" 
      style={{ 
        height: `${s}px`, 
        width: 'auto',
        maxHeight: '100%',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle'
      }} 
    />
  );
}
