/* ==========================================================================
   AIAT — motion.js
   Scroll-driven chapters, built on GSAP + ScrollTrigger (loaded from CDN
   before this file). Each is started from its HTML hook:

     [data-hero]       hero layers drift at their own rates (data-depth)
     [data-journey]    the institute from 1992 to today, one photo at a time
     [data-classes]    class panels move sideways (desktop only)
     [data-threshold]  Muharram: the dark rises, one line arrives

   Motion only runs when the visitor hasn't asked for reduced motion and
   GSAP has loaded. Otherwise every chapter keeps its static layout.
   The hero's two-colour name is lined up even without motion.
   ========================================================================== */
(function () {
  "use strict";

  /* --- Small helpers ------------------------------------------------------ */
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  // Flattens elements, NodeLists and arrays into one plain array for GSAP
  function els() {
    var out = [];
    Array.prototype.forEach.call(arguments, function (a) {
      if (!a) return;
      if (a.length !== undefined && !a.nodeType) Array.prototype.forEach.call(a, function (e) { out.push(e); });
      else out.push(a);
    });
    return out;
  }


  /* ========================================================================
     0. HERO
     ======================================================================== */

  /* --- The white copy of the name, lined up inside the dome --------------
     The teal h1 sits under the dome; a white copy inside the dome's clip
     sits exactly on top of it, so the name changes colour at the dome's
     edge. Runs with or without motion, and again on resize. */
  function alignHeroName(hero) {
    var title = hero.querySelector(".hero__title");
    var copy = hero.querySelector(".hero__title-copy");
    var arch = hero.querySelector(".hero__arch");
    if (!title || !copy || !arch) return;
    copy.innerHTML = title.innerHTML;

    function place() {
      // Measure without the current scroll offset; both move together
      var ty = window.gsap ? gsap.getProperty(title, "y") : 0;
      var t = title.getBoundingClientRect();
      var a = arch.getBoundingClientRect();
      copy.style.left = (t.left - a.left) + "px";
      copy.style.top = (t.top - ty - a.top) + "px";
      hero.classList.add("is-aligned");
    }
    place();
    window.addEventListener("resize", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  }

  /* --- Layers drift at their own rates as the hero scrolls away ----------
     data-depth is the share of the hero's height a layer travels while the
     hero leaves the screen. Positive = lags behind (far away), negative =
     moves ahead (close to the camera). Small numbers: depth, not a ride. */
  function initHero(root) {
    var layers = root.querySelectorAll("[data-depth]");
    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.4 }
    });
    layers.forEach(function (el) {
      var depth = parseFloat(el.getAttribute("data-depth")) || 0;
      tl.to(el, { y: function () { return depth * root.offsetHeight; } }, 0);
    });
    var haze = root.querySelector(".hero__atmos");
    if (haze) tl.to(haze, { opacity: 0.3 }, 0);
    return function () { gsap.set(els(layers, haze), { clearProps: "all" }); };
  }


  /* ========================================================================
     1. JOURNEY: desktop pins the section; photos change in a stage on the
     left while the story changes on the right. Muharram turns the room dark.
     ======================================================================== */
  function initJourney(root) {
    var stage = root.querySelector(".journey__stage");
    var steps = Array.prototype.slice.call(root.querySelectorAll(".journey__step"));
    var indexList = root.querySelector(".journey__index");
    var bar = root.querySelector(".journey__bar span");
    if (!stage || !steps.length) return function () {};

    root.classList.add("is-scrolly");

    // Move each photo into the stage (and remember where it came from)
    var photos = steps.map(function (step) {
      var fig = step.querySelector(".journey__photo");
      stage.appendChild(fig);
      return fig;
    });

    // Build the index from each step's "when" and name
    indexList.innerHTML = steps.map(function (step) {
      return "<li><b>" + step.querySelector(".journey__when").textContent + "</b>" +
             step.querySelector(".journey__name").textContent + "</li>";
    }).join("");
    var items = indexList.querySelectorAll("li");

    var light = {
      "--j-bg": cssVar("--white"), "--j-head": cssVar("--teal"),
      "--j-text": cssVar("--ink-soft"), "--j-when": cssVar("--teal-mid")
    };
    var dark = {
      "--j-bg": cssVar("--mourning"), "--j-head": cssVar("--mourning-text"),
      "--j-text": cssVar("--mourning-muted"), "--j-when": cssVar("--crimson-bright")
    };
    gsap.set(root, light);
    gsap.set(steps, { autoAlpha: 0 });
    gsap.set(steps[0], { autoAlpha: 1 });
    gsap.set(photos.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(items, { opacity: 0.35 });
    gsap.set(items[0], { opacity: 1 });

    var masksOf = function (step) { return step.querySelectorAll(".journey__mask > *"); };
    var n = steps.length;
    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=" + n * 85 + "%",
        pin: true,
        scrub: 0.7,
        anticipatePin: 1
      }
    });

    for (var i = 1; i < n; i++) {
      var at = i - 0.4;
      // The new photo rises over the old one
      tl.to(photos[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.inOut" }, at);
      tl.fromTo(photos[i].firstElementChild, { scale: 1.12 }, { scale: 1, duration: 0.9 }, at);
      // The story swaps: old lines lift out, new lines rise in
      tl.to(masksOf(steps[i - 1]), { yPercent: -110, duration: 0.3, stagger: 0.04, ease: "power2.in" }, at);
      tl.set(steps[i - 1], { autoAlpha: 0 }, at + 0.35);
      tl.set(steps[i], { autoAlpha: 1 }, at + 0.3);
      tl.fromTo(masksOf(steps[i]), { yPercent: 110 }, { yPercent: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }, at + 0.3);
      // The index moves on
      tl.to(items[i - 1], { opacity: 0.35, duration: 0.2 }, at + 0.3);
      tl.to(items[i], { opacity: 1, duration: 0.2 }, at + 0.3);
      // Muharram turns the room dark; the next moment brings the light back
      var mood = steps[i].getAttribute("data-mood");
      var prevMood = steps[i - 1].getAttribute("data-mood");
      if (mood === "mourning") tl.to(root, Object.assign({ duration: 0.5 }, dark), at);
      else if (prevMood === "mourning") tl.to(root, Object.assign({ duration: 0.5 }, light), at);
    }
    tl.to(bar, { scaleY: 1, duration: n - 0.4 }, 0);
    tl.to({}, { duration: 0.5 });           // a short hold before the section lets go

    return function () {
      root.classList.remove("is-scrolly");
      steps.forEach(function (step, k) { step.insertBefore(photos[k], step.firstChild); });
      indexList.innerHTML = "";
      gsap.set(els(root, steps, photos, items, bar, root.querySelectorAll(".journey__mask > *"),
        photos.map(function (p) { return p.firstElementChild; })), { clearProps: "all" });
    };
  }

  /* Phones: no pinning. Each photo opens up as it comes into view. */
  function initJourneyPhone(root) {
    var photos = root.querySelectorAll(".journey__photo");
    photos.forEach(function (fig) {
      gsap.fromTo(fig, { clipPath: "inset(14% 6% 14% 6% round 14px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 14px)", ease: "none",
        scrollTrigger: { trigger: fig, start: "top 92%", end: "top 45%", scrub: 0.5 }
      });
    });
    return function () { gsap.set(photos, { clearProps: "all" }); };
  }


  /* ========================================================================
     2. CLASSES: vertical scroll moves the row of panels sideways (desktop)
     ======================================================================== */
  function initClasses(root) {
    var pin = root.querySelector(".classes__pin");
    var track = root.querySelector(".classes__track");
    var bar = root.querySelector(".classes__progress span");
    root.classList.add("is-scrolly");

    function distance() { return Math.max(0, track.scrollWidth - pin.clientWidth); }

    var tween = gsap.to(track, {
      x: function () { return -distance(); },
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: function () { return "+=" + distance(); },
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: function (self) { if (bar) bar.style.transform = "scaleX(" + self.progress + ")"; }
      }
    });

    return function () {
      tween.kill();
      root.classList.remove("is-scrolly");
      gsap.set(track, { clearProps: "all" });
      if (bar) bar.style.transform = "";
    };
  }


  /* ========================================================================
     3. MUHARRAM THRESHOLD: the dark rises from below, the line arrives
     ======================================================================== */
  function splitWords(el) {
    if (el.dataset.split) return el.querySelectorAll(".w");
    el.dataset.split = "1";
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="w">' + w + "</span>";
    }).join(" ");
    return el.querySelectorAll(".w");
  }

  function initThreshold(root) {
    var words = splitWords(root.querySelector(".threshold__text"));
    var rule = root.querySelector(".threshold__rule");
    var after = root.querySelectorAll("[data-threshold-after]");
    root.classList.add("is-scrolly");

    // A white sheet covers the chapter and drains away upwards
    var veil = document.createElement("div");
    veil.className = "threshold__veil";
    veil.setAttribute("aria-hidden", "true");
    root.appendChild(veil);

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root, start: "top top", end: "+=180%", pin: true, scrub: 0.8 }
    });
    tl.fromTo(veil, { scaleY: 1 }, { scaleY: 0, duration: 1, ease: "power1.inOut" }, 0);
    tl.fromTo(rule, { scaleY: 0 }, { scaleY: 1, duration: 0.8 }, 0.6);
    tl.fromTo(words, { opacity: 0.1 }, { opacity: 1, duration: 0.3, stagger: 0.12 }, 0.9);
    tl.fromTo(after, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4 }, ">-0.1");
    tl.to({}, { duration: 0.5 });

    return function () {
      root.classList.remove("is-scrolly");
      gsap.set(els(rule, words, after), { clearProps: "all" });
      if (veil.parentNode) veil.parentNode.removeChild(veil);
    };
  }


  /* ========================================================================
     Start-up
     ======================================================================== */
  function start() {
    document.querySelectorAll("[data-hero]").forEach(alignHeroName);

    if (!window.gsap || !window.ScrollTrigger) return;   // CDN failed: stay static
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();

    // Chapters are set up in page order, so each pinned section knows how
    // much scroll the ones above it have added. Pinned chapters run only
    // where there's room; phones get lighter versions or the static layout.
    mm.add({
      wide: "(min-width: 900px)",
      motion: "(prefers-reduced-motion: no-preference)"
    }, function (ctx) {
      if (!ctx.conditions.motion) return;
      var wide = ctx.conditions.wide;
      var undo = [];
      document.querySelectorAll("[data-hero], [data-journey], [data-classes], [data-threshold]").forEach(function (el) {
        if (el.hasAttribute("data-hero")) undo.push(initHero(el));
        else if (el.hasAttribute("data-journey")) undo.push(wide ? initJourney(el) : initJourneyPhone(el));
        else if (el.hasAttribute("data-classes")) { if (wide) undo.push(initClasses(el)); }
        else if (el.hasAttribute("data-threshold")) undo.push(initThreshold(el));
      });
      return function () { undo.forEach(function (fn) { fn(); }); };
    });

    // Web fonts change text widths, so measure again once they're in
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
