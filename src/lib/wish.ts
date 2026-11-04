export const DEFAULT_NAME = "आपके अपने";
export const MAX_NAME = 28;

/** Trim, collapse whitespace, strip unsafe chars, cap length. */
export function sanitizeName(raw: string): string {
  return raw.replace(/\s+/g, " ").replace(/[<>"'`]/g, "").trim().slice(0, MAX_NAME);
}

/* ---------- short, name-hidden urls ----------
   The name rides inside a URL-safe base64 token. It is written into BOTH
   the query (?w=) and the hash (#w=), and read back from search, hash or a
   raw regex over the whole href — so chat apps / in-app browsers / redirect
   chains that strip one location can never lose the name. */

function toB64Url(text: string): string {
  try {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

function fromB64Url(code: string): string {
  try {
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const bin = atob(padded);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

/** Pull the w-token from wherever it survived: ?query, #hash, or raw href. */
function readToken(): string {
  if (typeof window === "undefined") return "";
  const { search, hash, href } = window.location;

  try {
    const v = new URLSearchParams(search).get("w");
    if (v) return v.trim();
  } catch {
    /* noop */
  }

  try {
    const h = hash.replace(/^#/, "");
    const q = h.includes("?") ? h.slice(h.indexOf("?") + 1) : h;
    const v = new URLSearchParams(q).get("w");
    if (v) return v.trim();
  } catch {
    /* noop */
  }

  try {
    const m = href.match(/[?#&]w=([A-Za-z0-9_=-]+)/);
    if (m?.[1]) return m[1];
  } catch {
    /* noop */
  }

  return "";
}

/** Legacy plain-text params, also from search / hash / raw href. */
function readLegacy(): string {
  if (typeof window === "undefined") return "";
  const keys = ["from", "name", "n"];
  try {
    const p = new URLSearchParams(window.location.search);
    for (const k of keys) {
      const v = p.get(k);
      if (v) return sanitizeName(decodeURIComponent(v));
    }
  } catch {
    /* noop */
  }
  try {
    const h = window.location.hash.replace(/^#/, "");
    const q = h.includes("?") ? h.slice(h.indexOf("?") + 1) : "";
    if (q) {
      const hp = new URLSearchParams(q);
      for (const k of keys) {
        const v = hp.get(k);
        if (v) return sanitizeName(decodeURIComponent(v));
      }
    }
  } catch {
    /* noop */
  }
  try {
    const m = window.location.href.match(/[?#&](?:from|name|n)=([^&#]+)/);
    if (m?.[1]) return sanitizeName(decodeURIComponent(m[1].replace(/\+/g, " ")));
  } catch {
    /* noop */
  }
  return "";
}

/** Read the wisher's name from the URL. */
export function getWisherFromUrl(): { name: string; fromUrl: boolean } {
  if (typeof window === "undefined") return { name: DEFAULT_NAME, fromUrl: false };

  const token = readToken();
  if (token) {
    const decoded = sanitizeName(fromB64Url(token));
    if (decoded) return { name: decoded, fromUrl: true };
  }

  const legacy = readLegacy();
  if (legacy) return { name: legacy, fromUrl: true };

  return { name: DEFAULT_NAME, fromUrl: false };
}

/** Build a shareable greeting URL — token duplicated into query + hash for maximum survivability. */
export function buildWishUrl(name: string): string {
  const token = toB64Url(sanitizeName(name));
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?w=${token}#w=${token}`;
}

/** Message sent along when sharing. */
export function shareText(name: string, url: string): string {
  return `✦ शुभ दीपावली ✦\n${sanitizeName(name)} की तरफ से आपके लिए एक ख़ास दिवाली greeting है —\n${url}`;
}
