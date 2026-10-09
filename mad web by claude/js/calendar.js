/* ==========================================================================
   AIAT — calendar.js
   Hijri date helpers shared by the whole site. Uses the browser's built-in
   Umm al-Qura calendar, corrected by settings.hijriOffsetDays (local moon
   sighting can differ by a day or two). No library, no network.
   ========================================================================== */
(function () {
  "use strict";

  /* --- The twelve Hijri months: English and Arabic names ----------------- */
  var HIJRI_MONTHS = [
    { en: "Muharram",         ar: "محرم" },
    { en: "Safar",            ar: "صفر" },
    { en: "Rabi al-Awwal",    ar: "ربيع الأول" },
    { en: "Rabi al-Thani",    ar: "ربيع الآخر" },
    { en: "Jumada al-Awwal",  ar: "جمادى الأولى" },
    { en: "Jumada al-Thani",  ar: "جمادى الآخرة" },
    { en: "Rajab",            ar: "رجب" },
    { en: "Sha'ban",          ar: "شعبان" },
    { en: "Ramadan",          ar: "رمضان" },
    { en: "Shawwal",          ar: "شوال" },
    { en: "Dhu al-Qa'dah",    ar: "ذو القعدة" },
    { en: "Dhu al-Hijjah",    ar: "ذو الحجة" }
  ];

  /* --- Offset from data/settings.js (0 until that file exists) ----------- */
  function offsetDays() {
    var s = window.AIAT_SETTINGS;
    return s && typeof s.hijriOffsetDays === "number" ? s.hijriOffsetDays : 0;
  }

  /* --- Hijri day, month (1–12) and year for a Gregorian date ------------- */
  // Returns null if the browser doesn't support the Islamic calendar.
  function hijri(date) {
    var d = new Date((date || new Date()).getTime() + offsetDays() * 864e5);
    try {
      var parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "numeric", month: "numeric", year: "numeric"
      }).formatToParts(d);
      var out = {};
      parts.forEach(function (p) { if (p.type !== "literal") out[p.type] = parseInt(p.value, 10); });
      if (!out.day || !out.month || !out.year) return null;
      return { day: out.day, month: out.month, year: out.year };
    } catch (e) {
      return null;
    }
  }

  /* --- Position in the Hijri year, 0 (1 Muharram) to just under 1 -------- */
  function yearFraction(h) {
    return ((h.month - 1) + (h.day - 1) / 30) / 12;
  }

  /* --- Readable Hijri date, e.g. "28 Rabi al-Thani 1448" ------------------ */
  function format(h) {
    return h ? h.day + " " + HIJRI_MONTHS[h.month - 1].en + " " + h.year : "";
  }

  /* --- The next 15 January (the winter camp sits in January) ------------- */
  function nextJanuary(from) {
    var now = from || new Date();
    var y = now.getMonth() === 0 && now.getDate() <= 15 ? now.getFullYear() : now.getFullYear() + 1;
    return new Date(y, 0, 15, 12);
  }

  window.AIATCalendar = {
    HIJRI_MONTHS: HIJRI_MONTHS,
    hijri: hijri,
    yearFraction: yearFraction,
    format: format,
    nextJanuary: nextJanuary
  };
})();
