/* ==========================================================================
   AIAT — motion.js
   The site's few scroll effects, built on GSAP + ScrollTrigger (loaded from
   CDN before this file). Each one starts from its HTML hook:

     [data-hero]       the hero photo settles and dims as you scroll past

   Motion only runs when the visitor hasn't asked for reduced motion and
   GSAP has loaded. Otherwise the page is simply still.
   ========================================================================== */
(function () {
  "use strict";

  /* --- Helper: flattens elements, NodeLists and arrays for GSAP ----------- */
  function els() {
    var out = [];
    Array.prototype.forEach.call(arguments, function (a) {
      if (!a) return;
      if (a.length !== undefined && !a.nodeType) Array.prototype.forEach.call(a, function (e) { out.push(e); });
      else out.push(a);
    });
    return out;
  }

  /* --- 1. Hero photo: from a slight zoom to rest, dimming as it leaves ---- */
  function initHeroPhoto(root) {
    var media = root.querySelector(".hero__media");
    var shade = root.querySelector(".hero__shade");
    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.3 }
    });
    tl.fromTo(media, { scale: 1.08 }, { scale: 1 }, 0);
    if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 0.45 }, 0);
    return function () { gsap.set(els(media, shade), { clearProps: "all" }); };
  }

  /* --- Start-up ------------------------------------------------------------ */
  function start() {
    if (!window.gsap || !window.ScrollTrigger) return;   // CDN failed: stay still
    gsap.registerPlugin(ScrollTrigger);

    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", function () {
      var undo = [];
      document.querySelectorAll("[data-hero]").forEach(function (el) { undo.push(initHeroPhoto(el)); });
      return function () { undo.forEach(function (fn) { fn(); }); };
    });

    // Web fonts change text heights, so measure again once they're in
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
