import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);
export { gsap, Flip };

/** All scroll-driven GSAP animation for the page. Returns a cleanup function. */
export function initMotion(root: HTMLElement) {
  const mm = gsap.matchMedia(root);

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const mobile = window.matchMedia("(max-width: 560px)").matches;
    const dist = mobile ? 24 : 40;

    // 1. Scroll reveals: batched so siblings stagger naturally
    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    items.forEach((el) => (el.style.transition = "none")); // stop CSS hover transitions fighting GSAP
    gsap.set(items, { autoAlpha: 0, y: dist });
    ScrollTrigger.batch(items, {
      start: "top 88%",
      once: true,
      onEnter: (els) =>
        gsap.to(els, {
          autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.1, overwrite: true,
          onComplete: () => els.forEach((el) => {
            gsap.set(el, { clearProps: "opacity,visibility,transform" });
            (el as HTMLElement).style.transition = "";
          }),
        }),
    });

    // 2. Hero image parallax
    gsap.to(".hero-media img", {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // 3. About image: clip-path wipe left to right
    gsap.fromTo(".about-visual > img", { clipPath: "inset(0 100% 0 0)" }, {
      clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath",
      scrollTrigger: { trigger: ".about-visual", start: "top 80%", once: true },
    });

    // 4. Process timeline: line draws with scroll, steps slide in
    gsap.fromTo(".timeline-line", mobile ? { scaleY: 0, transformOrigin: "top" } : { scaleX: 0 }, {
      scaleX: 1, scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".timeline", start: "top 80%", end: "bottom 65%", scrub: true },
    });
    gsap.from(".milestone", {
      autoAlpha: 0, x: -28, duration: 0.8, ease: "power3.out", stagger: 0.2,
      scrollTrigger: { trigger: ".timeline", start: "top 80%", once: true },
    });

    // 5. Map pin: drop, bounce, then a soft ripple
    gsap.from(".map-pin", {
      y: -90, autoAlpha: 0, duration: 1.1, ease: "elastic.out(1, 0.5)",
      scrollTrigger: { trigger: ".map-art", start: "top 80%", once: true },
    });
    gsap.fromTo(".map-pin", { boxShadow: "0 0 0 0 rgba(201,162,75,.45)" }, {
      boxShadow: "0 0 0 34px rgba(201,162,75,0)", duration: 1.8, repeat: -1, delay: 1.4, ease: "power2.out",
    });
  });

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);
  return () => { window.removeEventListener("load", refresh); mm.revert(); };
}
