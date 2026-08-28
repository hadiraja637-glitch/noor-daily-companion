import React from "react";

interface NoorLogoProps {
  className?: string;
  size?: number;
}

const NoorLogo: React.FC<NoorLogoProps> = ({
  className = "",
  size = 44,
}) => {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-transparent ${className}`}
      style={{
        height: `${size}px`,
      }}
    >
      <img
        src="/images/ChatGPT%20Image%20Aug%2028%2C%202026%2C%2006_31_11%20PM.png"
        alt="NOOR - Islamic Daily Companion"
        draggable={false}
        className="block h-full w-auto max-w-full object-contain bg-transparent"
        style={{
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
};

export default NoorLogo;
