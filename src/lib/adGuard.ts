/**
 * AdSense invalid-traffic guard (client-side, policy-compliant).
 *
 * IMPORTANT — how this stays compliant:
 * We NEVER intercept, overlay, alter, or measure the ad itself.
 * Google forbids touching ad behavior — so instead this module only decides
 * whether *our own ad container* should be inserted into the page at all.
 * If risk is detected, the slot simply isn't rendered for that visitor.
 * This is the same pattern used by established ad-manager plugins
 * (e.g. click-fraud protection in Advanced Ads / Ad Inserter).
 *
 * Three lightweight signals:
 *   1. Automation/bot fingerprints  -> never serve ads
 *   2. Impression frequency cap     -> limits repeated ad views per visitor
 *   3. Click-bomb mute              -> repeated ad engagements within 2h
 *      => ads suppressed for that visitor for 24h
 *
 * Worst case on a false positive: one visitor simply doesn't see an ad.
 */

const CLICK_KEY = "dw_adv_clk";
const VIEW_KEY = "dw_adv_view";

const HOUR = 3_600_000;
const ENGAGE_WINDOW = 2 * HOUR;
const MAX_ENGAGEMENTS = 3; // >3 ad engagements in 2h = suspicious
const VIEW_WINDOW = 6 * HOUR;
const MAX_VIEWS = 8; // max ad impressions per visitor per 6h
const MUTE_FOR = 24 * HOUR;

type ClickStore = { at: number[]; muteUntil: number };

function readClicks(): ClickStore {
  try {
    const raw = localStorage.getItem(CLICK_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<ClickStore>;
      return {
        at: Array.isArray(p.at) ? p.at.filter((t) => typeof t === "number") : [],
        muteUntil: typeof p.muteUntil === "number" ? p.muteUntil : 0,
      };
    }
  } catch {
    /* private mode etc. */
  }
  return { at: [], muteUntil: 0 };
}

function writeClicks(s: ClickStore) {
  try {
    localStorage.setItem(CLICK_KEY, JSON.stringify(s));
  } catch {
    /* storage blocked */
  }
}

/** Strong automation fingerprints only (avoid false positives). */
export function looksAutomated(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (navigator.webdriver) return true; // Selenium / Puppeteer / Playwright flag
    const ua = navigator.userAgent || "";
    if (/headlesschrome|phantomjs|slimerjs/i.test(ua)) return true;
    if (w.callPhantom || w._phantom || w.__nightmare) return true; // PhantomJS / Nightmare
  } catch {
    return true; // if we can't even inspect, don't risk the account
  }
  return false;
}

/** True while a click-bomb mute is active. */
export function isMuted(): boolean {
  const now = Date.now();
  const s = readClicks();
  return Boolean(s.muteUntil && now < s.muteUntil);
}

/**
 * Records an ad engagement detected via window-blur + focused-iframe.
 * Returns true once the mute threshold is crossed (caller hides the slot).
 */
export function noteAdEngagement(): boolean {
  const now = Date.now();
  const s = readClicks();
  s.at = s.at.filter((t) => now - t < ENGAGE_WINDOW);
  s.at.push(now);
  if (s.at.length > MAX_ENGAGEMENTS) {
    s.muteUntil = now + MUTE_FOR;
    writeClicks(s);
    return true;
  }
  writeClicks(s);
  return isMuted();
}

/** Frequency-cap counting; returns false when the cap was already hit. */
function viewBudgetOk(): boolean {
  const now = Date.now();
  let at: number[] = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(VIEW_KEY) || "[]");
    if (Array.isArray(parsed)) at = parsed.filter((t) => typeof t === "number");
  } catch {
    /* noop */
  }
  at = at.filter((t) => now - t < VIEW_WINDOW);
  if (at.length >= MAX_VIEWS) return false;
  at.push(now);
  try {
    localStorage.setItem(VIEW_KEY, JSON.stringify(at));
  } catch {
    /* noop */
  }
  return true;
}

/** Master check — run before inserting the ad container. */
export function adGuardAllowsDisplay(): boolean {
  if (looksAutomated()) return false;
  if (isMuted()) return false;
  return viewBudgetOk();
}
