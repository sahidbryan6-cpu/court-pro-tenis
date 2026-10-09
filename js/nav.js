// nav.js — Global nav, mobile menu, category shelf and brand quick-filters.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Nav
   ========================================================= */
function catCount(name) {
  if (name === "Mujer" || name === "Junior") return "Pronto";
  const n = name === "Todos" ? PRODUCTS.length
    : name === "Tennis" ? PRODUCTS.filter(p => p.surface !== "Pádel").length
    : name === "Ofertas" ? PRODUCTS.filter(p => p.compare > p.price).length
    : PRODUCTS.filter(p => p.surface === name).length;
  return `${n} modelo${n === 1 ? "" : "s"}`;
}

function renderNav() {
  $("#desktop-nav").innerHTML = NAV.map(n => `
    <li class="globalnav__item">
      <a href="#" class="globalnav__link${n.accent ? " globalnav__link--accent" : ""}">${n.label}</a>
      ${n.groups ? `<div class="flyout"><div class="flyout__inner">${n.groups.map(([label, items, big]) => `
        <div><div class="flyout__label">${label || "&nbsp;"}</div>${items.map(i => `<a href="#" class="${big ? "flyout__big" : "flyout__small"}">${i}</a>`).join("")}</div>`).join("")}
      </div></div>` : ""}
    </li>`).join("");
  $("#mobile-nav").innerHTML = NAV.map(n => `<a href="#"${n.accent ? ' class="accent"' : ""}>${n.label}<svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".4"><path d="M2 2l6 6-6 6"/></svg></a>`).join("");
  $("#cat-track").innerHTML = CATEGORIES.map(([name, c]) => `
    <button class="cat press" data-cat="${name}" aria-pressed="${name === state.category}"><span class="cat__img" style="--a:${c[1]}">${shoeSVG(c)}</span>${name}<small>${catCount(name)}</small></button>`).join("");
  $("#quick-search").innerHTML = ["Gel Resolution", "Arcilla", "Pádel", "Yonex", "Babolat"].map(q => `<button class="pill press" data-q="${q}">${q}</button>`).join("");
}

$("#cat-track").addEventListener("click", e => {
  const b = e.target.closest("[data-cat]"); if (!b) return;
  const name = b.dataset.cat;
  state.category = name; state.surfaces.clear(); state.onSale = false;
  if (["Arcilla", "Cancha dura", "Pádel"].includes(name)) state.surfaces.add(name);
  if (name === "Ofertas") state.onSale = true;
  if (name === "Mujer" || name === "Junior") toast(`${name}: próximamente`, "Mostrando todo el calzado de hombre.", "warn");
  $$("#cat-track .cat").forEach(c => c.setAttribute("aria-pressed", String(c === b)));
  update(true);
});

function renderQuickPills() {
  if (!$("#quick-pills [data-brand]")) {
    const brands = [...new Set(PRODUCTS.map(p => p.vendor))].sort();
    $("#quick-pills").insertAdjacentHTML("beforeend", brands.map(b => `<button class="pill press" data-brand="${b}" aria-pressed="false">${cap(b)}</button>`).join(""));
  }
  $$("#quick-pills [data-brand]").forEach(b => b.setAttribute("aria-pressed", String(state.brands.has(b.dataset.brand))));
}
$("#quick-pills").addEventListener("click", e => {
  const b = e.target.closest("[data-brand]"); if (!b) return;
  toggleSet(state.brands, b.dataset.brand); update(true);
});
