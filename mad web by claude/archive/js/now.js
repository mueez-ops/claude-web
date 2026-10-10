/* ==========================================================================
   AIAT — now.js
   The live parts of the first screen:
     [data-hijri]        today's Hijri date, e.g. "28 Rabi al-Thani 1448"
     [data-hijri-ar]     the Hijri month in Arabic
     [data-greg]         today's date in Quetta, e.g. "Friday 9 October 2026"
     [data-prayers]      Quetta prayer times with the next one highlighted

   Prayer times come from the Aladhan API (free, no key). Today's answer is
   cached in localStorage. If anything fails the prayer block stays hidden;
   the page never shows broken content.
   ========================================================================== */
(function () {
  "use strict";

  var TZ = "Asia/Karachi";
  var PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  /* --- Settings (data/settings.js from Phase 1; safe defaults until then) */
  function settings() {
    var s = window.AIAT_SETTINGS || {};
    return {
      city: s.prayerCity || "Quetta",
      country: s.prayerCountry || "Pakistan",
      method: typeof s.prayerMethod === "number" ? s.prayerMethod : 0   // 0 = Shia Ithna-Ashari (Jafari)
    };
  }

  /* --- Current date and minutes-past-midnight in Quetta ------------------ */
  function quettaNow() {
    var parts = {};
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    return {
      key: parts.year + "-" + parts.month + "-" + parts.day,
      minutes: parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10)
    };
  }

  /* --- Dates ------------------------------------------------------------- */
  function fillDates() {
    var C = window.AIATCalendar;
    var h = C && C.hijri();
    document.querySelectorAll("[data-hijri]").forEach(function (el) { if (h) el.textContent = C.format(h); });
    document.querySelectorAll("[data-hijri-ar]").forEach(function (el) {
      if (h) el.textContent = C.HIJRI_MONTHS[h.month - 1].ar;
    });
    var greg = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(new Date());
    document.querySelectorAll("[data-greg]").forEach(function (el) { el.textContent = greg; });
  }

  /* --- "05:12" → minutes; and → "5:12" + "am" ---------------------------- */
  function toMinutes(hhmm) {
    var m = /(\d{1,2}):(\d{2})/.exec(hhmm || "");
    return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : null;
  }
  function to12h(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    return { time: ((h + 11) % 12 + 1) + ":" + String(m).padStart(2, "0"), ampm: h < 12 ? "am" : "pm" };
  }
  function untilText(diff) {
    var h = Math.floor(diff / 60), m = diff % 60;
    return "in " + (h ? h + " h " : "") + m + " min";
  }

  /* --- Fetch today's times, using the cache when it's from today --------- */
  function loadTimes(day) {
    var cfg = settings();
    var cacheKey = "aiat-prayers-" + cfg.method + "-" + day;
    try {
      var cached = localStorage.getItem(cacheKey);
      if (cached) return Promise.resolve(JSON.parse(cached));
    } catch (e) { /* storage blocked: just fetch */ }

    var url = "https://api.aladhan.com/v1/timingsByCity?city=" + encodeURIComponent(cfg.city) +
              "&country=" + encodeURIComponent(cfg.country) + "&method=" + cfg.method;
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (json) {
      var t = json && json.data && json.data.timings;
      if (!t) throw new Error("No timings");
      var times = {};
      PRAYERS.forEach(function (p) { times[p] = toMinutes(t[p]); });
      if (PRAYERS.some(function (p) { return times[p] === null; })) throw new Error("Bad timings");
      try { localStorage.setItem(cacheKey, JSON.stringify(times)); } catch (e) { /* fine */ }
      return times;
    });
  }

  /* --- Draw the five times and mark the next one ------------------------- */
  function render(block, times) {
    var list = block.querySelector("[data-prayer-list]");
    var inEl = block.querySelector("[data-prayer-in]");
    var now = quettaNow().minutes;

    // Next prayer today, or Fajr tomorrow after Isha
    var next = PRAYERS.filter(function (p) { return times[p] > now; })[0] || "Fajr";
    var diff = times[next] - now;
    if (diff <= 0) diff += 24 * 60;

    list.innerHTML = PRAYERS.map(function (p) {
      var t = to12h(times[p]);
      return '<li class="prayers__item' + (p === next ? " is-next" : "") + '"' +
        (p === next ? ' aria-current="time"' : "") + ">" +
        '<span class="prayers__name">' + p + (p === next ? " (next)" : "") + "</span>" +
        '<span class="prayers__time">' + t.time + "<small>" + t.ampm + "</small></span></li>";
    }).join("");
    if (inEl) inEl.textContent = next + " " + untilText(diff);
    block.hidden = false;
  }

  function startPrayers() {
    document.querySelectorAll("[data-prayers]").forEach(function (block) {
      block.hidden = true;                         // shown only once times arrive
      loadTimes(quettaNow().key).then(function (times) {
        render(block, times);
        setInterval(function () { render(block, times); }, 30000);
      }).catch(function () {
        block.hidden = true;                       // fail quietly
      });
    });
  }

  function start() { fillDates(); startPrayers(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
