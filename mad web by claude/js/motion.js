/* ==========================================================================
   AIAT — motion.js
   Scroll-driven chapters, built on GSAP + ScrollTrigger (loaded from CDN
   before this file). Three chapters, each started from its HTML hook:

     [data-proof]      Proof — photo opens, timeline draws 1992 → 2018,
                       ten lamps light, the Hijri year turns as a ring
     [data-year]       The Year — months slide sideways (desktop only)
     [data-threshold]  Muharram — the page darkens, one line arrives

   Motion only runs when the visitor hasn't asked for reduced motion and
   GSAP has loaded. Otherwise each chapter keeps its static layout.
   Programs come from window.AIAT_PROGRAMS (data/programs.js from Phase 1).
   ========================================================================== */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var FOUNDED = 1992;
  var QUETTA = 2018;

  /* --- Small helpers ------------------------------------------------------ */
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
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function svg(tag, attrs, parent) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(el);
    return el;
  }
  function text(str, attrs, parent) {
    var el = svg("text", attrs, parent);
    el.textContent = str;
    return el;
  }
  // Prepares a path or circle to be "drawn" by animating its dash offset
  function prepDraw(el) {
    var len = el.getTotalLength();
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    return len;
  }

  /* --- Program positions on the Hijri year (0 = 1 Muharram, 1 = year end) */
  function programsOnRing() {
    var C = window.AIATCalendar;
    var list = (window.AIAT_PROGRAMS || []).map(function (p) {
      var h = p.hijri || (p.gregorian && C && C.hijri(p.gregorian()));
      return h ? { name: p.short || p.name, frac: C.yearFraction(h) } : null;
    }).filter(Boolean);
    return list.sort(function (a, b) { return a.frac - b.frac; });
  }


  /* ========================================================================
     1. PROOF
     ======================================================================== */

  /* --- Build the three drawn scenes inside the stage's SVG --------------- */
  function buildProofSvg(root) {
    var s = root.querySelector(".proof__svg");
    s.innerHTML = "";
    // The drawing is scaled to fit the stage; k keeps its text ~13px on screen
    var stageW = root.querySelector(".proof__stage").clientWidth || 800;
    var k = Math.min(2.4, Math.max(1, 800 / stageW));
    function fs(px) { return String(Math.round(px * k)); }
    var now = new Date().getFullYear();
    var X0 = 60, X1 = 740, Y = 430;
    function xOf(year) { return X0 + (year - FOUNDED) / (now - FOUNDED) * (X1 - X0); }
    var x18 = xOf(QUETTA);

    // Soft glow used by the lamps
    var defs = svg("defs", {}, s);
    var grad = svg("radialGradient", { id: "proofGlow" }, defs);
    svg("stop", { offset: "0%", "stop-color": "#E9B872", "stop-opacity": "0.55" }, grad);
    svg("stop", { offset: "100%", "stop-color": "#E9B872", "stop-opacity": "0" }, grad);

    /* Scene A — the timeline from 1992 to today */
    var time = svg("g", { class: "sc-time" }, s);
    var track = svg("g", { class: "axis" }, time);
    svg("path", { class: "ln-faint", d: "M" + X0 + " " + Y + "H" + X1 }, track);
    for (var y = 1995; y < now; y += 5) {
      svg("path", { class: "ln-faint", d: "M" + xOf(y) + " " + (Y - 6) + "v12" }, track);
    }
    var line = svg("path", { class: "ln", d: "M" + X0 + " " + Y + "H" + X1 }, time);
    var startLbl = svg("g", { class: "lbl-start" }, time);
    text(String(FOUNDED), { x: X0, y: Y + 20 + 22 * k, class: "t-year", "font-size": fs(22) }, startLbl);
    text("Founded", { x: X0, y: Y + 24 + 40 * k, "font-size": fs(13) }, startLbl);

    var pin = svg("g", { class: "pin" }, time);
    var pinLine = svg("path", { class: "ln", d: "M" + x18 + " " + Y + "V" + 268 }, pin);
    text(String(QUETTA), { x: x18, y: Y + 20 + 22 * k, class: "t-year", "text-anchor": "middle", "font-size": fs(22) }, pin);
    text("Quetta", { x: x18, y: Y + 24 + 40 * k, "text-anchor": "middle", "font-size": fs(13) }, pin);

    var endLbl = text("Today", { x: X1, y: Y + 20 + 16 * k, "text-anchor": "end", class: "t-gold", "font-size": fs(13) }, time);

    var marker = svg("g", { class: "marker" }, time);
    svg("circle", { cx: 0, cy: Y, r: 7, fill: cssVar("--teal-deep"), stroke: cssVar("--gold"), "stroke-width": 1.5 }, marker);
    var readout = text(String(FOUNDED), { x: 0, y: Y - 10 - 8 * k, "text-anchor": "middle", class: "t-gold", "font-size": fs(13) }, marker);

    /* Scene B — ten lamps for the ten nights */
    var nights = svg("g", { class: "sc-nights" }, s);
    var lamps = [];
    for (var i = 0; i < 10; i++) {
      var cx = 130 + i * 60;
      var g = svg("g", {}, nights);
      var glow = svg("circle", { cx: cx, cy: 326, r: 36, fill: "url(#proofGlow)" }, g);
      var flame = svg("path", {
        class: "lamp-flame",
        d: "M" + cx + " 298c4 13 11 22 11 31a11 11 0 0 1-22 0c0-9 7-18 11-31z"
      }, g);
      svg("path", { class: "lamp-cup", d: "M" + (cx - 20) + " 348h40M" + (cx - 20) + " 348q20 26 40 0" }, g);
      text(String(i + 1), { x: cx, y: 368 + 18 * k, "text-anchor": "middle", class: "lamp-num", "font-size": fs(12) }, g);
      lamps.push({ glow: glow, flame: flame });
    }

    /* Scene C — the Hijri year as a ring, programs placed by date */
    var CX = 400, CY = 300, R = 190;
    var ring = svg("g", { class: "sc-ring" }, s);
    var turn = svg("g", { class: "ring-turn" }, ring);
    svg("circle", { class: "ln-faint", cx: CX, cy: CY, r: R }, turn);
    for (var m = 0; m < 12; m++) {
      var a = (m / 12) * 2 * Math.PI - Math.PI / 2;
      svg("path", {
        class: "ln-faint",
        d: "M" + (CX + Math.cos(a) * (R - 8)) + " " + (CY + Math.sin(a) * (R - 8)) +
           "L" + (CX + Math.cos(a) * (R + 8)) + " " + (CY + Math.sin(a) * (R + 8))
      }, turn);
      var am = ((m + 0.5) / 12) * 2 * Math.PI - Math.PI / 2;
      text(String(m + 1), {
        x: CX + Math.cos(am) * (R - 30), y: CY + Math.sin(am) * (R - 30) + 4 * k,
        "text-anchor": "middle", class: "lamp-num", "font-size": fs(11)
      }, turn);
    }
    var ringLine = svg("circle", { class: "ln", cx: CX, cy: CY, r: R, transform: "rotate(-90 " + CX + " " + CY + ")" }, ring);

    var C = window.AIATCalendar;
    var today = C && C.hijri();
    var centre = text(today ? today.year + " AH" : "", { x: CX, y: CY + 7 * k, "text-anchor": "middle", class: "t-year", "font-size": fs(22) }, ring);

    function onRing(frac, r) {
      var ang = frac * 2 * Math.PI - Math.PI / 2;
      return { x: CX + Math.cos(ang) * r, y: CY + Math.sin(ang) * r, cos: Math.cos(ang) };
    }
    var progs = programsOnRing().map(function (p) {
      var g = svg("g", {}, ring);
      var d = onRing(p.frac, R);
      var l = onRing(p.frac, R + 10 + 10 * k);
      // Labels near the very top or bottom sit centred; others lean outwards
      var anchor = Math.abs(l.cos) < 0.05 ? "middle" : (l.cos > 0 ? "start" : "end");
      var dot = svg("circle", { class: "dot", cx: d.x, cy: d.y, r: 6 }, g);
      var lbl = text(p.name, { x: l.x, y: l.y + 4 * k, "text-anchor": anchor, "font-size": fs(13) }, g);
      return { dot: dot, lbl: lbl };
    });

    var here = null;
    if (today) {
      var t = onRing(C.yearFraction(today), R + 14);
      var tl = onRing(C.yearFraction(today), R + 24 + 8 * k);
      here = svg("g", { class: "ring-here" }, ring);
      svg("circle", { cx: t.x, cy: t.y, r: 4, fill: "none", stroke: cssVar("--gold"), "stroke-width": 1.5 }, here);
      text("Today", { x: tl.x, y: tl.y + 4 * k, "text-anchor": tl.cos > 0 ? "start" : "end", class: "t-gold", "font-size": fs(13) }, here);
    }

    return {
      xOf: xOf, X0: X0, X1: X1, x18: x18,
      time: time, track: track, line: line, startLbl: startLbl, pin: pin, pinLine: pinLine,
      endLbl: endLbl, marker: marker, readout: readout,
      nights: nights, lamps: lamps,
      ring: ring, turn: turn, ringLine: ringLine, centre: centre, progs: progs, here: here
    };
  }

  /* --- Caption swaps: each line rises out of its mask -------------------- */
  function capIn(tl, cap, at) {
    tl.set(cap, { autoAlpha: 1 }, at);
    tl.fromTo(cap.querySelectorAll(".proof__mask > span"),
      { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, at);
  }
  function capOut(tl, cap, at) {
    tl.to(cap.querySelectorAll(".proof__mask > span"),
      { yPercent: -110, duration: 0.35, stagger: 0.05, ease: "power2.in" }, at);
    tl.set(cap, { autoAlpha: 0 }, at + 0.45);
  }

  function initProof(root) {
    var caps = root.querySelectorAll(".proof__cap");
    var ticks = root.querySelectorAll(".proof__tick span");
    var photoA = root.querySelector(".proof__photo--a");
    var photoB = root.querySelector(".proof__photo--b");
    var teal = cssVar("--teal-deep"), black = cssVar("--mourning");

    root.classList.add("is-scrolly");
    var d = buildProofSvg(root);

    // Starting state for everything that arrives later
    gsap.set(caps, { autoAlpha: 0 });
    gsap.set(els(d.track, d.startLbl, d.endLbl, d.marker, d.pin.querySelectorAll("text"), d.nights, d.ring, d.centre, d.here), { autoAlpha: 0 });
    gsap.set(d.progs.map(function (p) { return p.dot; }), { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(d.progs.map(function (p) { return p.lbl; }), { autoAlpha: 0 });
    d.lamps.forEach(function (l) { gsap.set(l.flame, { opacity: 0.12 }); gsap.set(l.glow, { opacity: 0 }); });
    var lineLen = prepDraw(d.line);
    prepDraw(d.pinLine);
    prepDraw(d.ringLine);
    gsap.set(d.marker, { x: d.X0 });
    gsap.set(photoB, { clipPath: "inset(100% 0% 0% 0%)" });
    var lineTo = function (x) { return lineLen * (1 - (x - d.X0) / (d.X1 - d.X0)); };

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=600%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });

    /* 1992 — the first photo opens like a door */
    tl.fromTo(photoA, { clipPath: "inset(0% 48% 0% 48%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, 0);
    tl.fromTo(photoA.firstElementChild, { scale: 1.15 }, { scale: 1, duration: 1.3 }, 0);
    capIn(tl, caps[0], 0.1);
    tl.to(ticks[0], { scaleX: 1, duration: 2.8 }, 0);

    /* 1992 → 2018 — the photo steps aside and a line travels to Quetta */
    tl.to(photoA, { scale: 0.42, xPercent: 4, yPercent: 6, transformOrigin: "0% 0%", duration: 0.8, ease: "power2.inOut" }, 1.2);
    tl.to([d.track, d.startLbl, d.marker], { autoAlpha: 1, duration: 0.3 }, 1.5);
    var yr = { v: FOUNDED };
    tl.to(yr, {
      v: QUETTA, duration: 1.4, ease: "power1.inOut",
      onUpdate: function () {
        var x = d.xOf(yr.v);
        d.marker.setAttribute("transform", "translate(" + x + " 0)");
        d.line.style.strokeDashoffset = lineTo(x);
        d.readout.textContent = Math.round(yr.v);
      }
    }, 1.6);
    tl.to(d.readout, { autoAlpha: 0, duration: 0.2 }, 3.0);   // the pin's own "2018" takes over
    tl.to(d.pinLine, { strokeDashoffset: 0, duration: 0.5 }, 3.0);
    tl.to(d.pin.querySelectorAll("text"), { autoAlpha: 1, duration: 0.3 }, 3.0);
    tl.to(photoB, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.out" }, 3.2);
    capOut(tl, caps[0], 2.8);
    capIn(tl, caps[1], 3.2);
    tl.to(ticks[1], { scaleX: 1, duration: 1.6 }, 2.8);

    /* 2018 → today — the line carries on, quietly */
    var rest = { v: QUETTA };
    tl.to(rest, {
      v: new Date().getFullYear(), duration: 0.6,
      onUpdate: function () { d.line.style.strokeDashoffset = lineTo(d.xOf(rest.v)); }
    }, 3.7);
    tl.to(d.endLbl, { autoAlpha: 1, duration: 0.3 }, 4.0);

    /* Ten nights — the room goes dark and the lamps are lit, one each night */
    tl.to(root, { backgroundColor: black, duration: 0.6 }, 4.4);
    tl.to([d.time, photoA, photoB], { autoAlpha: 0, duration: 0.4 }, 4.4);
    tl.to(d.nights, { autoAlpha: 1, duration: 0.4 }, 4.7);
    capOut(tl, caps[1], 4.4);
    capIn(tl, caps[2], 4.8);
    tl.to(ticks[2], { scaleX: 1, duration: 3.2 }, 4.4);
    d.lamps.forEach(function (l, i) {
      var at = 5.0 + i * 0.24;
      tl.to(l.flame, { opacity: 1, duration: 0.2 }, at);
      tl.to(l.glow, { opacity: 1, duration: 0.3 }, at);
    });

    /* Six programs — the light returns and the year turns as a ring */
    tl.to(d.nights, { autoAlpha: 0, duration: 0.4 }, 7.6);
    tl.to(root, { backgroundColor: teal, duration: 0.6 }, 7.6);
    capOut(tl, caps[2], 7.6);
    capIn(tl, caps[3], 8.0);
    tl.to(ticks[3], { scaleX: 1, duration: 3.4 }, 7.6);
    tl.to(d.ring, { autoAlpha: 1, duration: 0.3 }, 8.0);
    tl.to(d.ringLine, { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" }, 8.1);
    tl.fromTo(d.turn, { rotation: -30, svgOrigin: "400 300" }, { rotation: 0, svgOrigin: "400 300", duration: 2.6, ease: "power1.out" }, 8.0);
    tl.to(d.centre, { autoAlpha: 1, duration: 0.4 }, 8.6);
    d.progs.forEach(function (p, i) {
      var at = 9.0 + i * 0.25;
      tl.to(p.dot, { scale: 1, duration: 0.25, ease: "back.out(2)" }, at);
      tl.to(p.lbl, { autoAlpha: 1, duration: 0.25 }, at + 0.05);
    });
    if (d.here) tl.to(d.here, { autoAlpha: 1, duration: 0.3 }, 10.6);
    tl.to({}, { duration: 0.6 }, 11);      // a short hold before the section lets go

    // Undo everything if the media query stops matching (e.g. resize)
    return function () {
      root.classList.remove("is-scrolly");
      root.querySelector(".proof__svg").innerHTML = "";
      gsap.set(els(root, photoA, photoA.firstElementChild, photoB, caps, ticks, root.querySelectorAll(".proof__mask > span")), { clearProps: "all" });
    };
  }


  /* ========================================================================
     2. THE YEAR — horizontal on desktop
     ======================================================================== */
  function initYear(root) {
    var pin = root.querySelector(".year__pin");
    var track = root.querySelector(".year__track");
    var bar = root.querySelector(".year__progress span");
    root.classList.add("is-scrolly");

    function distance() { return Math.max(0, track.scrollWidth - pin.clientWidth); }

    // The track starts at Muharram so the year reads in order;
    // the "we are here" line shows where today falls.
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
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
      root.classList.remove("is-scrolly");
      gsap.set(track, { clearProps: "all" });
      if (bar) bar.style.transform = "";
    };
  }


  /* ========================================================================
     3. MUHARRAM THRESHOLD — the dark rises, the line arrives word by word
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

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root, start: "top top", end: "+=180%", pin: true, scrub: 0.8 }
    });
    // A sheet of page-colored paper covers the chapter and drains away
    // upwards, so the dark rises from below like nightfall
    var veil = root.querySelector(".threshold__veil");
    if (!veil) {
      veil = document.createElement("div");
      veil.className = "threshold__veil";
      veil.setAttribute("aria-hidden", "true");
      root.appendChild(veil);
    }
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
    if (!window.gsap || !window.ScrollTrigger) return;   // CDN failed: stay static
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();

    // Chapters are set up in page order, so each pinned section knows how
    // much scroll the ones above it have added. The Year only slides
    // sideways where there's room; on phones it stays a vertical list.
    mm.add({
      wide: "(min-width: 900px)",
      motion: "(prefers-reduced-motion: no-preference)"
    }, function (ctx) {
      if (!ctx.conditions.motion) return;
      var undo = [];
      document.querySelectorAll("[data-proof], [data-year], [data-threshold]").forEach(function (el) {
        if (el.hasAttribute("data-proof")) undo.push(initProof(el));
        else if (el.hasAttribute("data-threshold")) undo.push(initThreshold(el));
        else if (ctx.conditions.wide) undo.push(initYear(el));
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
