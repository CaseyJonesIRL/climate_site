/* ---------------------------------------------------------
   Page interactions: Beat 1 tap-to-reveal, Beat 2 choice,
   badge dots, the Arctic ice chart, and the letter copy button.
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Beat 1: tap anywhere (or press the "Tap to reveal" button) to reveal.
  // Focus then moves to the revealed message so screen readers announce it.
  var beat1 = document.getElementById("beat1");
  if (beat1) {
    var beat1Message = document.getElementById("beat1-message");
    beat1.addEventListener("click", function () {
      if (beat1.classList.contains("is-revealed")) return;
      beat1.classList.add("is-revealed");
      if (beat1Message) beat1Message.focus({ preventScroll: true });
    });
  }

  var beat2 = document.getElementById("beat2");
  if (beat2) {
    var choiceResult = beat2.querySelector(".choice-result");
    beat2.querySelectorAll(".choice-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        beat2.classList.add("choice-made");
        // The buttons disappear, so hand focus to the answer.
        if (choiceResult) choiceResult.focus({ preventScroll: true });
      });
    });
  }

  // Run each badge's dot once around the track when the badge scrolls into view
  var badges = document.querySelectorAll(".badge");
  if ("IntersectionObserver" in window) {
    var badgeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-running");
            badgeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.9 }
    );
    badges.forEach(function (b) { badgeObserver.observe(b); });
  } else {
    badges.forEach(function (b) { b.classList.add("is-running"); });
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
  // Jumps instantly for reduced-motion users, and stops the moment the
  // visitor scrolls or types, rather than fighting them.
  document.querySelectorAll(".js-slow-scroll").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.focus({ preventScroll: true });
      var startY = window.scrollY;
      var endY = target.getBoundingClientRect().top + startY;
      if (reduceMotion) {
        window.scrollTo(0, endY);
        return;
      }
      var distance = endY - startY;
      var duration = 1800;
      var startTime = null;
      var stopped = false;
      var interrupts = ["wheel", "touchstart", "keydown"];
      function stop() {
        stopped = true;
        interrupts.forEach(function (type) { window.removeEventListener(type, stop); });
      }
      interrupts.forEach(function (type) { window.addEventListener(type, stop, { passive: true }); });
      function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      }
      function step(timestamp) {
        if (stopped) return;
        if (startTime === null) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutQuad(progress));
        if (progress < 1) requestAnimationFrame(step);
        else stop();
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

  // Letter template: copy the letter text to the clipboard.
  var copyBtn = document.getElementById("copy-btn");
  var letterBody = document.getElementById("letter-body");
  if (copyBtn && letterBody) {
    var copyLabel = copyBtn.textContent;
    var copyTimer = null;
    function flashCopyLabel(label) {
      copyBtn.textContent = label;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { copyBtn.textContent = copyLabel; }, 1500);
    }
    function selectLetter() {
      var range = document.createRange();
      range.selectNodeContents(letterBody);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      flashCopyLabel("Selected — press ⌘/Ctrl+C");
    }
    copyBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(letterBody.innerText).then(function () {
          flashCopyLabel("Copied");
        }, selectLetter);
      } else {
        selectLetter();
      }
    });
  }

  // Arctic ice chart: drag, tap, or use the arrow keys to scrub through
  // every annual September minimum. Values are the NSIDC Sea Ice Index
  // (G02135, version 4) 5-day-average minimum extent, in millions of km²,
  // rounded to 2 decimals: Sea_Ice_Index_Min_Max_Rankings_G02135_v4.0.xlsx,
  // sheet "NH-Annual-5-Day-Extent". Each September, add the new year's
  // value from NSIDC's minimum announcement; the chart redraws itself.
  var iceChart = document.getElementById("ice-chart");
  if (iceChart) {
    var iceData = [
      [1985, 6.49], [1986, 7.16], [1987, 6.96], [1988, 7.13], [1989, 6.91],
      [1990, 6.04], [1991, 6.30], [1992, 7.21], [1993, 6.18], [1994, 6.96],
      [1995, 6.03], [1996, 7.19], [1997, 6.63], [1998, 6.35], [1999, 5.76],
      [2000, 5.98], [2001, 6.60], [2002, 5.64], [2003, 6.01], [2004, 5.79],
      [2005, 5.32], [2006, 5.77], [2007, 4.16], [2008, 4.59], [2009, 5.12],
      [2010, 4.62], [2011, 4.34], [2012, 3.39], [2013, 5.05], [2014, 5.03],
      [2015, 4.43], [2016, 4.17], [2017, 4.67], [2018, 4.66], [2019, 4.19],
      [2020, 3.82], [2021, 4.77], [2022, 4.70], [2023, 4.26], [2024, 4.25],
      [2025, 4.60], [2026, 4.60]
    ];
    // Plot area in SVG units, matching the gridlines in climate-change.html.
    var X0 = 30, X1 = 310, Y_TOP = 15, Y_BOTTOM = 130;
    var V_TOP = 7.5, V_BOTTOM = 3;
    var firstYear = iceData[0][0];
    var lastYear = iceData[iceData.length - 1][0];
    var points = iceData.map(function (d) {
      return {
        year: d[0],
        value: d[1],
        x: +(X0 + (d[0] - firstYear) / (lastYear - firstYear) * (X1 - X0)).toFixed(1),
        y: +(Y_TOP + (V_TOP - d[1]) / (V_TOP - V_BOTTOM) * (Y_BOTTOM - Y_TOP)).toFixed(1)
      };
    });
    var linePoints = points.map(function (p) { return p.x + "," + p.y; }).join(" ");
    document.getElementById("chart-line").setAttribute("points", linePoints);
    document.getElementById("chart-area").setAttribute("points",
      linePoints + " " + X1 + "," + Y_BOTTOM + " " + X0 + "," + Y_BOTTOM);
    var endLabel = document.getElementById("chart-end-year");
    if (endLabel) endLabel.textContent = lastYear;

    var handle = document.getElementById("chart-handle");
    var guide = document.getElementById("chart-guide");
    var readout = document.getElementById("chart-readout");
    var current = points.length - 1;
    var dragging = false;

    function setIndex(i) {
      current = Math.max(0, Math.min(points.length - 1, i));
      var p = points[current];
      handle.setAttribute("cx", p.x);
      handle.setAttribute("cy", p.y);
      guide.setAttribute("x1", p.x);
      guide.setAttribute("x2", p.x);
      readout.textContent = p.year + " · " + p.value.toFixed(2) + "M km²";
      iceChart.setAttribute("aria-valuenow", p.year);
      iceChart.setAttribute("aria-valuetext",
        p.year + ": " + p.value.toFixed(2) + " million square kilometers");
    }

    function nearestIndex(svgX) {
      var best = 0;
      points.forEach(function (p, i) {
        if (Math.abs(p.x - svgX) < Math.abs(points[best].x - svgX)) best = i;
      });
      return best;
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
      setIndex(nearestIndex(x));
    }

    function endDrag() {
      dragging = false;
      iceChart.classList.remove("is-dragging");
    }

    iceChart.addEventListener("pointerdown", function (evt) {
      dragging = true;
      iceChart.setPointerCapture(evt.pointerId);
      iceChart.classList.add("is-dragging");
      handleMove(evt);
    });
    iceChart.addEventListener("pointermove", handleMove);
    iceChart.addEventListener("pointerup", endDrag);
    iceChart.addEventListener("pointercancel", endDrag);

    iceChart.addEventListener("keydown", function (evt) {
      var steps = {
        ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1,
        PageDown: -5, PageUp: 5, Home: -points.length, End: points.length
      };
      if (!(evt.key in steps)) return;
      evt.preventDefault();
      setIndex(current + steps[evt.key]);
    });

    iceChart.setAttribute("aria-valuemin", firstYear);
    iceChart.setAttribute("aria-valuemax", lastYear);
    setIndex(current);
  }
});
