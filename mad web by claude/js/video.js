/* ==========================================================================
   AIAT — video.js
   Background videos ([data-wwd] sections):
     - the file loads only when the section is about to come on screen,
       the portrait version on phones, the landscape one elsewhere
     - it plays while on screen and pauses when it leaves
     - no autoplay with reduced motion or data saver: the poster stays and
       the button shows "Play" so the visitor can start it
     - the round button pauses and plays; a manual pause is remembered, so
       scrolling back doesn't restart a video the visitor stopped
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var portrait = window.matchMedia("(max-width: 699px)").matches;

  document.querySelectorAll("[data-wwd]").forEach(function (section) {
    var video = section.querySelector("video");
    var toggle = section.querySelector("[data-video-toggle]");
    if (!video) return;

    // Phones get the portrait poster straight away
    if (portrait && video.dataset.posterPortrait) video.poster = video.dataset.posterPortrait;

    var userPaused = reduce || saveData;   // start paused when we shouldn't autoplay
    var loaded = false;
    var visible = false;

    function setPausedUI(paused) {
      section.classList.toggle("is-paused", paused);
      if (toggle) toggle.setAttribute("aria-label", paused ? "Play video" : "Pause video");
    }

    function load() {
      if (loaded) return;
      loaded = true;
      video.src = portrait && video.dataset.srcPortrait ? video.dataset.srcPortrait : video.dataset.src;
    }

    function play() {
      load();
      var p = video.play();
      if (p && p.catch) p.catch(function () { setPausedUI(true); });   // blocked: show Play
      setPausedUI(false);
    }

    function pause() {
      video.pause();
      setPausedUI(true);
    }

    setPausedUI(true);

    if (toggle) {
      toggle.addEventListener("click", function () {
        if (video.paused) { userPaused = false; play(); }
        else { userPaused = true; pause(); }
      });
    }

    // Load a little before the section arrives; play only while it's on screen
    if (!("IntersectionObserver" in window)) {
      if (!userPaused) play();
      return;
    }
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !userPaused) load();
    }, { rootMargin: "300px 0px" }).observe(section);

    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !userPaused) play();
      else if (!visible && !video.paused) { video.pause(); }
    }, { threshold: 0.25 }).observe(section);
  });
})();
