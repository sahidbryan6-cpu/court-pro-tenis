// search.js — Search overlay, sticky toolbar state, newsletter, toast, footer and theme toggle.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Search
   ========================================================= */
function closeSearch() { $("#search-panel").classList.remove("is-open"); $("#toggle-search").setAttribute("aria-expanded", "false"); }
$("#toggle-search").onclick = () => {
  const open = !$("#search-panel").classList.contains("is-open");
  $("#search-panel").classList.toggle("is-open", open);
  $("#toggle-search").setAttribute("aria-expanded", String(open));
  if (open) setTimeout(() => $("#search-input").focus(), 60);
};
$("#close-search").onclick = closeSearch;
$("#search-form").addEventListener("submit", e => { e.preventDefault(); closeSearch(); $("#catalogo").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" }); });
let searchT;
$("#search-input").addEventListener("input", e => { clearTimeout(searchT); searchT = setTimeout(() => { state.query = e.target.value.trim(); update(true); }, 160); });
$("#quick-search").addEventListener("click", e => {
  const b = e.target.closest("[data-q]"); if (!b) return;
  $("#search-input").value = b.dataset.q; state.query = b.dataset.q;
  update(true); closeSearch();
  $("#catalogo").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
});
document.addEventListener("pointerdown", e => {
  if ($("#search-panel").classList.contains("is-open") && !e.target.closest("#search-panel, #toggle-search")) closeSearch();
});

/* Toolbar stuck state */
const sentinel = document.createElement("div");
$("#toolbar").before(sentinel);
new IntersectionObserver(([en]) => $("#toolbar").classList.toggle("is-stuck", !en.isIntersecting), { rootMargin: "-53px 0px 0px 0px" }).observe(sentinel);

/* Newsletter */
$("#nl-form").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#nl-email"), msg = $("#nl-msg");
  if (!input.validity.valid) { msg.className = "field-msg err"; msg.textContent = "Escribe un correo válido, por ejemplo nombre@correo.com."; input.focus(); return; }
  msg.className = "field-msg ok"; msg.textContent = "Listo. Revisa tu correo para confirmar."; e.target.reset();
});
$("#nl-email").addEventListener("input", () => { $("#nl-msg").textContent = ""; });

/* Toast */
let toastT;
function toast(title, sub = "", kind = "ok", action) {
  const t = $("#toast");
  const icon = kind === "ok" ? '<svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg>' : '<svg viewBox="0 0 16 16"><path d="M8 4v5M8 12v.01"/></svg>';
  t.innerHTML = `<span class="toast__icon ${kind === "ok" ? "" : "warn"}">${icon}</span><span class="toast__text"><strong>${esc(title)}</strong>${esc(sub)}</span>${action ? `<button class="link" id="toast-action">${action.label}</button>` : ""}`;
  if (action) $("#toast-action").onclick = () => { t.classList.remove("is-visible"); action.fn(); };
  t.classList.add("is-visible");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-visible"), 3200);
}
$("#toast").addEventListener("pointerenter", () => clearTimeout(toastT));
$("#toast").addEventListener("pointerleave", () => { toastT = setTimeout(() => $("#toast").classList.remove("is-visible"), 1500); });

/* Footer accordion + theme */
$("#footer-dir").addEventListener("click", e => {
  const h = e.target.closest(".footer__col h3");
  if (h && matchMedia("(max-width: 760px)").matches) h.parentElement.classList.toggle("is-open");
});
function themeLabel() {
  const t = document.documentElement.dataset.theme;
  $("#theme-toggle").textContent = t === "dark" ? "Tema: oscuro" : t === "light" ? "Tema: claro" : "Tema: automático";
}
try { const saved = localStorage.getItem("theme"); if (saved) document.documentElement.dataset.theme = saved; } catch {}
$("#theme-toggle").onclick = () => {
  const order = [undefined, "light", "dark"], cur = document.documentElement.dataset.theme;
  const next = order[(order.indexOf(cur) + 1) % order.length];
  if (next) document.documentElement.dataset.theme = next; else delete document.documentElement.dataset.theme;
  try { next ? localStorage.setItem("theme", next) : localStorage.removeItem("theme"); } catch {}
  themeLabel();
};
