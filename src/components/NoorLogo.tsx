import React from "react";
import logo from "./Noorlogo-transparent.png";

interface NoorLogoProps {
  size?: number | string;
  className?: string;
}

export default function NoorLogo({
  size = 64,
  className = "",
}: NoorLogoProps) {
  return (
    <img
      src={logo}
      alt="Noor — Islamic Daily Companion"
      className={className}
      draggable={false}
      style={{
        width: size,
        height: size,
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        objectPosition: "center",
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}
