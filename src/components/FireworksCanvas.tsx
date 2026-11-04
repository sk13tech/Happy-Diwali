import { useEffect, useRef } from "react";

/**
 * Realistic fireworks sky:
 *  · Velocity-aligned streak trails (motion-blur look) instead of dots
 *  · Shell types like real shows: peony (sphere), willow (long drooping gold),
 *    brocade (gold + white crackle micro-sparks), ring (perfect circle)
 *  · White-hot ignition flash at burst point
 *  · Weighted gold/silver palette like professional pyrotechnics
 * */

type RGB = [number, number, number];

const PAL = {
  gold: [
    [255, 224, 150],
    [255, 196, 92],
    [236, 166, 62],
  ] as RGB[],
  silver: [
    [255, 255, 255],
    [226, 236, 255],
    [192, 204, 255],
  ] as RGB[],
  rose: [
    [255, 112, 140],
    [238, 70, 108],
    [255, 176, 192],
  ] as RGB[],
  green: [
    [122, 236, 150],
    [70, 210, 118],
    [192, 255, 208],
  ] as RGB[],
  blue: [
    [112, 172, 255],
    [82, 122, 255],
    [192, 216, 255],
  ] as RGB[],
  purple: [
    [192, 142, 255],
    [152, 102, 255],
    [232, 208, 255],
  ] as RGB[],
  ember: [
    [255, 168, 92],
    [255, 122, 60],
    [255, 214, 160],
  ] as RGB[],
};

const COLORFUL: RGB[][] = [PAL.gold, PAL.gold, PAL.rose, PAL.blue, PAL.green, PAL.purple, PAL.ember, PAL.silver];

type Shell = "peony" | "willow" | "brocade" | "ring";

type Rocket = { x: number; y: number; px: number; py: number; vx: number; vy: number; targetY: number; shell: Shell; palette: RGB[] };

type Spark = {
  x: number; y: number; px: number; py: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: RGB; size: number;
  drag: number; grav: number;
  flicker: boolean; phase: number;
  crackle: number; head: boolean;
};

