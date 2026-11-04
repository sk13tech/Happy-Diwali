import { useMemo, type CSSProperties } from "react";
import { cn } from "@/utils/cn";

const TAU = Math.PI * 2;

/**
 * Procedurally generated rangoli mandala — layered petals, diamonds and dots
 * slowly rotating in opposite directions. Pure SVG, zero images.
 */
export default function Rangoli({
  className,
  style,
  opacity = 0.5,
  spinClass = "spin-slower",
}: {
  className?: string;
  style?: CSSProperties;
  opacity?: number;
  spinClass?: string;
}) {
  const rings = useMemo(() => {
    const petal = (r: number, rx: number, ry: number, count: number, fill: string, extra?: string) =>
      Array.from({ length: count }, (_, i) => (
        <ellipse
          key={`p${r}-${rx}-${i}`}
          cx={0}
          cy={-r}
          rx={rx}
          ry={ry}
          fill={fill}
          transform={`rotate(${(360 / count) * i})`}
          {...(extra ? { stroke: extra, strokeWidth: 0.8 } : {})}
        />
      ));
    const dots = (r: number, dot: number, count: number, fill: string) =>
      Array.from({ length: count }, (_, i) => (
        <circle
          key={`d${r}-${count}-${i}`}
          cx={Math.cos((TAU / count) * i) * r}
          cy={Math.sin((TAU / count) * i) * r}
          r={dot}
          fill={fill}
        />
      ));
    const diamonds = (r: number, w: number, hgt: number, count: number, fill: string) =>
      Array.from({ length: count }, (_, i) => (
        <path
          key={`m${r}-${i}`}
          d={`M0 ${-r - hgt} L ${w} ${-r} L 0 ${-r + hgt} L ${-w} ${-r} Z`}
          fill={fill}
          transform={`rotate(${(360 / count) * i + 360 / count / 2})`}
        />
      ));
    return { petal, dots, diamonds };
  }, []);

  const { petal, dots, diamonds } = rings;

  return (
    <svg
      viewBox="-130 -130 260 260"
      className={cn("pointer-events-none select-none", className)}
      style={{ ...style, opacity }}
      aria-hidden="true"
    >
      <g className={spinClass} style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}>
        <circle r={126} fill="none" stroke="#f8b84e" strokeWidth="1" strokeDasharray="2 7" opacity="0.9" />
        {petal(112, 11, 20, 24, "rgba(255,123,46,0.16)", "rgba(255,123,46,0.5)")}
        {dots(94, 1.6, 48, "rgba(255,233,176,0.8)")}
        {petal(82, 13, 26, 16, "rgba(255,77,141,0.14)", "rgba(255,77,141,0.45)")}
      </g>
      <g className="spin-slower-rev" style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}>
        {diamonds(60, 7, 15, 16, "rgba(248,184,78,0.34)")}
        {petal(48, 10, 19, 12, "rgba(255,215,106,0.2)", "rgba(248,184,78,0.6)")}
        <circle r={34} fill="none" stroke="#f8b84e" strokeWidth="1.1" opacity="0.8" />
        {dots(27, 2.1, 12, "rgba(255,158,88,0.9)")}
      </g>
      <circle r={15} fill="rgba(255,183,77,0.25)" />
      <circle r={9} fill="rgba(255,233,176,0.85)" />
      <circle r={3.6} fill="#ff7b2e" />
    </svg>
  );
}
