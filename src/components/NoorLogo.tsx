import React from "react";

type NoorLogoVariant = "navbar" | "footer";

interface NoorLogoProps {
  variant?: NoorLogoVariant;
  className?: string;
}

const NoorLogo: React.FC<NoorLogoProps> = ({
  variant = "navbar",
  className = "",
}) => {
  const logoSrc =
    "/images/ChatGPT%20Image%20Aug%2028%2C%202026%2C%2006_31_11%20PM.png";

  const sizeClasses = {
    navbar:
      "h-14 sm:h-[58px] lg:h-[62px]",
    footer:
      "h-12 sm:h-[52px] lg:h-[56px]",
  };

  return (
    <img
      src={logoSrc}
      alt="Noor"
      draggable={false}
      className={[
        "block",
        "w-auto",
        "max-w-none",
        "object-contain",
        "shrink-0",
        "bg-transparent",
        "select-none",
        sizeClasses[variant],
        className,
      ].join(" ")}
    />
  );
};

export default NoorLogo;
