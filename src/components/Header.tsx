import { useEffect, useState } from "react";
import { MiniFlame } from "./Diya";
import { cn } from "@/utils/cn";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-no-burst
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-gold-500/10 bg-night-950/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <MiniFlame className="h-7 w-6 transition-transform duration-500 group-hover:scale-110" />
          <span className="font-yatra text-xl text-gold-300 tracking-wide">
            शुभ <span className="text-ember-500">दीपावली</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-[13px] font-medium tracking-widest text-gold-200/70 uppercase md:flex">
          <a href="#wishes" className="transition-colors hover:text-gold-300">
            शुभकामनाएं
          </a>
          <a href="#create" className="transition-colors hover:text-gold-300">
            अपना लिंक
          </a>
        </nav>
      </div>
    </header>
  );
}
