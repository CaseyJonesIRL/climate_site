/* ---------------------------------------------------------
   Page interactions: Beat 1 tap-to-reveal, Beat 2 choice.
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  var beat1 = document.getElementById("beat1");
  if (beat1) {
    beat1.addEventListener("click", function () {
      beat1.classList.add("is-revealed");
    });
  }

  var beat2 = document.getElementById("beat2");
  if (beat2) {
    var buttons = beat2.querySelectorAll(".choice-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        beat2.classList.add("choice-made");
      });
    });
  }

  var mission = document.getElementById("mission-statement");
  if (mission && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            mission.classList.add("mission-in-view");
            observer.unobserve(mission);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(mission);
  } else if (mission) {
    mission.classList.add("mission-in-view");
  }

  // Controlled-pace smooth scroll, so a jump straight to the bottom
  // doesn't skip past Beat 2 / Beat 3 without the visitor noticing them.
  document.querySelectorAll(".js-slow-scroll").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var startY = window.scrollY;
      var endY = target.getBoundingClientRect().top + startY;
      var distance = endY - startY;
      var duration = 1800;
      var startTime = null;
      function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      }
      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutQuad(progress));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  });

  // External links always open in a new tab, so reading further never
  // means losing your place on this site.
  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
});
