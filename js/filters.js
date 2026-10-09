// filters.js — Filters sheet: brand, surface, stock, sale and price range.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Filters sheet
   ========================================================= */
function renderFilterSheet() {
  const brands = [...new Set(PRODUCTS.map(p => p.vendor))].sort();
  const surfaces = [...new Set(PRODUCTS.map(p => p.surface))];
  const max = Math.max(...PRODUCTS.map(p => p.price));
  const pillGroup = (key, values, set) => values.map(v => {
    const n = PRODUCTS.filter(p => (key === "brand" ? p.vendor : p.surface) === v).length;
    return `<button class="pill press" data-f="${key}" data-v="${v}" aria-pressed="${set.has(v)}">${key === "brand" ? cap(v) : v} <small>${n}</small></button>`;
  }).join("");
  $("#filter-body").innerHTML = `
    <div class="fgroup"><label class="switch-row">Solo disponibles<span class="switch"><input type="checkbox" data-f="stock" ${state.inStock ? "checked" : ""}><i></i></span></label></div>
    <div class="fgroup"><label class="switch-row">En oferta<span class="switch"><input type="checkbox" data-f="sale" ${state.onSale ? "checked" : ""}><i></i></span></label></div>
    <div class="fgroup"><h3 class="fgroup__title">Marca</h3><div class="fopts">${pillGroup("brand", brands, state.brands)}</div></div>
    <div class="fgroup"><h3 class="fgroup__title">Superficie</h3><div class="fopts">${pillGroup("surface", surfaces, state.surfaces)}</div></div>
    <div class="fgroup"><h3 class="fgroup__title">Precio</h3>
      <div class="range">
        <label><span class="sr-only">Mínimo</span><span class="cur">$</span><input type="number" inputmode="numeric" min="0" data-f="min" placeholder="0" value="${state.min ?? ""}"></label>
        <span class="range__sep">a</span>
        <label><span class="sr-only">Máximo</span><span class="cur">$</span><input type="number" inputmode="numeric" min="0" data-f="max" placeholder="${max}" value="${state.max ?? ""}"></label>
      </div>
      <div class="range-note">El precio más alto es ${money(max)}.</div>
    </div>`;
}
$("#filter-body").addEventListener("click", e => {
  const b = e.target.closest("button[data-f]"); if (!b) return;
  const set = b.dataset.f === "brand" ? state.brands : state.surfaces;
  toggleSet(set, b.dataset.v);
  b.setAttribute("aria-pressed", String(set.has(b.dataset.v)));
  update(true, { keepSheet: true });
});
$("#filter-body").addEventListener("change", e => {
  const t = e.target, f = t.dataset.f;
  if (f === "stock") state.inStock = t.checked;
  else if (f === "sale") state.onSale = t.checked;
  else if (f === "min" || f === "max") state[f] = t.value === "" ? null : Math.max(0, Number(t.value));
  else return;
  update(true, { keepSheet: true });
});
$("#filter-clear").onclick = () => { clearFilters(); renderFilterSheet(); };
function toggleSet(set, v) { set.has(v) ? set.delete(v) : set.add(v); }
function clearFilters() {
  state.brands.clear(); state.surfaces.clear(); state.inStock = state.onSale = false;
  state.min = state.max = null; state.query = ""; state.category = "Todos";
  $("#search-input").value = "";
  $$("#cat-track .cat").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.cat === "Todos")));
  update(true);
}
const activeFilterCount = () => state.brands.size + state.surfaces.size + +state.inStock + +state.onSale + +(state.min != null) + +(state.max != null);
