/* ---------------------------------------------------------
   Simple client-side password gate.
   NOT real security — the repo is public, so anyone who reads
   the source (this file) can see the password. This only keeps
   casual visitors and search engines out before launch.
   Change PASSWORD below, then tell reviewers what it is.
--------------------------------------------------------- */
(function () {
  var PASSWORD = "76ers1976";
  var STORAGE_KEY = "ncc_unlocked";

  if (localStorage.getItem(STORAGE_KEY) === "true") {
    document.documentElement.classList.add("gate-unlocked");
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.createElement("div");
    overlay.id = "ncc-gate";
    overlay.innerHTML =
      '<div class="ncc-gate-box">' +
      '<div class="ncc-gate-eyebrow">PREVIEW &middot; NOT YET PUBLIC</div>' +
      '<div class="ncc-gate-title">This site isn&rsquo;t launched yet.</div>' +
      '<input type="password" id="ncc-gate-input" placeholder="Password" autocomplete="off" />' +
      '<button id="ncc-gate-submit" type="button">Enter</button>' +
      '<div class="ncc-gate-error" id="ncc-gate-error" hidden>Wrong password &mdash; try again.</div>' +
      "</div>";
    document.body.appendChild(overlay);

    var input = document.getElementById("ncc-gate-input");
    var button = document.getElementById("ncc-gate-submit");
    var error = document.getElementById("ncc-gate-error");

    function tryUnlock() {
      if (input.value === PASSWORD) {
        localStorage.setItem(STORAGE_KEY, "true");
        overlay.remove();
        document.documentElement.classList.add("gate-unlocked");
      } else {
        error.hidden = false;
        input.value = "";
        input.focus();
      }
    }

    button.addEventListener("click", tryUnlock);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryUnlock();
    });
    input.focus();
  });
})();
