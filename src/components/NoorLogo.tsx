import React, { useEffect, useRef, useState } from "react";
import logo from "./Noorlogo-transparent.png";

interface NoorLogoProps {
  size?: number | string;
  className?: string;
}

export default function NoorLogo({
  size = 64,
  className = "",
}: NoorLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const image = new Image();

    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const pixels = imageData.data;

      // Background color taken from the dark-green area
      // around the Noor logo.
      const background = {
        r: 6,
        g: 25,
        b: 19,
      };

      // Only remove pixels connected to the outside edges.
      // This protects the dark details inside the Islamic logo.
      const visited = new Uint8Array(canvas.width * canvas.height);
      const queue: number[] = [];

      const isBackground = (index: number) => {
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];

        const distance =
          Math.abs(r - background.r) +
          Math.abs(g - background.g) +
          Math.abs(b - background.b);

        // Slight tolerance for compression / anti-aliasing.
        return distance < 55;
      };

      const addPixel = (x: number, y: number) => {
        if (
          x < 0 ||
          y < 0 ||
          x >= canvas.width ||
          y >= canvas.height
        ) {
          return;
        }

        const position = y * canvas.width + x;

        if (visited[position]) return;

        const index = position * 4;

        if (!isBackground(index)) return;

        visited[position] = 1;
        queue.push(position);
      };

      // Start from all four edges.
      for (let x = 0; x < canvas.width; x++) {
        addPixel(x, 0);
        addPixel(x, canvas.height - 1);
      }

      for (let y = 0; y < canvas.height; y++) {
        addPixel(0, y);
        addPixel(canvas.width - 1, y);
      }

      // Flood-fill the actual outer background.
      let current = 0;

      while (current < queue.length) {
        const position = queue[current++];
        const x = position % canvas.width;
        const y = Math.floor(position / canvas.width);

        const index = position * 4;

        // Make background transparent.
        pixels[index + 3] = 0;

        addPixel(x + 1, y);
        addPixel(x - 1, y);
        addPixel(x, y + 1);
        addPixel(x, y - 1);
      }

      ctx.putImageData(imageData, 0, 0);
      setReady(true);
    };

    image.src = logo;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Noor — Islamic Daily Companion"
      role="img"
      className={className}
      draggable={false}
      style={{
        width: size,
        height: size,
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        objectPosition: "center",
        display: ready ? "block" : "none",
        flexShrink: 0,
      }}
    />
  );
}
