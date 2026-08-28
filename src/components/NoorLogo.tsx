import React from "react";

interface NoorLogoProps {
  size?: number | string;
  className?: string;
}

const NoorLogo: React.FC<NoorLogoProps> = ({
  size = 180,
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Noor"
      preserveAspectRatio="xMidYMid meet"
      style={{
        display: "block",
        background: "transparent",
        maxWidth: "100%",
        height: "auto",
      }}
    >
      <defs>
        <linearGradient
          id="noorGoldMain"
          x1="40"
          y1="40"
          x2="460"
          y2="460"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6B3D05" />
          <stop offset="12%" stopColor="#B87412" />
          <stop offset="28%" stopColor="#FFE9A3" />
          <stop offset="45%" stopColor="#D28A13" />
          <stop offset="62%" stopColor="#FFF3B5" />
          <stop offset="78%" stopColor="#B56A08" />
          <stop offset="100%" stopColor="#704000" />
        </linearGradient>

        <linearGradient
          id="noorGoldHighlight"
          x1="100"
          y1="30"
          x2="390"
          y2="470"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFF9D0" />
          <stop offset="35%" stopColor="#F8CD62" />
          <stop offset="70%" stopColor="#A75D08" />
          <stop offset="100%" stopColor="#FFE28B" />
        </linearGradient>

        <filter
          id="noorShadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="3"
            dy="7"
            stdDeviation="5"
            floodColor="#000000"
            floodOpacity="0.45"
          />
        </filter>

        <filter
          id="noorGlow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="3" result="blur" />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        fill="none"
        stroke="url(#noorGoldMain)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#noorShadow)"
      >
        {/* Outer sweeping stroke */}
        <path
          d="
            M70 390
            C48 330 57 254 100 190
            C135 138 183 108 238 55
            C195 117 171 173 166 231
            C161 294 180 348 226 390
            C271 431 331 443 394 414
          "
          strokeWidth="18"
        />

        {/* Bottom crescent sweep */}
        <path
          d="
            M73 404
            C126 467 232 486 334 446
            C399 420 437 372 454 306
            C445 383 405 437 342 469
            C244 519 123 479 70 410
          "
          strokeWidth="15"
        />

        {/* Tall central stroke */}
        <path
          d="
            M228 58
            C208 122 201 180 209 233
            C217 287 243 332 285 364
            C321 392 355 409 387 427
          "
          strokeWidth="27"
        />

        {/* Second vertical stroke */}
        <path
          d="
            M286 45
            C267 110 264 176 280 231
            C294 282 323 323 365 351
          "
          strokeWidth="25"
        />

        {/* Right flowing stroke */}
        <path
          d="
            M345 62
            C332 116 342 165 376 205
            C410 245 441 282 427 331
            C419 361 397 382 371 395
          "
          strokeWidth="24"
        />

        {/* Right inner loop */}
        <path
          d="
            M389 186
            C424 209 440 244 430 275
            C421 301 399 312 379 295
            C360 279 364 244 389 218
          "
          strokeWidth="17"
        />

        {/* Left central curve */}
        <path
          d="
            M78 270
            C103 233 138 213 176 209
            C144 230 128 260 128 294
            C130 336 159 364 205 366
          "
          strokeWidth="22"
        />

        {/* Central lower wave */}
        <path
          d="
            M143 325
            C180 299 212 279 246 276
            C227 309 223 339 241 365
            C259 392 288 405 323 403
          "
          strokeWidth="20"
        />

        {/* Bottom signature flourish */}
        <path
          d="
            M155 407
            C206 438 275 440 329 416
            C356 405 376 391 392 377
          "
          strokeWidth="18"
        />
      </g>

      {/* Metallic highlights */}
      <g
        fill="none"
        stroke="url(#noorGoldHighlight)"
        strokeLinecap="round"
        opacity="0.9"
      >
        <path
          d="M231 67 C217 130 216 199 233 257"
          strokeWidth="3"
        />

        <path
          d="M289 55 C280 116 282 179 299 229"
          strokeWidth="3"
        />

        <path
          d="M349 74 C346 122 362 167 390 204"
          strokeWidth="3"
        />

        <path
          d="M92 401 C151 449 239 458 320 431"
          strokeWidth="2.5"
        />
      </g>

      {/* Calligraphy dots */}
      <g
        fill="url(#noorGoldMain)"
        filter="url(#noorGlow)"
      >
        <ellipse
          cx="160"
          cy="180"
          rx="7"
          ry="11"
          transform="rotate(30 160 180)"
        />

        <ellipse
          cx="178"
          cy="162"
          rx="6"
          ry="10"
          transform="rotate(30 178 162)"
        />

        <ellipse
          cx="322"
          cy="119"
          rx="7"
          ry="11"
          transform="rotate(-25 322 119)"
        />

        <ellipse
          cx="341"
          cy="137"
          rx="6"
          ry="10"
          transform="rotate(-25 341 137)"
        />

        <circle cx="388" cy="175" r="7" />
        <circle cx="406" cy="188" r="5" />
      </g>

      {/* Small elegant flourishes */}
      <g
        fill="none"
        stroke="url(#noorGoldMain)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="
            M108 214
            C84 198 77 177 90 158
            C102 177 106 194 108 214
          "
          strokeWidth="8"
        />

        <path
          d="
            M371 152
            C389 126 407 114 426 118
            C414 137 396 150 371 152
          "
          strokeWidth="7"
        />

        <path
          d="
            M335 367
            C354 342 374 329 396 333
          "
          strokeWidth="7"
        />
      </g>
    </svg>
  );
};

export default NoorLogo;
