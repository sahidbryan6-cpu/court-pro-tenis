// quick-look.js — Quick-look modal: angles, sizes, add to bag.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Quick Look
   ========================================================= */
let ql = { p: null, size: null, angle: 0 };
function openQuickLook(id) {
  const p = byId(id);
  ql = { p, size: null, angle: 0 };
  const sale = p.compare > p.price;
  $("#ql-media").style.setProperty("--a", p.colors[1]);
  $("#ql-eyebrow").textContent = !p.available ? "Agotado" : sale ? `Ahorra ${money(p.compare - p.price)}` : p.isNew ? "Nuevo" : "";
  $("#ql-vendor").textContent = `${cap(p.vendor)} · ${p.surface}`;
  $("#ql-title").textContent = p.title;
  $("#ql-price").innerHTML = `${money(p.price)}${sale ? `<s>${money(p.compare)}</s>` : ""}`;
  $("#ql-msi").textContent = `o ${money(Math.ceil(p.price / 3))}/mes en 3 meses sin intereses*`;
  $("#ql-img").innerHTML = shoeSVG(p.colors, 0, "big");
  $("#ql-thumbs").innerHTML = [0, 1, 2].map(a => `<button class="press" data-angle="${a}" aria-pressed="${a === 0}" aria-label="Vista ${a + 1}">${shoeSVG(p.colors, a)}</button>`).join("");
  $("#ql-sizes").innerHTML = SIZES.map((s, i) => `<button type="button" data-size="${s}" aria-pressed="false" ${!p.available || (p.id + i) % 7 === 0 ? "disabled" : ""}>${s}</button>`).join("");
  const add = $("#ql-add");
  add.disabled = !p.available; add.textContent = p.available ? "Agregar a la bolsa" : "Agotado";
  openOverlay($("#quick-look"));
  addRecent(id);
}
$("#ql-thumbs").addEventListener("click", e => {
  const b = e.target.closest("[data-angle]"); if (!b) return;
  ql.angle = Number(b.dataset.angle);
  $$("#ql-thumbs button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  $("#ql-img").innerHTML = shoeSVG(ql.p.colors, ql.angle, "big");
});
$("#ql-sizes").addEventListener("click", e => {
  const b = e.target.closest("[data-size]"); if (!b || b.disabled) return;
  $$("#ql-sizes button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  ql.size = b.dataset.size;
});
$("#ql-add").addEventListener("click", () => {
  if (!ql.size) { const s = $("#ql-sizes"); s.classList.remove("shake"); void s.offsetWidth; s.classList.add("shake"); return; }
  addToBag(ql.p.id, ql.size); closeOverlay();
});
