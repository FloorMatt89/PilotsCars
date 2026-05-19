"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll-scrubbed video story — lag-free.
 *
 * Instead of driving the video through a GSAP timeline with scrub smoothing
 * (which always lags the scroll position by the scrub duration), a single
 * pinned ScrollTrigger fires `onUpdate` on every scroll frame and we set
 * BOTH the video frame AND the panel opacities directly from `self.progress`.
 * No scrub easing layer = the footage tracks the scrollbar 1:1.
 *
 *   • Wait for `canplaythrough` so seeking never hits unbuffered bytes.
 *   • rAF-throttle the seek to at most one `currentTime` write per frame.
 *   • Skip seeks that are sub-frame or land in an unbuffered range.
 *   • Panel opacity/translate computed with a smoothstep over progress.
 */
export default function ScrollVideoStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!section || !stage || !video || panels.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let pendingSeek: number | null = null;
    let rafId: number | null = null;
    let createdTriggers: ScrollTrigger[] = [];
    let detached = false;

    // Smoothstep ramp: 0 below `a`, 1 above `b`, eased in between.
    const ramp = (x: number, a: number, b: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    // Each panel: visible window with fade-in / fade-out edges (progress 0..1).
    const windows = [
      { in0: -1, in1: -1, out0: 0.28, out1: 0.34 }, // panel 1: on from start
      { in0: 0.33, in1: 0.39, out0: 0.60, out1: 0.66 }, // panel 2
      { in0: 0.65, in1: 0.71, out0: 2, out1: 2 }, // panel 3: stays on
    ];

    const paint = (p: number) => {
      for (let i = 0; i < panels.length && i < windows.length; i++) {
        const w = windows[i];
        const fadeIn = w.in0 < 0 ? 1 : ramp(p, w.in0, w.in1);
        const fadeOut = 1 - ramp(p, w.out0, w.out1);
        const o = Math.min(fadeIn, fadeOut);
        panels[i].style.opacity = String(o);
        panels[i].style.transform = `translateY(${(1 - o) * 26}px)`;
      }
    };

    const isBuffered = (t: number) => {
      for (let i = 0; i < video.buffered.length; i++) {
        if (t >= video.buffered.start(i) && t <= video.buffered.end(i) + 0.05)
          return true;
      }
      return false;
    };

    const flushSeek = () => {
      rafId = null;
      if (pendingSeek === null) return;
      const t = pendingSeek;
      pendingSeek = null;
      if (!isBuffered(t)) return;
      if (Math.abs(video.currentTime - t) < 0.025) return;
      try { video.currentTime = t; } catch {}
    };

    const scheduleSeek = (t: number) => {
      pendingSeek = t;
      if (rafId === null) rafId = requestAnimationFrame(flushSeek);
    };

    const setup = () => {
      if (detached) return;
      const duration = video.duration;
      if (!isFinite(duration) || duration <= 0) return;

      paint(0);

      if (reducedMotion) {
        video.pause();
        try { video.currentTime = 0; } catch {}
        panels.forEach((pnl) => {
          pnl.style.opacity = "1";
          pnl.style.transform = "none";
        });
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // No scrub: onUpdate fires on the raw scroll frame, so the video
        // frame and the panel fades track the scrollbar with no lag.
        onUpdate: (self) => {
          const p = self.progress;
          scheduleSeek(p * duration);
          paint(p);
        },
      });

      createdTriggers = ScrollTrigger.getAll().filter(
        (t) => t.trigger === section
      );
      ScrollTrigger.refresh();
    };

    const onReady = () => setup();
    if (video.readyState >= 4) {
      setup();
    } else {
      video.addEventListener("canplaythrough", onReady, { once: true });
      video.load();
    }

    return () => {
      detached = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      video.removeEventListener("canplaythrough", onReady);
      createdTriggers.forEach((t) => t.kill());
    };
  }, []);

  const panels = [
    {
      eyebrow: "Door to runway",
      title: (
        <>
          Picked up at the gate.<br />
          <em className="editorial-italic">Dropped off at the jet.</em>
        </>
      ),
      sub: "We meet you airside or deliver straight to your hotel. No rental counter, no shuttle bus, no waiting in uniform with a roll-aboard.",
    },
    {
      eyebrow: "One rate. Always.",
      title: (
        <>
          Same daily rate,<br />
          <em className="editorial-italic">every season</em>.
        </>
      ),
      sub: "No surge on Thanksgiving Eve. No deposit hold on your card. Full insurance included on every booking — collision, liability, the works.",
    },
    {
      eyebrow: "Crew only",
      title: (
        <>
          A closed network,<br />
          <em className="editorial-italic">flown by its members</em>.
        </>
      ),
      sub: "Pilots, flight attendants, mechanics, dispatchers, and their direct family — verified at signup, every time. Nobody else gets in.",
    },
  ];

  return (
    <section ref={sectionRef} className="scrolly" aria-label="Pilot Cars services">
      <div ref={stageRef} className="scrolly-stage">
        <video
          ref={videoRef}
          className="scrolly-video"
          src="/airline-driving.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="scrolly-veil" aria-hidden="true" />
        <div className="scrolly-overlay">
          {panels.map((p, i) => (
            <div
              key={i}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="scrolly-panel"
            >
              <span className="scrolly-eyebrow">{p.eyebrow}</span>
              <h2 className="scrolly-title">{p.title}</h2>
              <p className="scrolly-sub">{p.sub}</p>
            </div>
          ))}
        </div>
        <div className="scrolly-progress" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="scrolly-tick" data-tick={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
