"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Wires up the site-wide animation behaviors once per page mount.
 *   • [data-reveal]       — fade + slide up as element enters viewport
 *   • [data-stagger] >    — same, but staggered across direct children
 *   • [data-hero-reveal]  — page-load timeline for hero blocks
 *   • [data-magnet]       — subtle pointer-tracking translate (desktop only)
 *   • [data-count-to]     — number tweens up to target on scroll-in
 *   • [data-ticker]       — seamless infinite marquee (use with width-doubled content)
 *   • [data-kenburns]     — slow scale loop on background image
 *   • [data-parallax-y]   — scroll-driven y offset
 * Honors prefers-reduced-motion: animations are skipped and elements are set to their final state.
 */
export default function AnimationProvider() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Settle final state for reduced motion users and bail.
      if (reducedMotion) {
        gsap.set(
          "[data-reveal], [data-hero-reveal], [data-stagger] > *",
          { opacity: 1, y: 0, clearProps: "transform" }
        );
        return;
      }

      // Hero load-in: title, sub, badge, search dock.
      gsap.utils.toArray<HTMLElement>("[data-hero-reveal]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            delay: 0.15 + i * 0.12,
          }
        );
      });

      // Scroll-in reveals.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Stagger children reveals.
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        const children = Array.from(el.children) as HTMLElement[];
        gsap.fromTo(
          children,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Count-up numbers.
      gsap.utils.toArray<HTMLElement>("[data-count-to]").forEach((el) => {
        const target = parseFloat(el.dataset.countTo || "0");
        const decimals = parseInt(el.dataset.countDecimals || "0", 10);
        const prefix = el.dataset.countPrefix || "";
        const suffix = el.dataset.countSuffix || "";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate: () => {
            const n = obj.val.toFixed(decimals);
            el.textContent = `${prefix}${Number(n).toLocaleString(undefined, {
              maximumFractionDigits: decimals,
              minimumFractionDigits: decimals,
            })}${suffix}`;
          },
        });
      });

      // Ken-burns.
      gsap.utils.toArray<HTMLElement>("[data-kenburns]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.06 },
          {
            scale: 1.14,
            duration: 28,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }
        );
      });

      // Parallax-y on scroll.
      gsap.utils.toArray<HTMLElement>("[data-parallax-y]").forEach((el) => {
        const strength = parseFloat(el.dataset.parallaxY || "60");
        gsap.fromTo(
          el,
          { y: -strength / 2 },
          {
            y: strength / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Ticker marquee — assumes track has content duplicated so a -50% shift loops cleanly.
      gsap.utils.toArray<HTMLElement>("[data-ticker]").forEach((el) => {
        const speed = parseFloat(el.dataset.tickerSpeed || "38");
        gsap.to(el, {
          xPercent: -50,
          duration: speed,
          ease: "none",
          repeat: -1,
        });
      });

      // Magnet hover (pointer fine only).
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine) {
        const magnets = gsap.utils.toArray<HTMLElement>("[data-magnet]");
        magnets.forEach((el) => {
          const strength = parseFloat(el.dataset.magnetStrength || "12");
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = ((e.clientX - cx) / r.width) * strength;
            const dy = ((e.clientY - cy) / r.height) * strength;
            gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: "power3.out" });
          };
          const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
