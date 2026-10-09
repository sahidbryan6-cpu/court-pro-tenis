// main.js — Entry point: first render of everything.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Init
   ========================================================= */
// Trailing "›" in text links becomes a span that nudges toward its destination on hover
function decorateChevrons(root = document) {
  $$(".link", root).forEach(el => {
    const t = el.lastChild;
    if (t && t.nodeType === 3 && t.textContent.trim().endsWith("›")) {
      t.textContent = t.textContent.replace(/\s*›\s*$/, "");
      el.insertAdjacentHTML("beforeend", '<span class="chev" aria-hidden="true">›</span>');
    }
  });
}
$("#year").textContent = new Date().getFullYear();
renderNav();
renderBag();
update(true);
requestAnimationFrame(() => {
  setSegmented($("#view-seg"), $("#view-seg button[aria-pressed='true']"));
  setSegmented($("#viewer-angles"), $("#viewer-angles button[aria-pressed='true']"));
});
themeLabel();
decorateChevrons();

// If the device asks for reduced motion, the scroll animations are switched off on purpose.
// Say so, and let the visitor turn them back on (agency) — remembered in this browser.
(function motionNotice() {
  if (!systemReducedMotion.matches) return;
  let dismissed = false;
  try { dismissed = sessionStorage.getItem("court-pro:motion-note") === "hidden"; } catch {}
  if (dismissed && !motionOverride) return;
  const note = document.createElement("div");
  note.className = "motion-note";
  note.setAttribute("role", "status");
  note.innerHTML = motionOverride
    ? `<span>Animaciones activadas.</span><button class="is-secondary" data-motion="off">Reducir movimiento</button>`
    : `<span>Tu dispositivo tiene el movimiento reducido, por eso las animaciones están en pausa.</span><button data-motion="on">Activar animaciones</button><button class="motion-note__close" data-motion="close" aria-label="Cerrar">✕</button>`;
  document.body.appendChild(note);
  note.addEventListener("click", e => {
    const b = e.target.closest("[data-motion]"); if (!b) return;
    if (b.dataset.motion === "close") {
      try { sessionStorage.setItem("court-pro:motion-note", "hidden"); } catch {}
      note.remove(); return;
    }
    try { b.dataset.motion === "on" ? localStorage.setItem(MOTION_KEY, "on") : localStorage.removeItem(MOTION_KEY); } catch {}
    location.reload();   // effects are wired at load, so reload to apply the choice cleanly
  });
  if (motionOverride) setTimeout(() => note.remove(), 4000);
})();
