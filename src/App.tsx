import { useEffect, useMemo } from "react";
import { getWisherFromUrl } from "@/lib/wish";
import { initProtection } from "@/lib/protect";
import FireworksCanvas from "@/components/FireworksCanvas";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Wishes from "@/components/Wishes";
import AdUnit from "@/components/AdUnit";
import LinkGenerator from "@/components/LinkGenerator";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { DiyaDefs } from "@/components/Diya";

export default function App() {
  const { name, fromUrl } = useMemo(getWisherFromUrl, []);

  // Dress up the browser tab when the link carries a name
  useEffect(() => {
    if (fromUrl) document.title = `शुभ दीपावली ✦ ${name} की ओर से`;
  }, [name, fromUrl]);

  // copy / right-click / save-site deterrents
  useEffect(() => initProtection(), []);

  return (
    <div className="relative min-h-screen bg-night-950 font-sans text-amber-50 antialiased">
      <DiyaDefs />

      {/* living sky */}
      <FireworksCanvas />

      {/* vignette so fireworks never fight the text */}
      <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(120%_90%_at_50%_8%,transparent_55%,rgba(7,3,15,0.5)_100%)]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[2] h-40 bg-gradient-to-t from-night-950/80 to-transparent" />

      <Header />

      <main className="relative z-10">
        <Hero name={name} fromUrl={fromUrl} />
        <Marquee />
        <Wishes />
        <AdUnit />
        <LinkGenerator />
      </main>

      <FloatingCTA />

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
