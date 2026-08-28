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
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!ctx) return;

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      /*
       * Get the average color of the outer corners.
       * This detects the actual background color automatically.
       */
      const samplePoints = [
        [0, 0],
        [width - 1, 0],
        [0, height - 1],
        [width - 1, height - 1],

        [Math.floor(width * 0.03), Math.floor(height * 0.03)],
        [Math.floor(width * 0.97), Math.floor(height * 0.03)],
        [Math.floor(width * 0.03), Math.floor(height * 0.97)],
        [Math.floor(width * 0.97), Math.floor(height * 0.97)],
      ];

      let bgR = 0;
      let bgG = 0;
      let bgB = 0;

      samplePoints.forEach(([x, y]) => {
        const i = (y * width + x) * 4;

        bgR += pixels[i];
        bgG += pixels[i + 1];
        bgB += pixels[i + 2];
      });

      bgR /= samplePoints.length;
      bgG /= samplePoints.length;
      bgB /= samplePoints.length;

      /*
       * Color distance from detected background.
       */
      const colorDistance = (pixelIndex: number) => {
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];

        return Math.sqrt(
          (r - bgR) ** 2 +
            (g - bgG) ** 2 +
            (b - bgB) ** 2
        );
      };

      /*
       * Lower = more aggressive background removal.
       * 55–70 is usually ideal for dark backgrounds
       * while keeping the gold logo intact.
       */
      const BACKGROUND_TOLERANCE = 60;

      const isBackground = (position: number) => {
        const i = position * 4;

        if (pixels[i + 3] === 0) return true;

        return colorDistance(i) < BACKGROUND_TOLERANCE;
      };

      /*
       * Flood-fill only from the outside edges.
       * Important: dark areas trapped INSIDE the logo
       * will remain untouched.
       */
      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      const addPixel = (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= width || y >= height) {
          return;
        }

        const position = y * width + x;

        if (visited[position]) return;

        if (!isBackground(position)) return;

        visited[position] = 1;
        queue.push(position);
      };

      // Start from every outer edge
      for (let x = 0; x < width; x++) {
        addPixel(x, 0);
        addPixel(x, height - 1);
      }

      for (let y = 0; y < height; y++) {
        addPixel(0, y);
        addPixel(width - 1, y);
      }

      // Flood fill connected background
      let queueIndex = 0;

      while (queueIndex < queue.length) {
        const position = queue[queueIndex++];

        const x = position % width;
        const y = Math.floor(position / width);

        // Make outside background transparent
        pixels[position * 4 + 3] = 0;

        addPixel(x + 1, y);
        addPixel(x - 1, y);
        addPixel(x, y + 1);
        addPixel(x, y - 1);
      }

      ctx.putImageData(imageData, 0, 0);

      setReady(true);
    };

    img.src = logo;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Noor"
      className={className}
      draggable={false}
      style={{
        width: size,
        height: size,
        display: ready ? "block" : "none",
        objectFit: "contain",
        objectPosition: "center",
        maxWidth: "100%",
        maxHeight: "100%",
        flexShrink: 0,
      }}
    />
  );
}
