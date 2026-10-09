// overlays.js — Open/close for sheets and modal, focus trap, drag-to-dismiss.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Overlays
   ========================================================= */
let openEl = null, lastFocus = null;
function openOverlay(el) {
  if (openEl && openEl !== el) closeOverlay(false);
  lastFocus = document.activeElement; openEl = el;
  el.classList.add("is-open"); $("#scrim").classList.add("is-open");
  document.documentElement.style.overflow = "hidden";
  setTimeout(() => (el.querySelector("[data-close]") || el).focus({ preventScroll: true }), 50);
}
function closeOverlay(restore = true) {
  if (!openEl) return;
  openEl.classList.remove("is-open"); openEl.style.transform = ""; openEl = null;
  $("#scrim").classList.remove("is-open"); $("#scrim").style.opacity = "";
  document.documentElement.style.overflow = "";
  if (restore && lastFocus) lastFocus.focus?.({ preventScroll: true });
}
$("#scrim").onclick = () => closeOverlay();
$("#quick-look").addEventListener("click", e => { if (e.target.id === "quick-look") closeOverlay(); });
document.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeOverlay(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeOverlay(); closeSearch(); }
  if (e.key === "Tab" && openEl) {
    const f = $$('button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])', openEl).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
$("#open-menu").onclick = () => openOverlay($("#menu-sheet"));
$("#open-filters").onclick = () => { renderFilterSheet(); renderChips(getFiltered().length); openOverlay($("#filter-sheet")); };
$("#open-bag").onclick = () => openOverlay($("#bag-sheet"));

/* Drag-to-dismiss sheets: 1:1 tracking, rubber-band, velocity projection */
const rubberband = (over, dim, c = 0.55) => (over * dim * c) / (dim + c * Math.abs(over));
const project = (v, d = 0.998) => (v / 1000) * d / (1 - d);
$$(".sheet").forEach(sheet => {
  let sx = 0, sy = 0, axis = null, dragging = false, hist = [], pid = null;
  const isBottom = () => matchMedia("(max-width: 600px)").matches;
  const sign = () => sheet.dataset.side === "left" ? -1 : 1;
  sheet.addEventListener("pointerdown", e => {
    if (!sheet.classList.contains("is-open") || e.button !== 0 || e.target.closest("button, input, select, a, label")) return;
    const body = $(".sheet__body", sheet);
    if (isBottom() && body.contains(e.target) && body.scrollTop > 0) return;
    sx = e.clientX; sy = e.clientY; axis = null; dragging = false; hist = []; pid = e.pointerId;
  });
  sheet.addEventListener("pointermove", e => {
    if (e.pointerId !== pid) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!axis) {
      if (Math.hypot(dx, dy) < 10) return;
      axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis !== (isBottom() ? "y" : "x")) { pid = null; return; }
      dragging = true; sheet.setPointerCapture(e.pointerId); sheet.classList.add("is-dragging");
    }
    let d = isBottom() ? dy : dx * sign();
    const dim = isBottom() ? sheet.offsetHeight : sheet.offsetWidth;
    if (d < 0) d = rubberband(d, dim);
    sheet.style.transform = isBottom() ? `translateY(${d}px)` : `translateX(${d * sign()}px)`;
    $("#scrim").style.opacity = String(clamp(1 - Math.max(0, d) / dim));
    hist.push({ t: e.timeStamp, d }); if (hist.length > 6) hist.shift();
  });
  const end = e => {
    if (e.pointerId !== pid) return;
    pid = null;
    if (!dragging) return;
    dragging = false; sheet.classList.remove("is-dragging");
    const a = hist[0], b = hist[hist.length - 1];
    const v = a && b && b.t > a.t ? ((b.d - a.d) / (b.t - a.t)) * 1000 : 0;
    const dim = isBottom() ? sheet.offsetHeight : sheet.offsetWidth;
    $("#scrim").style.opacity = "";
    if ((b ? b.d : 0) + project(v) > dim * 0.5 || v > 600) closeOverlay();
    else sheet.style.transform = "";
  };
  sheet.addEventListener("pointerup", end);
  sheet.addEventListener("pointercancel", end);
});
