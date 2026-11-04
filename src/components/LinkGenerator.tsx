import { useEffect, useMemo, useState } from "react";
import { Check, ImageDown, Link2, Loader2, PartyPopper, Share2, Sparkles } from "lucide-react";
import { buildWishUrl, sanitizeName, shareText, MAX_NAME } from "@/lib/wish";
import { makeWishCard } from "@/lib/card";
import Reveal from "./Reveal";
import { cn } from "@/utils/cn";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type ShareState = "idle" | "building" | "done";

export default function LinkGenerator() {
  const [name, setName] = useState("");
  const [shareState, setShareState] = useState<ShareState>("idle");

  const cleanName = useMemo(() => sanitizeName(name), [name]);
  const url = cleanName ? buildWishUrl(cleanName) : "";
  const ready = Boolean(url);

  useEffect(() => {
    if (shareState !== "done") return;
    const id = setTimeout(() => setShareState("idle"), 2200);
    return () => clearTimeout(id);
  }, [shareState]);

  /* WhatsApp — message + link via wa.me */
  const shareWhatsApp = () => {
    if (!url) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText(cleanName, url))}`, "_blank", "noopener");
  };

  /* Optimized share — festive 16:9 card image + message + link in one tap */
  const shareWithCard = async () => {
    if (!url || shareState === "building") return;
    setShareState("building");
    const text = shareText(cleanName, url);
    try {
      const file = await makeWishCard(cleanName);

      if (file && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text, title: "शुभ दीपावली" });
      } else if (navigator.share) {
        await navigator.share({ text, title: "शुभ दीपावली" });
        if (file) download(file);
      } else {
        // desktop without share API — hand over the card + message
        if (file) download(file);
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* clipboard blocked */
        }
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      }
      setShareState("done");
    } catch {
      setShareState("idle"); // user dismissed — stay calm
    }
  };

  const download = (file: File) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  return (
    <section id="create" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 sm:px-8">
      <Reveal className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/[0.06] px-4 py-1.5 text-[11px] font-medium tracking-[0.3em] text-gold-300 uppercase">
          <PartyPopper className="h-3.5 w-3.5" />
          अब आपकी बारी
        </span>
        <h2 className="font-yatra mt-5 text-4xl text-gold-200 sm:text-5xl">
          अपना <span className="text-shimmer">शुभकामना लिंक</span> बनाएं
        </h2>
        <p className="font-hindi mx-auto mt-4 max-w-md text-base leading-relaxed text-amber-100/60">
          नाम लिखिए — greeting card, message और लिंक तीनों तैयार। एक टैप में दोस्तों को भेजिए।
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div className="glass-card mx-auto mt-12 w-full max-w-2xl overflow-hidden rounded-[2rem] p-6 sm:p-9">
          {/* name input */}
          <label htmlFor="wishName" className="font-hindi block text-sm font-medium text-gold-300">
            आपका नाम · Your Name
          </label>
          <div className="relative mt-3">
            <input
              id="wishName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME}
              placeholder="आरव शर्मा · Aarav Sharma"
              autoComplete="name"
              className="font-hindi w-full rounded-2xl border border-gold-500/20 bg-night-950/60 px-5 py-4 text-lg text-amber-50 transition-all duration-300 outline-none placeholder:text-gold-200/25 focus:border-gold-400/60 focus:shadow-[0_0_0_4px_rgba(248,184,78,0.1)]"
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[11px] text-white/25 tabular-nums">
              {name.length}/{MAX_NAME}
            </span>
          </div>

          {/* live preview */}
          <div className="font-hindi mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-[15px] leading-relaxed text-amber-100/75">
            <span className="text-gold-200/45">Preview — </span>
            आप सभी को{" "}
            <span className={cn("font-yatra", ready ? "text-shimmer" : "text-white/30")} style={{ overflowWrap: "anywhere" }}>
              {cleanName || "आपका नाम"}
            </span>{" "}
            की तरफ से ढेर सारी शुभकामनाएं
          </div>

          {/* generated link — stays selectable & right-clickable for easy copying */}
          {ready && (
            <div
              data-allow-copy
              className="mt-5 flex min-w-0 items-center gap-3 rounded-2xl border border-gold-500/25 bg-gradient-to-r from-gold-500/[0.07] to-transparent px-4 py-3"
            >
              <Link2 className="h-4 w-4 shrink-0 text-gold-400" />
              <p className="min-w-0 flex-1 truncate font-mono text-[13px] text-gold-200">{url}</p>
            </div>
          )}

          {/* actions */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* WhatsApp */}
            <button
              onClick={shareWhatsApp}
              disabled={!ready}
              className={cn(
                "inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300",
                ready
                  ? "bg-[#25D366] text-[#062b16] shadow-[0_8px_32px_rgba(37,211,102,0.3)] hover:scale-[1.02] hover:shadow-[0_8px_44px_rgba(37,211,102,0.45)] active:scale-95"
                  : "cursor-not-allowed bg-white/[0.05] text-white/25"
              )}
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="font-hindi text-[15px]">WhatsApp पर भेजें</span>
            </button>

            {/* Share with image card */}
            <button
              onClick={shareWithCard}
              disabled={!ready}
              className={cn(
                "inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300",
                !ready && "cursor-not-allowed bg-white/[0.05] text-white/25",
                ready &&
                  shareState === "building" &&
                  "bg-gradient-to-r from-gold-600 via-gold-500 to-ember-500 text-night-950 opacity-80",
                ready &&
                  shareState === "idle" &&
                  "bg-gradient-to-r from-gold-600 via-gold-500 to-ember-500 text-night-950 shadow-[0_8px_32px_rgba(248,184,78,0.35)] hover:scale-[1.02] hover:shadow-[0_8px_44px_rgba(248,184,78,0.5)] active:scale-95",
                ready && shareState === "done" && "bg-emerald-400 text-emerald-950 shadow-[0_8px_32px_rgba(52,211,153,0.35)]"
              )}
            >
              {shareState === "building" ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : shareState === "done" ? (
                <Check className="h-4.5 w-4.5" />
              ) : (
                <Share2 className="h-4.5 w-4.5" />
              )}
              <span className="font-hindi text-[15px]">
                {shareState === "building" ? "कार्ड बन रहा है…" : shareState === "done" ? "तैयार!" : "कार्ड सहित Share"}
              </span>
            </button>
          </div>

          <p className="font-hindi mt-5 flex items-center justify-center gap-1.5 text-center text-[12px] text-gold-200/40">
            <ImageDown className="h-3.5 w-3.5 shrink-0 text-gold-500/50" />
            Share पर 16:9 greeting image + message + लिंक — तीनों एक साथ जाते हैं
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-500/50" />
          </p>
        </div>
      </Reveal>
    </section>
  );
}
