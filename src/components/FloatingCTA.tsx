import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

/** Floating "अपने नाम का बनाएं" pill — hides itself when the create section (or page end) is reached. */
export default function FloatingCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("create");
    let nearEnd = false;
    let createVisible = false;

    const update = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 260;
      nearEnd = nearBottom;
      setHidden(createVisible || nearEnd);
    };

    const io = target
      ? new IntersectionObserver(
          ([entry]) => {
            createVisible = entry.isIntersecting;
            update();
          },
          { threshold: 0.12 }
        )
      : null;
    if (target && io) io.observe(target);

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      data-no-burst
      className="fixed bottom-5 left-1/2 z-50 transition-all duration-500 ease-out"
      style={{
        transform: `translateX(-50%) translateY(${hidden ? "170%" : "0"})`,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <a
        href="#create"
        aria-label="अपने नाम का लिंक बनाएं"
        className={cn(
          "fab-breathe flex items-center gap-2.5 rounded-full",
          "bg-gradient-to-r from-gold-600 via-gold-500 to-ember-500",
          "px-6 py-3.5 text-sm font-semibold tracking-wide whitespace-nowrap text-night-950"
        )}
      >
        <Sparkles className="h-4.5 w-4.5" />
        <span className="font-hindi text-base">अपने नाम का बनाएं</span>
      </a>
    </div>
  );
}
