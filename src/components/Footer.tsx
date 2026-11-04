import { Sparkles } from "lucide-react";
import { MiniFlame } from "./Diya";

export default function Footer() {
  return (
    <footer data-no-burst className="relative border-t border-gold-500/10 bg-night-950/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 text-center">
        <MiniFlame className="h-7 w-6" />
        <p className="font-desc text-base text-amber-100/65">
          <span className="font-yatra text-gold-300">शुभ दीपावली</span> — गेंदे के फूल, दीयों की रोशनी, और दिलों की खुशियाँ
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-gold-200/30">
          Crafted with light &amp; code
          <Sparkles className="h-3 w-3 text-gold-500/50" />
        </p>
      </div>
    </footer>
  );
}
