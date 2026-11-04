import { useEffect, useRef, useState } from "react";
import { Megaphone, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { adGuardAllowsDisplay, noteAdEngagement } from "@/lib/adGuard";
import { cn } from "@/utils/cn";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Google AdSense — layout-safe AND fraud-protected:
 *  · Async + lazy: ad script loads only when the slot nears the viewport
 *  · Reserved min-height => zero CLS
 *  · Invalid-traffic guard (src/lib/adGuard.ts) decides whether OUR OWN
 *    container renders at all — bots, click-bombers and hyper-frequent
 *    viewers simply never receive ads. The ad itself is never touched,
 *    intercepted or obscured, which keeps this fully policy-compliant.
 *
 * Configure via .env (see .env.example) and update public/ads.txt:
 *   VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 *   VITE_ADSENSE_SLOT=1234567890
 */

const CLIENT = (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined) ?? "";
const SLOT = (import.meta.env.VITE_ADSENSE_SLOT as string | undefined) ?? "";

export default function AdUnit({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const configured = Boolean(CLIENT && SLOT);

  /* ---- invalid-traffic gate: run once on mount ---- */
  useEffect(() => {
    setAllowed(adGuardAllowsDisplay());
  }, []);

  /* ---- lazy fetch: only when the slot approaches the viewport ---- */
  useEffect(() => {
    if (!configured || !allowed) return;
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [configured, allowed]);

  /* ---- inject adsbygoogle once visible ---- */
  useEffect(() => {
    if (!nearViewport || !configured || !allowed || pushed.current) return;
    pushed.current = true;

    if (!document.querySelector("script[data-diwali-adsense]")) {
      const s = document.createElement("script");
      s.async = true;
      s.crossOrigin = "anonymous";
      s.dataset.diwaliAdsense = "true";
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      document.head.appendChild(s);
    }
    const push = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* ad-blockers may throw — layout stays untouched */
      }
    };
    setTimeout(push, 60);
  }, [nearViewport, configured, allowed]);

  /* ---- passive click-bomb watch ----
     A real ad interaction moves window focus into the cross-origin ad
     iframe, which fires window blur. We only COUNT these; ads are never
     intercepted. Repeated hits mute the slot for 24h for this visitor. */
  useEffect(() => {
    if (!configured || !allowed) return;
    const onBlur = () => {
      const active = document.activeElement;
      if (active instanceof HTMLIFrameElement && hostRef.current?.contains(active)) {
        if (noteAdEngagement()) setAllowed(false);
      }
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [configured, allowed]);

  /* bots / click-bombers / over-frequency visitors -> collapse entirely */
  if (configured && allowed === false) return null;

  return (
    <Reveal className={cn("mx-auto max-w-4xl px-5 sm:px-8", className)}>
      <section data-no-burst aria-label="Advertisement" className="py-4">
        <p className="mb-2.5 flex items-center justify-center gap-1.5 text-center text-[10px] font-medium tracking-[0.4em] text-gold-200/30 uppercase">
          विज्ञापन · Advertisement
          {configured && allowed === true && (
            <ShieldCheck className="h-3 w-3 text-emerald-400/50" aria-label="fraud-protected" />
          )}
        </p>
        <div
          ref={hostRef}
          className={cn(
            "relative flex min-h-[130px] items-center justify-center overflow-hidden rounded-3xl",
            configured
              ? "border border-gold-500/15 bg-[#0d0719]/90 p-4"
              : "border border-dashed border-gold-500/25 bg-gradient-to-br from-gold-500/[0.05] via-transparent to-rosee-500/[0.06] p-6"
          )}
        >
          {configured ? (
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6009446949965887"
     crossorigin="anonymous"></script>
<!-- Ads1 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-6009446949965887"
     data-ad-slot="3400335638"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
          ) : (
            <div className="flex items-center gap-2.5 text-center">
              <Megaphone className="h-4 w-4 shrink-0 text-gold-400/60" />
              <p className="text-xs tracking-[0.2em] text-gold-200/35 uppercase">
                Sponsored space — AdSense ready · fraud-guarded · zero layout shift
              </p>
            </div>
          )}
        </div>
      </section>
    </Reveal>
  );
}
