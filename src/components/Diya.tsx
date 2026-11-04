import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";

/**
 * Hand-drawn SVG diya (oil lamp) with a layered, flickering flame.
 * Gradients live in <DiyaDefs /> — render it once near the app root.
 */

export function DiyaDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="diya-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc857" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#ff9a3d" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#ff7b2e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diya-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a63d52" />
          <stop offset="45%" stopColor="#7c2440" />
          <stop offset="100%" stopColor="#3f0d22" />
        </linearGradient>
        <linearGradient id="diya-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dd9527" />
          <stop offset="28%" stopColor="#ffe9b0" />
          <stop offset="55%" stopColor="#f8b84e" />
          <stop offset="100%" stopColor="#a06a1a" />
        </linearGradient>
        <radialGradient id="flame-outer" cx="50%" cy="72%" r="72%">
          <stop offset="0%" stopColor="#ffe28a" />
          <stop offset="45%" stopColor="#ffb451" />
          <stop offset="100%" stopColor="#ff6a1f" />
        </radialGradient>
        <radialGradient id="flame-inner" cx="50%" cy="75%" r="70%">
          <stop offset="0%" stopColor="#fffbe8" />
          <stop offset="60%" stopColor="#ffe795" />
          <stop offset="100%" stopColor="#ffcf5e" />
        </radialGradient>
      </defs>
    </svg>
  );
}

type Props = {
  lit?: boolean;
  className?: string;
  style?: CSSProperties;
  flameDur?: number;
  onClick?: () => void;
  ariaLabel?: string;
};

export default function Diya({ lit = true, className, style, flameDur = 2.8, onClick, ariaLabel }: Props) {
  return (
    <svg
      viewBox="0 0 120 132"
      className={cn("select-none", onClick && "cursor-pointer outline-none", className)}
      style={{ ...style, ["--flame-dur" as string]: `${flameDur}s` }}
      onClick={onClick}
      role={onClick ? "button" : "img"}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={ariaLabel ?? (lit ? "जलता हुआ दीया" : "बुझा दीया")}
    >
      {/* warm halo */}
      <circle
        cx="60"
        cy="42"
        r="52"
        fill="url(#diya-glow)"
        className="flame-glow transition-opacity duration-700"
        opacity={lit ? 1 : 0}
      />
      {/* ground shadow */}
      <ellipse cx="60" cy="121" rx="38" ry="5.5" fill="#000" opacity="0.42" />

      {/* flame */}
      <g
        className="transition-all duration-700"
        style={{ opacity: lit ? 1 : 0, transformOrigin: "60px 62px", transform: lit ? "scale(1)" : "scale(0.35) translateY(16px)" }}
      >
        <g className={lit ? "flame" : undefined}>
          <path
            d="M60 16 C 51.5 30 46.5 38.5 46.5 48 a13.5 13.5 0 0 0 27 0 C 73.5 38.5 68.5 30 60 16 Z"
            fill="url(#flame-outer)"
          />
          <path
            className={lit ? "flame-inner" : undefined}
            d="M60 34 C 56 40.5 54 44.5 54 50 a6.5 6.5 0 0 0 13 0 C 67 44.5 64 40.5 60 34 Z"
            fill="url(#flame-inner)"
          />
        </g>
      </g>

      {/* wick */}
      <line x1="60" y1="58" x2="60" y2="69" stroke="#2a0a16" strokeWidth="3.4" strokeLinecap="round" />

      {/* bowl */}
      <g className="transition-[filter] duration-700" style={{ filter: lit ? "brightness(1)" : "brightness(0.62)" }}>
        <path
          d="M12 74 Q 15 112 60 117.5 Q 105 112 108 74 Q 84 64 60 64.5 Q 36 64 12 74 Z"
          fill="url(#diya-bowl)"
        />
        {/* rim */}
        <path
          d="M12 74 Q 36 64 60 64.5 Q 84 64 108 74 Q 84 82.5 60 82 Q 36 82.5 12 74 Z"
          fill="url(#diya-rim)"
        />
        {/* inner well */}
        <ellipse cx="60" cy="73.4" rx="40" ry="6.4" fill="#4a1020" opacity="0.9" />
        <ellipse cx="60" cy="72.4" rx="33" ry="4.6" fill="#2c0a18" />
        {/* oil sheen */}
        <ellipse cx="60" cy="72.2" rx="24" ry="3" fill="#b96a3c" opacity={lit ? 0.5 : 0.2} className="transition-opacity duration-700" />
        {/* decorative dots */}
        {[-1, 0, 1].map((i) => (
          <circle key={i} cx={60 + i * 26} cy={100 - (i === 0 ? 0 : 4)} r="2.4" fill="#f8b84e" opacity="0.75" />
        ))}
        <path
          d="M30 100 Q 60 108 90 100"
          stroke="#ff9d5e"
          strokeWidth="1.6"
          fill="none"
          opacity="0.55"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Tiny single-flame mark for logos / dividers. */
export function MiniFlame({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 30" className={cn("select-none", className)} style={style} aria-hidden="true">
      <g className="flame" style={{ ["--flame-dur" as string]: "2.6s" }}>
        <path d="M12 1.5 C 8.8 6.5 7 9.2 7 13 a5 5 0 0 0 10 0 C 17 9.2 15.2 6.5 12 1.5 Z" fill="url(#flame-outer)" />
        <path d="M12 9 C 10.6 11 10 12.2 10 14 a2.4 2.4 0 0 0 4.8 0 C 14.8 12.2 13.4 11 12 9 Z" fill="url(#flame-inner)" className="flame-inner" />
      </g>
      <line x1="12" y1="19" x2="12" y2="23" stroke="#2a0a16" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2.5 23.5 Q 4.5 29 12 29.5 Q 19.5 29 21.5 23.5 Q 16.5 22 12 22.2 Q 7.5 22 2.5 23.5 Z" fill="url(#diya-bowl)" />
      <path d="M2.5 23.5 Q 7.5 22 12 22.2 Q 16.5 22 21.5 23.5 Q 16.5 25 12 24.8 Q 7.5 25 2.5 23.5 Z" fill="url(#diya-rim)" />
    </svg>
  );
}
