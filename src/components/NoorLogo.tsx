import React from "react";

interface NoorLogoProps {
  size?: number | string;
  className?: string;
  title?: string;
}

export default function NoorLogo({
  size = 160,
  className = "",
  title = "Noor — Islamic Daily Companion",
}: NoorLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
      style={{
        display: "block",
        maxWidth: "100%",
        height: "auto",
      }}
    >
      <defs>
        {/* ================= GOLD METALLIC GRADIENT ================= */}

        <linearGradient
          id="noorGold"
          x1="70"
          y1="40"
          x2="440"
          y2="500"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7A5719" />
          <stop offset="12%" stopColor="#D8B85D" />
          <stop offset="28%" stopColor="#FFF1A8" />
          <stop offset="42%" stopColor="#B98A2D" />
          <stop offset="58%" stopColor="#F6DB7E" />
          <stop offset="76%" stopColor="#8D641D" />
          <stop offset="90%" stopColor="#E7C766" />
          <stop offset="100%" stopColor="#6E4D18" />
        </linearGradient>

        <linearGradient
          id="noorSoftGold"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#FFF5B5" />
          <stop offset="50%" stopColor="#D4AE4E" />
          <stop offset="100%" stopColor="#806020" />
        </linearGradient>

        {/* ================= PREMIUM GLOW ================= */}

        <filter
          id="goldGlow"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur
            stdDeviation="5"
            result="blur"
          />

          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0.4
              0 1 0 0 0.3
              0 0 1 0 0.05
              0 0 0 0.65 0
            "
            result="goldBlur"
          />

          <feMerge>
            <feMergeNode in="goldBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter
          id="softShadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="7"
            floodColor="#000000"
            floodOpacity="0.45"
          />
        </filter>

        {/* ================= ARCH CLIP ================= */}

        <clipPath id="archClip">
          <path d="M110 360V210C110 105 175 55 256 25C337 55 402 105 402 210V360" />
        </clipPath>
      </defs>

      {/* ============================================================
          SOFT OUTER GLOW
      ============================================================ */}

      <g opacity="0.42" filter="url(#goldGlow)">
        <path
          d="
            M92 380
            V210
            C92 95 166 43 256 10
            C346 43 420 95 420 210
            V380
            C420 450 364 500 256 548
            C148 500 92 450 92 380
            Z
          "
          stroke="url(#noorGold)"
          strokeWidth="16"
        />
      </g>

      {/* ============================================================
          MAIN EMBLEM
      ============================================================ */}

      <g filter="url(#softShadow)">
        {/* OUTER ARCH */}

        <path
          d="
            M92 380
            V210
            C92 95 166 43 256 10
            C346 43 420 95 420 210
            V380
            C420 450 364 500 256 548
            C148 500 92 450 92 380
            Z
          "
          stroke="url(#noorGold)"
          strokeWidth="10"
          strokeLinejoin="round"
        />

        {/* INNER ARCH */}

        <path
          d="
            M130 350
            V215
            C130 130 181 88 256 58
            C331 88 382 130 382 215
            V350
          "
          stroke="url(#noorGold)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* CENTRAL INNER ARCH */}

        <path
          d="
            M164 345
            V230
            C164 165 201 128 256 103
            C311 128 348 165 348 230
            V345
          "
          stroke="url(#noorGold)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* BOTTOM FOUNDATION */}

        <path
          d="
            M92 365
            C150 382 199 390 256 390
            C313 390 362 382 420 365
          "
          stroke="url(#noorGold)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>

      {/* ============================================================
          ISLAMIC GEOMETRIC PATTERN
      ============================================================ */}

      <g
        clipPath="url(#archClip)"
        stroke="url(#noorSoftGold)"
        strokeWidth="2.4"
        opacity="0.78"
      >
        {/* LEFT SIDE GEOMETRIC MOTIFS */}

        <g transform="translate(120 135)">
          {[0, 42, 84, 126, 168].map((y) => (
            <g key={`left-${y}`} transform={`translate(0 ${y})`}>
              <path d="M0 20 L20 0 L40 20 L20 40 Z" />
              <path d="M0 20 H40 M20 0 V40" />
              <circle cx="20" cy="20" r="10" />
            </g>
          ))}
        </g>

        {/* RIGHT SIDE GEOMETRIC MOTIFS */}

        <g transform="translate(352 135)">
          {[0, 42, 84, 126, 168].map((y) => (
            <g key={`right-${y}`} transform={`translate(0 ${y})`}>
              <path d="M0 20 L20 0 L40 20 L20 40 Z" />
              <path d="M0 20 H40 M20 0 V40" />
              <circle cx="20" cy="20" r="10" />
            </g>
          ))}
        </g>

        {/* TOP STAR PATTERNS */}

        {[155, 205, 307, 357].map((x) => (
          <g key={x}>
            <path
              d={`
                M${x} 115
                L${x + 10} 135
                L${x + 30} 145
                L${x + 10} 155
                L${x} 175
                L${x - 10} 155
                L${x - 30} 145
                L${x - 10} 135
                Z
              `}
            />
          </g>
        ))}
      </g>

      {/* ============================================================
          INNER BORDER DETAILS
      ============================================================ */}

      <g
        stroke="url(#noorSoftGold)"
        strokeWidth="2"
        opacity="0.75"
      >
        <path d="M115 205 Q150 90 256 38 Q362 90 397 205" />

        <path d="M143 210 Q175 125 256 82 Q337 125 369 210" />

        <path d="M105 360 Q180 382 256 382 Q332 382 407 360" />
      </g>

      {/* ============================================================
          CENTRAL NOOR CALLIGRAPHY
          Original stylized Arabic-inspired نور
      ============================================================ */}

      <g
        fill="url(#noorGold)"
        stroke="url(#noorGold)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#goldGlow)"
      >
        {/* MAIN SWEEP */}

        <path
          d="
            M143 303
            C174 296 202 283 218 262
            C233 242 236 211 235 177

            C245 195 254 215 266 232
            C282 255 302 270 330 281

            C311 302 282 320 244 327
            C204 334 170 323 143 303
            Z
          "
          strokeWidth="2"
        />

        {/* TALL CENTRAL STROKE */}

        <path
          d="
            M232 177
            C222 215 214 250 222 280
            C227 299 243 309 261 305
            C277 301 289 288 296 274
          "
          fill="none"
          strokeWidth="13"
        />

        {/* RIGHT CURVED LETTER */}

        <path
          d="
            M297 210
            C322 220 340 244 346 270
            C349 286 344 301 330 307
          "
          fill="none"
          strokeWidth="15"
        />

        {/* RIGHT LONG TAIL */}

        <path
          d="
            M345 306
            C337 322 335 340 342 350
          "
          fill="none"
          strokeWidth="8"
        />

        {/* LEFT CURVED ACCENT */}

        <path
          d="
            M198 256
            C180 258 165 271 165 287
          "
          fill="none"
          strokeWidth="10"
        />

        {/* CENTRAL LOWER CURVE */}

        <path
          d="
            M250 304
            C258 327 282 337 306 329
          "
          fill="none"
          strokeWidth="9"
        />

        {/* CALLIGRAPHIC DOTS */}

        <circle cx="273" cy="157" r="8" />
        <circle cx="286" cy="177" r="7" />
        <circle cx="191" cy="270" r="6" />
      </g>

      {/* ============================================================
          CALLIGRAPHY HIGHLIGHTS
      ============================================================ */}

      <g
        stroke="#FFF3B4"
        strokeLinecap="round"
        opacity="0.72"
      >
        <path
          d="M243 188 C237 220 234 247 239 267"
          strokeWidth="2.5"
        />

        <path
          d="M303 219 C318 230 327 246 331 260"
          strokeWidth="2.5"
        />

        <path
          d="M160 300 C186 297 206 289 220 275"
          strokeWidth="2"
        />
      </g>

      {/* ============================================================
          LOWER DIVIDER
      ============================================================ */}

      <path
        d="M132 395 H380"
        stroke="url(#noorGold)"
        strokeWidth="3"
        opacity="0.75"
      />

      {/* ============================================================
          NOOR BRAND NAME
      ============================================================ */}

      <text
        x="256"
        y="465"
        textAnchor="middle"
        fill="url(#noorGold)"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="76"
        fontWeight="500"
        letterSpacing="12"
        filter="url(#goldGlow)"
      >
        NOOR
      </text>

      {/* ============================================================
          SUBTITLE
      ============================================================ */}

      <text
        x="256"
        y="492"
        textAnchor="middle"
        fill="#D8B95D"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="13"
        fontWeight="400"
        letterSpacing="1.4"
        opacity="0.92"
      >
        Islamic Daily Companion
      </text>

      {/* ============================================================
          BOTTOM INNER LINE
      ============================================================ */}

      <path
        d="
          M145 505
          C177 518 213 528 256 540
          C299 528 335 518 367 505
        "
        stroke="url(#noorGold)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}
