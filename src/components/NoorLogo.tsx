import React from "react";
import logo from "./Noorlogo-transparent.png";

interface NoorLogoProps {
  className?: string;
  width?: number | string;
}

export default function NoorLogo({
  className = "",
  width = 150,
}: NoorLogoProps) {
  return (
    <img
      src={logo}
      alt="Noor - Islamic Daily Companion"
      width={width}
      className={`noor-logo ${className}`}
      draggable={false}
      style={{
        height: "auto",
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}
