/**
 * Lightweight content-protection deterrents.
 *
 * Honest scope: browsers ultimately control the rendered page, so nothing
 * client-side can stop a determined developer (devtools menus, wget, etc.).
 * These guards block the *casual* vectors — right-click, view-source, save,
 * print-to-PDF, drag-copy — which stops 99% of copycats while keeping the
 * name input and the generated link fully usable.
 */

const WHITELIST = "input, textarea, [contenteditable=''], [contenteditable='true'], [data-allow-copy]";

function isWhitelisted(e: Event): boolean {
  return e.target instanceof HTMLElement && Boolean(e.target.closest(WHITELIST));
}

export function initProtection(): () => void {
  /* ---- 1. No right-click menu (inputs & the link row stay right-clickable) ---- */
  const onContextMenu = (e: MouseEvent) => {
    if (isWhitelisted(e)) return;
    e.preventDefault();
  };

  /* ---- 2. Block save / source / print / devtools shortcuts ---- */
  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    const mod = e.ctrlKey || e.metaKey;
    const blocked =
      e.key === "F12" || // devtools
      (mod && k === "s") || // save page / save as
      (mod && k === "u") || // view source
      (mod && k === "p") || // print (print-to-PDF = downloading the site)
      (mod && e.shiftKey && ["i", "j", "c", "k"].includes(k)) || // devtools panels
      (mod && e.altKey && ["i", "j", "c"].includes(k)); // macOS devtools
    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  /* ---- 3. No drag-n-copy of media/elements ---- */
  const onDragStart = (e: DragEvent) => {
    if (isWhitelisted(e)) return;
    e.preventDefault();
  };

  /* ---- 4. Kill long-press callout on touch devices ---- */
  const onTouchCallout = (e: Event) => {
    if (isWhitelisted(e)) return;
    e.preventDefault();
  };

  window.addEventListener("contextmenu", onContextMenu);
  window.addEventListener("keydown", onKeyDown, { capture: true });
  window.addEventListener("dragstart", onDragStart);
  window.addEventListener("webkitcontextmenu" as unknown as string, onTouchCallout);

  /* ---- 5. Console deterrent ---- */
  try {
    console.log(
      "%c🛡 शुभ दीपावली — Protected",
      "color:#f8b84e;font-size:18px;font-weight:bold;padding:4px 0"
    );
    console.log(
      "%cThis experience is guarded. Please don't copy or clone — build your own light ✦",
      "color:#ffe9b0;font-size:12px"
    );
  } catch {
    /* no console */
  }

  return () => {
    window.removeEventListener("contextmenu", onContextMenu);
    window.removeEventListener("keydown", onKeyDown, { capture: true });
    window.removeEventListener("dragstart", onDragStart);
    window.removeEventListener("webkitcontextmenu" as unknown as string, onTouchCallout);
  };
}
