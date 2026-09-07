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
});
