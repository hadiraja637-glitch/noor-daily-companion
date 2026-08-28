export default function NoorLogo({ size = 45 }: { size?: number }) {
  const s = size;
  return (
    <div 
      style={{ 
        height: `${s}px`, 
        width: `${s}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#04221b', // Matching site theme
        boxShadow: '0 0 8px rgba(232, 189, 75, 0.4)'
      }}
    >
      <img 
        src="/images/Gemini_Generated_Image_hwgnv7hwgnv7hwgn.jfif" 
        alt="Noor Logo" 
        style={{ 
          height: '140%', 
          width: '140%',
          objectFit: 'cover',
          objectPosition: 'center'
        }} 
      />
    </div>
  );
}
