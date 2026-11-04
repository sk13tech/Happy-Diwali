const ITEMS = [
  "शुभ दीपावली",
  "HAPPY DIWALI",
  "दीपों का पर्व",
  "FESTIVAL OF LIGHTS",
  "उजाले और खुशियाँ",
  "JOY · LIGHT · PROSPERITY",
  "मिठास और प्यार",
  "FESTIVE BLESSINGS",
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {ITEMS.map((t, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              i % 2 === 0
                ? "font-yatra px-6 text-2xl text-gold-400/85 sm:px-10 sm:text-3xl"
                : "outline-text font-cinzel px-6 text-2xl font-bold tracking-[0.2em] sm:px-10 sm:text-3xl"
            }
          >
            {t}
          </span>
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-ember-500" aria-hidden="true">
            <path d="M6 0 L7.4 4.6 L12 6 L7.4 7.4 L6 12 L4.6 7.4 L0 6 L4.6 4.6 Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function Marquee({ dur = 36 }: { dur?: number }) {
  return (
    <div
      className="marquee relative overflow-hidden border-y border-gold-500/10 bg-gradient-to-r from-transparent via-gold-500/[0.05] to-transparent py-5"
      style={{ ["--marquee-dur" as string]: `${dur}s` }}
    >
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
      {/* edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-night-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-night-950 to-transparent" />
    </div>
  );
}
