/* ==========================================================================
   AIAT — main.js
   Site-wide behaviour that isn't motion:
     - the nav turns solid once the hero has scrolled away
     - the phone menu opens and closes
   ========================================================================== */
(function () {
  "use strict";

  var nav = document.querySelector("[data-nav]");
  if (!nav) return;

  /* --- Nav: transparent over the hero, solid everywhere else -------------- */
  var hero = document.querySelector("[data-hero]");
  if (!hero || !("IntersectionObserver" in window)) {
    nav.classList.add("is-solid");
  } else {
    var navH = nav.offsetHeight || 52;
    new IntersectionObserver(function (entries) {
      nav.classList.toggle("is-solid", !entries[0].isIntersecting);
    }, { rootMargin: "-" + navH + "px 0px 0px 0px" }).observe(hero);
  }

  /* --- Phone menu ----------------------------------------------------------- */
  var button = nav.querySelector("[data-menu-button]");
  var menu = document.getElementById(button ? button.getAttribute("aria-controls") : "");
  if (!button || !menu) return;

  function setOpen(open) {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { var first = menu.querySelector("a"); if (first) first.focus(); }
  }

  button.addEventListener("click", function () {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) { setOpen(false); button.focus(); }
  });
  // Close the phone menu if the window grows to desktop width
  window.matchMedia("(min-width: 900px)").addEventListener("change", function (mq) {
    if (mq.matches) setOpen(false);
  });
})();
