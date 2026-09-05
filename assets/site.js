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
});
