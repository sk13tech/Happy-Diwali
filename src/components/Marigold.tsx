import { useMemo, type CSSProperties } from "react";
import { cn } from "@/utils/cn";

/**
 * Procedural genda-phool (marigold) + toran garland —
 * the classic Diwali doorway decoration, drawn in pure SVG.
 */

type Tone = "gold" | "ember" | "sunset";

const PALETTES: Record<Tone, { outer: string; mid: string; inner: string; core: string }> = {
  gold: { outer: "#f9a03f", mid: "#ffb347", inner: "#ffd76a", core: "#d95d12" },
  ember: { outer: "#f4551f", mid: "#ff7a33", inner: "#ffab52", core: "#b13c08" },
  sunset: { outer: "#ffb84d", mid: "#ffcf6b", inner: "#ffe9a8", core: "#e07b16" },
};

function PetalRing({
  count,
  r,
  rx,
  ry,
  fill,
  offset = 0,
}: {
  count: number;
  r: number;
  rx: number;
  ry: number;
  fill: string;
  offset?: number;
}) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-r}
          rx={rx}
          ry={ry}
          fill={fill}
          transform={`rotate(${(360 / count) * i + offset})`}
        />
      )),
    [count, r, rx, ry, fill, offset]
  );
  return <g>{petals}</g>;
}

export function FlowerShape({ tone = "gold" }: { tone?: Tone }) {
  const p = PALETTES[tone];
  return (
    <g>
      <circle r={40} fill={p.outer} opacity={0.22} />
      <PetalRing count={16} r={27} rx={9.5} ry={20} fill={p.outer} />
      <PetalRing count={12} r={19} rx={8.5} ry={15} fill={p.mid} offset={15} />
      <PetalRing count={9} r={12} rx={6.5} ry={10.5} fill={p.inner} offset={10} />
      <circle r={7.5} fill={p.core} />
      <circle r={3.4} cx={-1.2} cy={-1.2} fill="#ffdf8e" opacity={0.9} />
    </g>
  );
}

/** Standalone marigold flower. */
export default function Marigold({
  className,
  style,
  tone = "gold",
}: {
  className?: string;
  style?: CSSProperties;
  tone?: Tone;
}) {
  return (
    <svg viewBox="-45 -45 90 90" className={cn("select-none", className)} style={style} aria-hidden="true">
      <FlowerShape tone={tone} />
    </svg>
  );
}

/** Hanging toran — marigolds + mango leaves strung on a gently swaying thread. */
export function Toran({ className }: { className?: string }) {
  const items = useMemo(() => {
    // matches the thread path: M0 16 Q 600 112 1200 16
    const pt = (t: number) => {
      const x = 2 * (1 - t) * t * 600 + t * t * 1200;
      const y = (1 - t) * (1 - t) * 16 + 2 * (1 - t) * t * 112 + t * t * 16;
      return { x, y };
    };
    const N = 11;
    return Array.from({ length: N }, (_, i) => {
      const t = (i + 1) / (N + 1);
      const { x, y } = pt(t);
      return {
        x,
        y,
        hang: i % 2 === 0 ? 20 : 30,
        scale: i % 3 === 0 ? 1 : i % 3 === 1 ? 0.82 : 0.66,
        tone: (["gold", "ember", "sunset"] as Tone[])[i % 3],
        leaves: i % 2 === 0,
      };
    });
  }, []);

  return (
    <svg
      viewBox="0 0 1200 178"
      preserveAspectRatio="xMidYMin meet"
      className={cn("pointer-events-none w-full select-none", className)}
      aria-hidden="true"
    >
      {/* the sagging thread */}
      <path d="M0 16 Q 600 112 1200 16" fill="none" stroke="rgba(120,72,32,0.85)" strokeWidth="3" />
      <path d="M0 16 Q 600 112 1200 16" fill="none" stroke="rgba(255,214,130,0.4)" strokeWidth="1.1" />

      {items.map((it, i) => (
        <g key={i} transform={`translate(${it.x} ${it.y})`}>
          {/* hanging thread */}
          <line x1="0" y1="0" x2="0" y2={it.hang} stroke="rgba(120,72,32,0.8)" strokeWidth="2" />
          {/* mango leaves */}
          {it.leaves && (
            <g transform={`translate(0 ${it.hang * 0.45})`}>
              <path d="M0 0 Q -14 -4 -24 8 Q -13 13 0 4 Z" fill="#3f7d3a" transform="rotate(-18)" />
              <path d="M0 0 Q 14 -4 24 8 Q 13 13 0 4 Z" fill="#4c8f45" transform="rotate(18)" />
              <path d="M0 2 Q -11 0 -18 10 Q -9 13 0 7 Z" fill="#58a34f" opacity={0.85} transform="rotate(-30)" />
              <path d="M0 2 Q 11 0 18 10 Q 9 13 0 7 Z" fill="#3b7434" opacity={0.9} transform="rotate(30)" />
            </g>
          )}
          {/* the flower */}
          <g transform={`translate(0 ${it.hang + 24}) scale(${it.scale})`}>
            <FlowerShape tone={it.tone} />
          </g>
        </g>
      ))}
    </svg>
  );
}