type Flash = { x: number; y: number; life: number; maxLife: number; r: number };
type Star = { x: number; y: number; r: number; phase: number; speed: number };
type Ember = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; hue: RGB; r: number };

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]): T => arr[(Math.random() * arr.length) | 0];

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 640;
    const low = (navigator.hardwareConcurrency ?? 8) <= 4;
    const power = small || low ? 0.6 : 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    let w = 0, h = 0, raf = 0;
    let running = true, inView = true;
    let last = performance.now();
    let nextLaunch = performance.now() + 700;
    let starPhase = 0;

    let rockets: Rocket[] = [];
    let sparks: Spark[] = [];
    let flashes: Flash[] = [];
    let stars: Star[] = [];
    let embers: Ember[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(100, Math.floor((w * h) / 16000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.9,
        r: rand(0.35, 1.3),
        phase: rand(0, 6.28),
        speed: rand(0.5, 1.9),
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const shellPalette = (shell: Shell): RGB[] =>
      shell === "willow" || shell === "brocade"
        ? Math.random() < 0.85
          ? PAL.gold
          : PAL.silver
        : pick(COLORFUL);

    const burstSpec = (shell: Shell) => {
      switch (shell) {
        case "willow":
          return { count: 66 * power, speed: rand(4.6, 5.6), spread: 0.1, life: [130, 195], size: [1.5, 2.3], drag: 0.9935, grav: 0.052, crackleEach: 0 };
        case "brocade":
          return { count: 72 * power, speed: rand(4.9, 5.9), spread: 0.12, life: [115, 175], size: [1.5, 2.2], drag: 0.992, grav: 0.055, crackleEach: 2 };
        case "ring":
          return { count: 62 * power, speed: rand(5.4, 5.5), spread: 0.015, life: [70, 105], size: [1.3, 2.0], drag: 0.984, grav: 0.05, crackleEach: 0 };
        default: // peony
          return { count: 92 * power, speed: rand(6.2, 7.1), spread: 0.42, life: [55, 100], size: [1.4, 2.3], drag: 0.9835, grav: 0.048, crackleEach: 0.5 };
      }
    };

    const makeSpark = (x: number, y: number, angle: number, speed: number, spec: ReturnType<typeof burstSpec>, shell: Shell, palette: RGB[]): Spark => ({
      x, y, px: x, py: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: rand(spec.life[0], spec.life[1]),
      color: shell === "ring" ? pick(palette) : pick(palette),
      size: rand(spec.size[0], spec.size[1]),
      drag: spec.drag,
      grav: spec.grav,
      flicker: shell === "brocade" ? true : Math.random() < 0.3,
      phase: rand(0, 6.28),
      crackle: spec.crackleEach > 0 && Math.random() < spec.crackleEach ? 2 : 0,
      head: true,
    });

    const explodeAt = (x: number, y: number, shell: Shell, palette: RGB[], scale = 1) => {
      if (sparks.length > 1150) return;
      const spec = burstSpec(shell);
      const count = Math.round(spec.count * scale);
      flashes.push({ x, y, life: 0, maxLife: 11, r: rand(26, 40) * (1.6 * Math.min(1, scale + 0.4)) });
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + rand(-0.04, 0.04);
        // uniform ring speed -> crisp circle · jittered speed -> full sphere
        const speed = shell === "ring" ? spec.speed : spec.speed * (1 - spec.spread + Math.random() * spec.spread * 2);
        sparks.push(makeSpark(x, y, angle, speed * scale, spec, shell, palette));
      }
    };

    const launch = (tx?: number, ty?: number) => {
      if (sparks.length > 1150) return;
      const shell: Shell = Math.random() < 0.4 ? "peony" : Math.random() < 0.5 ? "willow" : Math.random() < 0.5 ? "brocade" : "ring";
      const x = tx ?? rand(w * 0.14, w * 0.86);
      rockets.push({
        x, y: h + 12, px: x, py: h + 12,
        vx: rand(-0.4, 0.4),
        vy: -(rand(10.2, 12.8) * (h > 700 ? 1 : 0.86)),
        targetY: ty ?? rand(h * 0.13, h * 0.45),
        shell,
        palette: shellPalette(shell),
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(2.2, (now - last) / 16.7);
      last = now;
      if (!running || !inView) return;

      // long afterglow -> trails fade like lingering smoke-light
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.155)";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      // twinkling stars
      starPhase += 0.011 * dt;
      for (const s of stars) {
        const a = 0.13 + 0.42 * Math.abs(Math.sin(starPhase * s.speed + s.phase));
        ctx.fillStyle = `rgba(255,238,200,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // rising embers
      if (Math.random() < 0.13) {
        embers.push({ x: rand(w * 0.1, w * 0.9), y: h + 4, vx: rand(-0.2, 0.2), vy: rand(-0.85, -0.4), life: 0, maxLife: rand(170, 320), hue: pick(PAL.gold), r: rand(0.7, 1.6) });
      }
      embers = embers.filter((e) => e.life < e.maxLife && e.y > -10);
      for (const e of embers) {
        e.life += dt;
        e.x += e.vx * dt + Math.sin((e.life + e.maxLife) * 0.02) * 0.16;
        e.y += e.vy * dt;
        const t = 1 - e.life / e.maxLife;
        ctx.fillStyle = `rgba(${e.hue[0]},${e.hue[1]},${e.hue[2]},${(0.4 * t).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ignition flashes
      flashes = flashes.filter((f) => {
        f.life += dt;
        const k = f.life / f.maxLife;
        if (k >= 1) return false;
        const r = f.r * (1 - (1 - k) * (1 - k));
        const a = Math.pow(1 - k, 2) * 0.85;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        g.addColorStop(0, `rgba(255,250,225,${a})`);
        g.addColorStop(0.45, `rgba(255,214,140,${(a * 0.5).toFixed(3)})`);
        g.addColorStop(1, "rgba(255,180,80,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // rockets — comet-streak ascent
      rockets = rockets.filter((r) => {
        r.px = r.x; r.py = r.y;
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        r.vy += 0.055 * dt;

        const [cr, cg, cb] = r.palette[1];
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.55)`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(r.px, r.py + 16);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,246,220,0.95)";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.7, 0, Math.PI * 2);
        ctx.fill();

        if (r.vy > -1.3 || r.y <= r.targetY) {
          explodeAt(r.x, r.y, r.shell, r.palette);
          // authentic double-break
          if (r.shell === "peony" && Math.random() < 0.22) {
            const sx = r.x + rand(-46, 46);
            const sy = r.y + rand(-8, 48);
            const pal = r.palette;
            setTimeout(() => { if (running && inView) explodeAt(sx, sy, "peony", pal, 0.55); }, 430);
          }
          return false;
        }
        return true;
      });

      // sparks — velocity streaks with gravity droop + crackle
      sparks = sparks.filter((s) => {
        s.life += dt;
        if (s.life >= s.maxLife) return false;
        const k = s.life / s.maxLife;

        s.px = s.x; s.py = s.y;
        const dragK = Math.pow(s.drag, dt);
        s.vx *= dragK;
        s.vy = s.vy * dragK + s.grav * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // white micro-crackles pop near end of life
        if (s.crackle > 0 && k > 0.45 && Math.random() < 0.075 && sparks.length < 1200) {
          s.crackle--;
          const a = Math.random() * Math.PI * 2;
          sparks.push({ x: s.x, y: s.y, px: s.x, py: s.y, vx: Math.cos(a) * rand(0.3, 1.3), vy: Math.sin(a) * rand(0.3, 1.3), life: 0, maxLife: rand(8, 16), color: [255, 250, 236], size: rand(0.8, 1.2), drag: 0.96, grav: 0.02, flicker: false, phase: 0, crackle: 0, head: true });
        }

        let alpha = Math.pow(1 - k, 1.15);
        if (s.flicker) alpha *= k > 0.5 ? 0.35 + 0.65 * Math.abs(Math.sin(s.life * 0.8 + s.phase)) : 1;

        const [r, g, b] = s.color;
        // streak body
        ctx.strokeStyle = `rgba(${r},${g},${b},${(alpha * 0.82).toFixed(3)})`;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.px - s.vx * 0.4, s.py - s.vy * 0.4);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        // brighter head
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.3, s.size * 0.6), 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      if (now > nextLaunch) {
        launch();
        if (Math.random() < 0.32) setTimeout(() => running && inView && launch(), 240);
        nextLaunch = now + (power < 1 ? rand(1500, 2600) : rand(800, 1500));
      }
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      running = !document.hidden;
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) last = performance.now();
    }, { threshold: 0 });
    io.observe(canvas);

    if (reduced) {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.fillStyle = "rgba(255,238,200,0.5)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
