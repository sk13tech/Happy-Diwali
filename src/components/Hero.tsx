import { ChevronDown, Sparkles } from "lucide-react";
import Diya, { MiniFlame } from "./Diya";
import Rangoli from "./Rangoli";

type Props = {
  name: string;
  fromUrl: boolean;
};

export default function Hero({ name, fromUrl }: Props) {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-28 text-center"
    >
      {/* one soft halo — clean, not noisy */}
      <div className="pointer-events-none absolute -top-56 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,140,60,0.13),transparent_62%)]" />
      <Rangoli
        className="absolute top-1/2 left-1/2 w-[min(115vw,780px)] -translate-x-1/2 -translate-y-1/2"
        opacity={0.24}
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        {/* badge */}
        <div className="rise" style={{ animationDelay: "0.1s" }}>
          <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.28em] text-gold-300 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-ember-500" />
            दीपावली महोत्सव
            <span className="text-gold-500/50">·</span>
            Festival of Lights
          </span>
        </div>

        {/* headline */}
        <div className="glow-wrap mt-9" data-no-burst>
          <h1
            className="rise font-yatra text-shimmer text-[clamp(3.2rem,12.5vw,8.25rem)] leading-[1.08]"
            style={{ animationDelay: "0.3s" }}
          >
            शुभ दीपावली
          </h1>
        </div>
        <p
          className="rise font-cinzel mt-5 text-[clamp(0.8rem,2.4vw,1.1rem)] font-bold tracking-[0.55em] text-gold-200/85"
          style={{ animationDelay: "0.45s" }}
        >
          HAPPY&nbsp;DIWALI
        </p>

        {/* personalized message — the heart of the page */}
        <div className="rise mt-10 w-full max-w-2xl" style={{ animationDelay: "0.6s" }}>
          <div className="glass-card relative overflow-hidden rounded-3xl px-6 py-8 sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />
            {fromUrl && (
              <p className="relative mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold-500/25 bg-gold-500/[0.08] px-3.5 py-1 text-[10px] tracking-[0.25em] text-gold-300 uppercase">
                <Sparkles className="h-3 w-3" />
                विशेष रूप से आपके लिए
              </p>
            )}
            <p className="font-hindi relative text-[clamp(1.3rem,4.3vw,1.95rem)] leading-[1.75] text-amber-50">
              आप सभी को{" "}
              <span
                className="font-yatra text-shimmer px-0.5 text-[1.2em] whitespace-normal"
                style={{ overflowWrap: "anywhere" }}
              >
                {name}
              </span>{" "}
              की तरफ से
              <br />
              ढेर सारी शुभकामनाएं
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/60" />
              <MiniFlame className="h-6 w-5" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
            </div>
            <p className="mt-4 text-[13px] tracking-wide text-gold-200/50 sm:text-sm">
              May the festival of lights fill your home with joy &amp; prosperity
            </p>
          </div>
        </div>

      </div>

      {/* diya trio anchoring the fold */}
      <div
        className="rise pointer-events-none absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-end gap-7 opacity-95"
        style={{ animationDelay: "1.05s" }}
      >
        <Diya lit className="h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20" flameDur={2.9} />
        <Diya lit className="float-y h-20 w-20 sm:h-24 sm:w-24" flameDur={2.5} />
        <Diya lit className="h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20" flameDur={3.1} />
      </div>

      {/* scroll cue */}
      <a
        href="#wishes"
        aria-label="नीचे देखें"
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-gold-400/60 transition-colors hover:text-gold-300"
      >
        <ChevronDown className="bounce-soft h-5 w-5" />
      </a>
    </section>
  );
}
