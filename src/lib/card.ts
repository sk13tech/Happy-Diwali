import { sanitizeName } from "./wish";

/**
 * Renders a personalized 16:9 Happy Diwali greeting card (1280×720, JPG):
 * the festive photo (diyas + fireworks) as the base, a cinematic scrim,
 * then shimmer-gold Hindi typography with the sender's name.
 * Falls back to a fully procedural scene if the photo can't load.
 */

const W = 1280;
const H = 720;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

/** Marigold (genda phool) — rings of petals, drawn with rotated ellipses. */
function drawMarigold(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  R: number,
  palette: { outer: string; mid: string; inner: string; core: string }
) {
  ctx.save();
  ctx.translate(cx, cy);
  // soft halo
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.5);
  halo.addColorStop(0, "rgba(255,160,70,0.4)");
  halo.addColorStop(1, "rgba(255,160,70,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, R * 1.5, 0, Math.PI * 2);
  ctx.fill();

  const ring = (count: number, r: number, rx: number, ry: number, fill: string, offset: number) => {
    ctx.fillStyle = fill;
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * i) / count + offset);
      ctx.beginPath();
      ctx.ellipse(0, -r, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };
  ring(16, R * 0.62, R * 0.2, R * 0.34, palette.outer, 0);
  ring(12, R * 0.44, R * 0.17, R * 0.26, palette.mid, 0.26);
  ring(9, R * 0.28, R * 0.13, R * 0.18, palette.inner, 0.17);
  ctx.fillStyle = palette.core;
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffdf8e";
  ctx.beginPath();
  ctx.arc(-R * 0.03, -R * 0.03, R * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ---------------- procedural fallback artwork ---------------- */

function drawBurst(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, hue: string) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 0.5);
  glow.addColorStop(0, "rgba(255,246,220,0.55)");
  glow.addColorStop(1, "rgba(255,200,120,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  const rays = 46;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + rand(-0.05, 0.05);
    const len = r * rand(0.45, 1);
    const sx = x + Math.cos(a) * r * 0.08;
    const sy = y + Math.sin(a) * r * 0.08;
    const ex = x + Math.cos(a) * len;
    const ey = y + Math.sin(a) * len;
    const grad = ctx.createLinearGradient(sx, sy, ex, ey);
    grad.addColorStop(0, hue);
    grad.addColorStop(1, "rgba(255,220,160,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = rand(1.4, 2.8);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.fillStyle = hue;
    ctx.beginPath();
    ctx.arc(ex, ey, rand(1, 2.4), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawDiya(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.save();
  const halo = ctx.createRadialGradient(cx, cy - s * 0.72, 0, cx, cy - s * 0.72, s * 1.15);
  halo.addColorStop(0, "rgba(255,190,90,0.35)");
  halo.addColorStop(1, "rgba(255,150,60,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy - s * 0.72, s * 1.15, 0, Math.PI * 2);
  ctx.fill();
  const f = ctx.createRadialGradient(cx, cy - s * 0.52, s * 0.04, cx, cy - s * 0.6, s * 0.5);
  f.addColorStop(0, "#fffbe8");
  f.addColorStop(0.45, "#ffd76a");
  f.addColorStop(1, "#ff7b2e");
  ctx.fillStyle = f;
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 1.28);
  ctx.bezierCurveTo(cx - s * 0.34, cy - s * 0.86, cx - s * 0.3, cy - s * 0.6, cx, cy - s * 0.42);
  ctx.bezierCurveTo(cx + s * 0.3, cy - s * 0.6, cx + s * 0.34, cy - s * 0.86, cx, cy - s * 1.28);
  ctx.fill();
  ctx.strokeStyle = "#2a0a16";
  ctx.lineWidth = s * 0.07;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 0.42);
  ctx.lineTo(cx, cy - s * 0.3);
  ctx.stroke();
  const bowl = ctx.createLinearGradient(cx, cy - s * 0.3, cx, cy + s * 0.62);
  bowl.addColorStop(0, "#a63d52");
  bowl.addColorStop(1, "#3f0d22");
  ctx.fillStyle = bowl;
  ctx.beginPath();
  ctx.moveTo(cx - s, cy - s * 0.3);
  ctx.quadraticCurveTo(cx - s * 0.92, cy + s * 0.52, cx, cy + s * 0.6);
  ctx.quadraticCurveTo(cx + s * 0.92, cy + s * 0.52, cx + s, cy - s * 0.3);
  ctx.quadraticCurveTo(cx + s * 0.5, cy - s * 0.24, cx, cy - s * 0.24);
  ctx.quadraticCurveTo(cx - s * 0.5, cy - s * 0.24, cx - s, cy - s * 0.3);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,215,120,0.85)";
  ctx.lineWidth = s * 0.06;
  ctx.beginPath();
  ctx.moveTo(cx - s, cy - s * 0.3);
  ctx.quadraticCurveTo(cx, cy - s * 0.52, cx + s, cy - s * 0.3);
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + s * 0.72, s * 1.05, s * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawProceduralScene(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a0518");
  bg.addColorStop(0.55, "#150a2c");
  bg.addColorStop(1, "#241031");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = `rgba(255,238,200,${rand(0.06, 0.5).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(rand(20, W - 20), rand(16, H * 0.72), rand(0.5, 1.6), 0, Math.PI * 2);
    ctx.fill();
  }

  const earth = ctx.createRadialGradient(W / 2, H + 60, 40, W / 2, H + 60, 620);
  earth.addColorStop(0, "rgba(255,140,55,0.32)");
  earth.addColorStop(1, "rgba(255,140,55,0)");
  ctx.fillStyle = earth;
  ctx.fillRect(0, 0, W, H);

  drawBurst(ctx, W * 0.17, H * 0.24, 150, "rgba(255,196,92,0.95)");
  drawBurst(ctx, W * 0.83, H * 0.2, 135, "rgba(255,110,150,0.9)");
  drawBurst(ctx, W * 0.62, H * 0.1, 95, "rgba(120,180,255,0.85)");
  drawBurst(ctx, W * 0.38, H * 0.08, 70, "rgba(150,235,170,0.75)");

  const dy = H - 96;
  drawDiya(ctx, W * 0.16, dy, 56);
  drawDiya(ctx, W * 0.34, dy + 10, 68);
  drawDiya(ctx, W * 0.5, dy, 80);
  drawDiya(ctx, W * 0.66, dy + 10, 68);
  drawDiya(ctx, W * 0.84, dy, 56);
}

/* ---------------- the card ---------------- */

export async function makeWishCard(rawName: string): Promise<File | null> {
  const name = sanitizeName(rawName) || "आपके अपने";
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // make sure display fonts are ready for canvas text
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('400 116px "Yatra One"'),
        document.fonts.load('400 46px "Tiro Devanagari Hindi"'),
        document.fonts.load('700 26px "Cinzel Decorative"'),
        document.fonts.load('500 24px "Outfit"'),
      ]),
      new Promise((r) => setTimeout(r, 1400)),
    ]);
  } catch {
    /* graceful font fallback */
  }

  /* ---- base: the real festive Diwali photo (with procedural fallback) ---- */
  const baseUrl = `${import.meta.env.BASE_URL}og-diwali.jpg`;
  const photo = await loadImage(baseUrl);

  if (photo) {
    // cover-fit 16:9
    const scale = Math.max(W / photo.width, H / photo.height);
    const dw = photo.width * scale;
    const dh = photo.height * scale;
    ctx.drawImage(photo, (W - dw) / 2, (H - dh) / 2, dw, dh);

    // cinematic scrim so typography sits cleanly over the fireworks
    const scrim = ctx.createLinearGradient(0, 0, 0, H * 0.66);
    scrim.addColorStop(0, "rgba(7,3,15,0.78)");
    scrim.addColorStop(0.55, "rgba(7,3,15,0.5)");
    scrim.addColorStop(1, "rgba(7,3,15,0)");
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, W, H * 0.66);

    const foot = ctx.createLinearGradient(0, H * 0.72, 0, H);
    foot.addColorStop(0, "rgba(7,3,15,0)");
    foot.addColorStop(1, "rgba(7,3,15,0.55)");
    ctx.fillStyle = foot;
    ctx.fillRect(0, H * 0.72, W, H * 0.28);
  } else {
    drawProceduralScene(ctx);
  }

  /* ---- text ---- */
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // small caps line
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "10px";
  } catch {
    /* older engines */
  }
  ctx.fillStyle = "rgba(255,215,140,0.7)";
  ctx.font = '700 26px "Cinzel Decorative", serif';
  ctx.fillText("HAPPY DIWALI", W / 2, 112);
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
  } catch {
    /* ignore */
  }

  // title
  const titleGrad = ctx.createLinearGradient(0, 150, 0, 290);
  titleGrad.addColorStop(0, "#fff3c9");
  titleGrad.addColorStop(0.55, "#f8b84e");
  titleGrad.addColorStop(1, "#dd9527");
  ctx.shadowColor = "rgba(255,170,60,0.6)";
  ctx.shadowBlur = 36;
  ctx.fillStyle = titleGrad;
  ctx.font = '400 116px "Yatra One", "Tiro Devanagari Hindi", serif';
  ctx.fillText("शुभ दीपावली", W / 2, 232);
  ctx.shadowBlur = 0;

  // personalized message — auto-fit width
  const msg = `आप सभी को ${name} की तरफ से`;
  let size = 46;
  ctx.font = `400 ${size}px "Tiro Devanagari Hindi", serif`;
  while (ctx.measureText(msg).width > W - 200 && size > 28) {
    size -= 2;
    ctx.font = `400 ${size}px "Tiro Devanagari Hindi", serif`;
  }
  ctx.fillStyle = "rgba(255,246,228,0.95)";
  ctx.shadowColor = "rgba(0,0,0,0.65)";
  ctx.shadowBlur = 10;
  ctx.fillText(msg, W / 2, 350);
  ctx.fillStyle = "#ffe9b0";
  ctx.fillText("ढेर सारी शुभकामनाएं", W / 2, 410);
  ctx.shadowBlur = 0;

  // divider sparks flanked by marigolds
  ctx.fillStyle = "rgba(255,190,90,0.85)";
  for (let i = -1; i <= 1; i++) {
    const cx2 = W / 2 + i * 56;
    ctx.save();
    ctx.translate(cx2, 458);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();
  }
  drawMarigold(ctx, W / 2 - 132, 458, 30, { outer: "#f9a03f", mid: "#ffb347", inner: "#ffd76a", core: "#d95d12" });
  drawMarigold(ctx, W / 2 + 132, 458, 30, { outer: "#f4551f", mid: "#ff7a33", inner: "#ffab52", core: "#b13c08" });

  // festive flower clusters celebrating the frame corners
  drawMarigold(ctx, 74, 82, 40, { outer: "#f9a03f", mid: "#ffb347", inner: "#ffd76a", core: "#d95d12" });
  drawMarigold(ctx, 122, 60, 26, { outer: "#f4551f", mid: "#ff7a33", inner: "#ffab52", core: "#b13c08" });
  drawMarigold(ctx, W - 74, 82, 40, { outer: "#ffb84d", mid: "#ffcf6b", inner: "#ffe9a8", core: "#e07b16" });
  drawMarigold(ctx, W - 122, 60, 26, { outer: "#f9a03f", mid: "#ffb347", inner: "#ffd76a", core: "#d95d12" });
  drawMarigold(ctx, 82, H - 84, 34, { outer: "#f4551f", mid: "#ff7a33", inner: "#ffab52", core: "#b13c08" });
  drawMarigold(ctx, W - 82, H - 84, 34, { outer: "#f9a03f", mid: "#ffb347", inner: "#ffd76a", core: "#d95d12" });

  // domain footer
  ctx.fillStyle = "rgba(255,232,190,0.62)";
  ctx.font = '500 24px "Outfit", sans-serif';
  ctx.fillText(window.location.host || "diwali-wishes", W / 2, H - 38);

  /* ---- ornate frame ---- */
  const frame = ctx.createLinearGradient(0, 0, W, H);
  frame.addColorStop(0, "rgba(248,184,78,0.75)");
  frame.addColorStop(0.5, "rgba(255,233,176,0.3)");
  frame.addColorStop(1, "rgba(255,123,46,0.7)");
  ctx.strokeStyle = frame;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(22, 22, W - 44, H - 44);
  ctx.strokeStyle = "rgba(248,184,78,0.25)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(34, 34, W - 68, H - 68);

  /* ---- to file ---- */
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.92));
  if (!blob) return null;
  return new File([blob], "shubh-diwali-wish.jpg", { type: "image/jpeg" });
}
