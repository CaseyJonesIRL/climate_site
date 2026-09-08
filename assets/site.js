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

  // Tide-gauge chart: real drag-to-scrub, snapping to each of the 16
  // real annual readings (NOAA CO-OPS, station 8443970, Boston MA).
  var tideChart = document.getElementById("tide-chart");
  if (tideChart) {
    var tideData = [
      { year: 1921, value: -0.136, x: 30, y: 111.6 },
      { year: 1930, value: -0.069, x: 55.5, y: 92.3 },
      { year: 1940, value: -0.069, x: 83.7, y: 92.3 },
      { year: 1950, value: -0.142, x: 112, y: 113.3 },
      { year: 1955, value: -0.027, x: 126.2, y: 80.3 },
      { year: 1960, value: 0.007, x: 140.3, y: 70.5 },
      { year: 1965, value: -0.042, x: 154.4, y: 84.6 },
      { year: 1970, value: -0.036, x: 168.6, y: 82.9 },
      { year: 1975, value: 0.013, x: 182.7, y: 68.8 },
      { year: 1980, value: -0.015, x: 196.9, y: 76.8 },
      { year: 1990, value: 0.016, x: 225.2, y: 67.9 },
      { year: 1998, value: 0.1, x: 247.8, y: 43.8 },
      { year: 2005, value: 0.121, x: 267.6, y: 37.7 },
      { year: 2010, value: 0.15, x: 281.7, y: 29.4 },
      { year: 2015, value: 0.089, x: 295.9, y: 46.9 },
      { year: 2020, value: 0.114, x: 310, y: 39.7 }
    ];
    var handle = document.getElementById("chart-handle");
    var guide = document.getElementById("chart-guide");
    var readout = document.getElementById("chart-readout");
    var dragging = false;

    function nearestPoint(svgX) {
      var nearest = tideData[0];
      var minDist = Infinity;
      tideData.forEach(function (d) {
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
      var sign = d.value >= 0 ? "+" : "";
      readout.textContent = d.year + " · " + sign + d.value.toFixed(3) + "m";
    }

    function svgXFromEvent(evt) {
      var pt = tideChart.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      var ctm = tideChart.getScreenCTM();
      if (!ctm) return null;
      return pt.matrixTransform(ctm.inverse()).x;
    }

    function handleMove(evt) {
      if (!dragging) return;
      var x = svgXFromEvent(evt);
      if (x === null) return;
      setPoint(nearestPoint(x));
    }

    tideChart.addEventListener("pointerdown", function (evt) {
      dragging = true;
      tideChart.setPointerCapture(evt.pointerId);
      tideChart.style.cursor = "grabbing";
      handleMove(evt);
    });
    tideChart.addEventListener("pointermove", handleMove);
    tideChart.addEventListener("pointerup", function () {
      dragging = false;
      tideChart.style.cursor = "grab";
    });
    tideChart.addEventListener("pointercancel", function () {
      dragging = false;
      tideChart.style.cursor = "grab";
    });
  }
});
