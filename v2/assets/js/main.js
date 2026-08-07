/* Tom Shearer · v2 portfolio JS. Zero dependencies. */
(function () {
  "use strict";

  /* ── Mobile nav toggle ───────────────────────────── */
  var toggle = document.getElementById("navToggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.getAttribute("data-open") === "true";
      links.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
    });
    // close menu when a link is tapped
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── Project modals ──────────────────────────────── */
  var modals = document.querySelectorAll(".modal");

  function openModal(id) {
    var m = document.getElementById("modal-" + id);
    if (!m) return;
    m.setAttribute("data-open", "true");
    document.body.classList.add("modal-open");
  }
  function closeModals() {
    modals.forEach(function (m) { m.setAttribute("data-open", "false"); });
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll("[data-modal-open]").forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(trigger.getAttribute("data-modal-open"));
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach(function (el) {
    el.addEventListener("click", closeModals);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModals();
  });

  // prevent clicks inside modal content from closing it
  document.querySelectorAll(".modal-content").forEach(function (content) {
    content.addEventListener("click", function (e) { e.stopPropagation(); });
  });

  /* ── Footer year ─────────────────────────────────── */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
