"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observeElements = () => {
      const targets = Array.from(document.querySelectorAll("[data-reveal]"));
      const heads = Array.from(document.querySelectorAll(".section-head"));
      const art = Array.from(document.querySelectorAll(".about-art"));

      const reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion || !("IntersectionObserver" in window)) {
        targets.forEach((t) => t.classList.add("in"));
        heads.forEach((h) => h.classList.add("lit"));
        art.forEach((a) => a.classList.add("in"));
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              if (en.target.classList.contains("section-head")) {
                en.target.classList.add("lit");
              } else {
                en.target.classList.add("in");
              }
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -2% 0px" }
      );

      targets.forEach((t) => io.observe(t));
      heads.forEach((h) => io.observe(h));
      art.forEach((a) => io.observe(a));

      // Immediate reveal for elements already near top of viewport
      setTimeout(() => {
        targets.forEach((t) => {
          const rect = t.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            t.classList.add("in");
          }
        });
        heads.forEach((h) => {
          const rect = h.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            h.classList.add("lit");
          }
        });
      }, 100);

      return () => io.disconnect();
    };

    const timer = setTimeout(observeElements, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
