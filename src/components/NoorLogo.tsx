import React from "react";

interface NoorLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const NoorLogo: React.FC<NoorLogoProps> = ({
  className = "",
  width = 180,
  height,
}) => {
  return (
    <div
      className={`flex items-center justify-center bg-transparent ${className}`}
      style={{ width }}
    >
      <img
        src="https://raw.githubusercontent.com/hadiraja637-glitch/noor-daily-companion/main/public/images/ChatGPT%20Image%20Aug%2028%2C%202026%2C%2006_31_11%20PM.png"
        alt="NOOR - Islamic Daily Companion"
        width={width}
        height={height || width}
        className="block h-auto w-full object-contain bg-transparent"
        draggable={false}
      />
    </div>
  );
};

export default NoorLogo;
