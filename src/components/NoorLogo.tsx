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
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, width, height);
      const pixels = data.data;

      /*
       * Detect the REAL background directly from
       * the corners of the uploaded logo image.
       */
      const cornerPoints = [
        [0, 0],
        [width - 1, 0],
        [0, height - 1],
        [width - 1, height - 1],
      ];

      let bgR = 0;
      let bgG = 0;
      let bgB = 0;

      for (const [x, y] of cornerPoints) {
        const i = (y * width + x) * 4;

        bgR += pixels[i];
        bgG += pixels[i + 1];
        bgB += pixels[i + 2];
      }

      bgR /= cornerPoints.length;
      bgG /= cornerPoints.length;
      bgB /= cornerPoints.length;

      /*
       * Flood fill ONLY the outside background.
       * This means dark areas INSIDE the Noor emblem
       * will not be removed.
       */

      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      const colorDifference = (i: number) => {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        return (
          Math.abs(r - bgR) +
          Math.abs(g - bgG) +
          Math.abs(b - bgB)
        );
      };

      /*
       * Higher tolerance because the screenshot/image
       * background may have slight gradients/compression.
       */
      const BACKGROUND_TOLERANCE = 85;

      const isBackground = (position: number) => {
        const i = position * 4;

        // Already transparent
        if (pixels[i + 3] === 0) return true;

        return colorDifference(i) <= BACKGROUND_TOLERANCE;
      };

      const add = (x: number, y: number) => {
        if (
          x < 0 ||
          y < 0 ||
          x >= width ||
          y >= height
        ) {
          return;
        }

        const position = y * width + x;

        if (visited[position]) return;

        if (!isBackground(position)) return;

        visited[position] = 1;
        queue.push(position);
      };

      // Start from all four edges
      for (let x = 0; x < width; x++) {
        add(x, 0);
        add(x, height - 1);
      }

      for (let y = 0; y < height; y++) {
        add(0, y);
        add(width - 1, y);
      }

      // Flood fill
      let index = 0;

      while (index < queue.length) {
        const position = queue[index++];

        const x = position % width;
        const y = Math.floor(position / width);

        // Make this pixel transparent
        pixels[position * 4 + 3] = 0;

        add(x + 1, y);
        add(x - 1, y);
        add(x, y + 1);
        add(x, y - 1);
      }

      ctx.putImageData(data, 0, 0);

      setReady(true);
    };

    img.src = logo;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Noor — Islamic Daily Companion"
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
