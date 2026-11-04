import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "h2" | "p";
  id?: string;
};

/** IntersectionObserver-powered graceful reveal on scroll. */
export default function Reveal({ children, className, delay = 0, as = "div", id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      id={id}
      style={{ transitionDelay: seen ? `${delay}ms` : "0ms" }}
      className={cn("reveal", seen && "reveal-in", className)}
    >
      {children}
    </Tag>
  );
}
