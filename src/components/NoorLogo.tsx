export default function NoorLogo({ size = 40 }: { size?: number }) {
  const s = size;
  return (
    <img 
      src="/images/noor-logo.png.jfif" 
      alt="Noor Logo" 
      style={{ 
        height: `${s}px`, 
        width: 'auto',
        borderRadius: '8px',
        objectFit: 'cover',
        display: 'inline-block',
        verticalAlign: 'middle',
        boxShadow: '0 0 8px rgba(232, 189, 75, 0.3)'
      }} 
    />
  );
}
