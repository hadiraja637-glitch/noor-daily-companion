export default function NoorLogo({ size = 45 }: { size?: number }) {
  const s = size;
  return (
    <img 
      src="/images/noor-logo-iconn.jfif" 
      alt="Noor Logo" 
      style={{ 
        height: `${s}px`, 
        width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '6px',
        objectFit: 'contain',
        boxShadow: '0 0 6px rgba(232, 189, 75, 0.3)'
      }} 
    />
  );
}
