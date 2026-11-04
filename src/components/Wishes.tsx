import { Coins, Flame, HeartHandshake, Quote, Sparkles } from "lucide-react";
import Rangoli from "./Rangoli";
import Reveal from "./Reveal";
import Marigold from "./Marigold";

const WISHES = [
  {
    icon: Flame,
    color: "text-ember-500",
    ring: "from-ember-500/40 to-ember-500/5",
    titleHi: "रोशनी",
    lineHi: "हर दीया आपके जीवन का रास्ता उजियारे से भर दे।",
    lineEn: "May every flame illuminate the path ahead of you.",
  },
  {
    icon: Sparkles,
    color: "text-gold-400",
    ring: "from-gold-500/40 to-gold-500/5",
    titleHi: "खुशियाँ",
    lineHi: "आपका आंगन खुशियों की झालरों से जगमगाए।",
    lineEn: "Joy that out-sparkles every firework in the sky.",
  },
  {
    icon: Coins,
    color: "text-yellow-300",
    ring: "from-yellow-400/40 to-yellow-400/5",
    titleHi: "समृद्धि",
    lineHi: "लक्ष्मी जी का वास हो, धन-वैभव बरसता रहे।",
    lineEn: "Prosperity knocking gently, and staying all year.",
  },
  {
    icon: HeartHandshake,
    color: "text-rosee-500",
    ring: "from-rosee-500/40 to-rosee-500/5",
    titleHi: "प्यार",
    lineHi: "मिठाई हर होठ पर, मुस्कान हर चेहरे पर।",
    lineEn: "Sweet moments shared with the ones you love most.",
  },
];

export default function Wishes() {
  return (
    <section id="wishes" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <Rangoli className="absolute -top-10 -right-24 hidden w-72 lg:block" opacity={0.22} spinClass="spin-slower-rev" />

      {/* heading */}
      <Reveal className="text-center">
        <span className="inline-flex items-center gap-2.5 text-[11px] font-medium tracking-[0.35em] text-rosee-500 uppercase">
          <Marigold className="sway-slow h-6 w-6" tone="ember" /> दिल से{" "}
          <Marigold className="sway-slow h-6 w-6" tone="gold" style={{ animationDelay: "1.2s" }} />
        </span>
        <h2 className="font-yatra mt-4 text-4xl text-gold-200 sm:text-5xl">
          दीपावली की <span className="text-shimmer">शुभकामनाएं</span>
        </h2>
        <p className="font-desc-en mt-3 text-lg tracking-[0.14em] text-gold-200/50 italic">
          Warm wishes · golden moments
        </p>
      </Reveal>

      {/* featured shayari */}
      <Reveal delay={120} className="relative mx-auto mt-14 max-w-3xl">
        <div className="glass-card relative overflow-hidden rounded-[2rem] px-7 py-10 text-center sm:px-14 sm:py-14">
          <div className="pointer-events-none absolute -top-28 left-1/2 h-56 w-[30rem] -translate-x-1/2 rounded-full bg-ember-500/10 blur-3xl" />
          <Quote className="mx-auto h-8 w-8 text-gold-500/70" />
          <p className="font-hindi mt-6 text-[clamp(1.25rem,4vw,1.9rem)] leading-[1.9] text-amber-50">
            दीयों की रोशनी, रंगोली के रंग,
            <br />
            पटाखों की गूंज और मिठाइयों का संग।
            <br />
            आपके जीवन में बरसे खुशियों की बहार,
            <br />
            <span className="text-gold-300">मुबारक हो आपको दीपावली का त्योहार।</span>
          </p>
          <p className="font-desc-en mt-6 text-base tracking-[0.18em] text-gold-200/45 italic">
            Diyo ki Roshni · Rangoli ke Rang
          </p>
        </div>
      </Reveal>

      {/* wish cards */}
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WISHES.map((w, i) => (
          <Reveal key={w.titleHi} delay={i * 110}>
            <article className="group glass-card relative h-full overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-[0_20px_60px_-20px_rgba(248,184,78,0.35)]">
              <div className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${w.ring} blur-2xl transition-transform duration-700 group-hover:scale-150`} />
              <div className={`relative mb-5 inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-3 ${w.color}`}>
                <w.icon className="h-6 w-6 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
              </div>
              <h3 className="font-yatra relative text-2xl text-gold-200">{w.titleHi}</h3>
              <p className="font-hindi relative mt-3 text-[15px] leading-relaxed text-amber-100/85">
                {w.lineHi}
              </p>
              <p className="font-desc-en relative mt-3 text-[15px] leading-relaxed text-gold-200/50 italic">
                {w.lineEn}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
