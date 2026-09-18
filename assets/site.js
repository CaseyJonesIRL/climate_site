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

  // Arctic ice chart: real drag-to-scrub, snapping to each of the 15
  // real annual September-minimum readings (NSIDC Sea Ice Index, G02135).
  var iceChart = document.getElementById("tide-chart");
  if (iceChart) {
    var iceData = [
      { year: 1985, value: 6.14, x: 30, y: 26.8 },
      { year: 1990, value: 5.64, x: 65, y: 43.3 },
      { year: 2001, value: 5.88, x: 142, y: 35.4 },
      { year: 2007, value: 4.16, x: 184, y: 91.9 },
      { year: 2008, value: 4.59, x: 191, y: 77.8 },
      { year: 2010, value: 4.62, x: 205, y: 76.8 },
      { year: 2011, value: 4.34, x: 212, y: 86.0 },
      { year: 2012, value: 3.39, x: 219, y: 117.2 },
      { year: 2015, value: 4.43, x: 240, y: 83.0 },
      { year: 2016, value: 4.17, x: 247, y: 91.6 },
      { year: 2019, value: 4.19, x: 268, y: 90.9 },
      { year: 2020, value: 3.82, x: 275, y: 103.1 },
      { year: 2023, value: 4.26, x: 296, y: 88.6 },
      { year: 2024, value: 4.25, x: 303, y: 88.9 },
      { year: 2025, value: 4.60, x: 310, y: 77.4 }
    ];
    var handle = document.getElementById("chart-handle");
    var guide = document.getElementById("chart-guide");
    var readout = document.getElementById("chart-readout");
    var dragging = false;

    function nearestPoint(svgX) {
      var nearest = iceData[0];
      var minDist = Infinity;
      iceData.forEach(function (d) {
        var dist = Math.abs(d.x - svgX);
        if (dist < minDist) {
          minDist = dist;
          nearest = d;
        }
      });
      return nearest;
    }

    function setPoint(d) {
      handle.setAttribute("cx", d.x);
      handle.setAttribute("cy", d.y);
      guide.setAttribute("x1", d.x);
      guide.setAttribute("x2", d.x);
      readout.textContent = d.year + " · " + d.value.toFixed(2) + "M km²";
    }

    function svgXFromEvent(evt) {
      var pt = iceChart.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      var ctm = iceChart.getScreenCTM();
      if (!ctm) return null;
      return pt.matrixTransform(ctm.inverse()).x;
    }

    function handleMove(evt) {
      if (!dragging) return;
      var x = svgXFromEvent(evt);
      if (x === null) return;
      setPoint(nearestPoint(x));
    }

    iceChart.addEventListener("pointerdown", function (evt) {
      dragging = true;
      iceChart.setPointerCapture(evt.pointerId);
      iceChart.style.cursor = "grabbing";
      handleMove(evt);
    });
    iceChart.addEventListener("pointermove", handleMove);
    iceChart.addEventListener("pointerup", function () {
      dragging = false;
      iceChart.style.cursor = "grab";
    });
    iceChart.addEventListener("pointercancel", function () {
      dragging = false;
      iceChart.style.cursor = "grab";
    });
  }
});
