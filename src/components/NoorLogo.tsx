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

  const containerSize = {
    // Navbar: narrow + slightly taller
    navbar: "w-[32px] h-[44px] sm:w-[34px] sm:h-[46px]",

    // Footer: same balanced proportion, slightly smaller
    footer: "w-[30px] h-[40px] sm:w-[32px] sm:h-[42px]",
  };

  return (
    <div
      className={[
        "flex",
        "shrink-0",
        "items-center",
        "justify-center",
        "bg-transparent",
        containerSize[variant],
        className,
      ].join(" ")}
    >
      <img
        src={logoSrc}
        alt="Noor"
        draggable={false}
        className="
          block
          max-h-full
          max-w-full
          object-contain
          bg-transparent
          select-none
        "
      />
    </div>
  );
};

export default NoorLogo;
