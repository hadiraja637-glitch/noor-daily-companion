export default function NoorLogo({ size = 45 }: { size?: number }) {
  const s = size;
  return (
    <div
      style={{
        height: `${s}px`,
        width: `${s}px`,
        backgroundColor: '#E8BD4B',
        WebkitMaskImage: `url('/images/Gemini_Generated_Image_ykfflqykfflqykff.jfif')`,
        maskImage: `url('/images/Gemini_Generated_Image_ykfflqykfflqykff.jfif')`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: 'drop-shadow(0 0 6px rgba(232, 189, 75, 0.6))'
      }}
    />
  );
}
