// products.js — Product grid: filtering, sorting, cards, promo tile, load more, chips.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Products grid
   ========================================================= */
function getFiltered() {
  const q = state.query.toLowerCase();
  let list = PRODUCTS.filter(p =>
    (!state.brands.size || state.brands.has(p.vendor)) &&
    (!state.surfaces.size || state.surfaces.has(p.surface)) &&
    (!state.inStock || p.available) && (!state.onSale || p.compare > p.price) &&
    (state.min == null || p.price >= state.min) && (state.max == null || p.price <= state.max) &&
    (!q || `${p.vendor} ${p.title} ${p.surface}`.toLowerCase().includes(q)));
  const sorters = {
    "title-ascending": (a, b) => a.title.localeCompare(b.title), "title-descending": (a, b) => b.title.localeCompare(a.title),
    "price-ascending": (a, b) => a.price - b.price, "price-descending": (a, b) => b.price - a.price,
    "created-ascending": (a, b) => a.created - b.created, "created-descending": (a, b) => b.created - a.created,
    "best-selling": (a, b) => b.sales - a.sales,
  };
  if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
  return list;
}

function cardHTML(p, { reveal = true } = {}) {
  const sale = p.compare > p.price;
  const eyebrow = !p.available ? `<span class="card__eyebrow card__eyebrow--muted">Agotado</span>`
    : sale ? `<span class="card__eyebrow">Ahorra ${money(p.compare - p.price)}</span>`
    : p.isNew ? `<span class="card__eyebrow">Nuevo</span>` : `<span class="card__eyebrow"></span>`;
  return `
  <article class="card${p.available ? "" : " card--soldout"}${reveal ? " reveal" : ""}" style="--a:${p.colors[1]}" data-id="${p.id}" tabindex="0" aria-label="${esc(p.vendor + " " + p.title)}">
    <button class="card__add press" data-add="${p.id}" aria-label="Agregar ${esc(p.title)} a la bolsa" ${p.available ? "" : "disabled"}><svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg></button>
    <div class="card__media">${shoeSVG(p.colors, 0, "card__shoe")}</div>
    <div class="card__body">
      ${eyebrow}
      <h3 class="card__title">${esc(p.title)}</h3>
      <div class="card__vendor">${cap(p.vendor)} · ${p.surface}</div>
      <div class="card__colors" aria-hidden="true">${p.colors.slice(0, 2).map(c => `<span style="background:${c}"></span>`).join("")}<em>2 colores</em></div>
      <div class="card__price">${money(p.price)}${sale ? `<s>${money(p.compare)}</s>` : ""}<span class="card__msi">o ${money(Math.ceil(p.price / 3))}/mes en 3 MSI*</span></div>
    </div>
  </article>`;
}

const PROMO_HTML = `
  <aside class="promo reveal">
    <div>
      <div class="promo__eyebrow grad-volt">Asesor de calzado</div>
      <h3>Encuentra tu par ideal.</h3>
      <p>Dinos en qué superficie juegas y cuánto quieres invertir. Te mostramos solo lo que te sirve.</p>
    </div>
    <div class="promo__steps"><span>1 · Superficie</span><span>2 · Marca</span><span>3 · Precio</span></div>
    <button class="btn press" data-open-filters>Empezar</button>
  </aside>`;

let cardIO;
function observeCards(root) {
  if (reduceMotion.matches) { $$(".reveal", root).forEach(el => el.classList.remove("reveal")); return; }
  cardIO ??= new IntersectionObserver(entries => {
    let i = 0;
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.style.setProperty("--d", `${Math.min(i++, 6) * 50}ms`);
      el.classList.add("is-in");
      // once the entrance finishes, drop the classes so hover transitions aren't delayed
      el.addEventListener("transitionend", function done(ev) {
        if (ev.target !== el || ev.propertyName !== "transform") return;
        el.classList.remove("reveal", "is-in"); el.style.removeProperty("--d");
        el.removeEventListener("transitionend", done);
      });
      cardIO.unobserve(el);
    });
  }, { rootMargin: "0px 0px -40px 0px" });
  $$(".reveal:not(.is-in)", root).forEach(el => cardIO.observe(el));
}

function renderGrid(list) {
  const slice = list.slice(0, state.shown);
  const grid = $("#grid");
  $("#count").textContent = `${list.length} artículo${list.length === 1 ? "" : "s"}`;
  const cards = slice.map(p => cardHTML(p));
  if (cards.length > 6) cards.splice(5, 0, PROMO_HTML);
  grid.innerHTML = slice.length ? cards.join("") : `
    <div class="empty"><h3>Sin resultados.</h3><p>Prueba con menos filtros o con otra búsqueda.</p><button class="btn press" data-clear-all>Borrar filtros</button></div>`;
  observeCards(grid);
  renderMore(list, slice.length);
}
function renderMore(list, shown) {
  const more = $("#more");
  if (list.length > shown) {
    more.innerHTML = `<div class="more__meter"><i style="transform:scaleX(${shown / list.length})"></i></div>
      <div class="more__text">Viendo ${shown} de ${list.length}</div>
      <button class="btn btn--secondary press" id="load-more">Mostrar más <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2.5 4.5L6 8l3.5-3.5"/></svg></button>`;
  } else more.innerHTML = list.length ? `<div class="more__text">Viste los ${list.length} artículos.</div>` : "";
}
$("#more").addEventListener("click", e => {
  if (!e.target.closest("#load-more")) return;
  state.shown += PAGE_SIZE;
  const list = getFiltered(), grid = $("#grid");
  const start = grid.querySelectorAll(".card").length;
  grid.insertAdjacentHTML("beforeend", list.slice(start, state.shown).map(p => cardHTML(p)).join(""));
  observeCards(grid);
  renderMore(list, Math.min(state.shown, list.length));
});

function renderChips(total) {
  const chips = [
    ...[...state.brands].map(v => [cap(v), () => state.brands.delete(v)]),
    ...[...state.surfaces].map(v => [v, () => state.surfaces.delete(v)]),
    ...(state.inStock ? [["Disponibles", () => state.inStock = false]] : []),
    ...(state.onSale ? [["En oferta", () => state.onSale = false]] : []),
    ...(state.min != null ? [[`Desde ${money(state.min)}`, () => state.min = null]] : []),
    ...(state.max != null ? [[`Hasta ${money(state.max)}`, () => state.max = null]] : []),
    ...(state.query ? [[`“${state.query}”`, () => { state.query = ""; $("#search-input").value = ""; }]] : []),
  ];
  const wrap = $("#chips");
  wrap.innerHTML = "";
  chips.forEach(([label, clear]) => {
    const b = document.createElement("button");
    b.className = "chip press";
    b.innerHTML = `${esc(label)}<svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm2.8 8.8l-1 1L8 9 6.2 10.8l-1-1L7 8 5.2 6.2l1-1L8 7l1.8-1.8 1 1L9 8z"/></svg>`;
    b.setAttribute("aria-label", `Quitar filtro ${label}`);
    b.onclick = () => { clear(); update(true); };
    wrap.appendChild(b);
  });
  if (chips.length > 1) {
    const c = document.createElement("button");
    c.className = "chip chip--clear"; c.textContent = "Borrar todo"; c.dataset.clearAll = "";
    wrap.appendChild(c);
  }
  $("#filter-badge").textContent = activeFilterCount() || "";
  $("#filter-apply").textContent = `Ver ${total} artículo${total === 1 ? "" : "s"}`;
}
document.addEventListener("click", e => {
  if (e.target.closest("[data-clear-all]")) clearFilters();
  if (e.target.closest("[data-open-filters]")) $("#open-filters").click();
});

function update(resetPaging = false, { keepSheet = false } = {}) {
  if (resetPaging) state.shown = PAGE_SIZE;
  const list = getFiltered();
  renderQuickPills(); renderChips(list.length); renderGrid(list);
  if (!keepSheet && $("#filter-sheet").classList.contains("is-open")) renderFilterSheet();
}
$("#sort-by").addEventListener("change", e => { state.sort = e.target.value; update(true); });
$("#view-seg").addEventListener("click", e => {
  const b = e.target.closest("button[data-view]"); if (!b) return;
  setSegmented($("#view-seg"), b);
  $("#grid").dataset.view = b.dataset.view;
});

/* Card interactions */
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { openQuickLook(Number(add.dataset.add)); return; }
  const card = e.target.closest(".card");
  if (card) openQuickLook(Number(card.dataset.id));
});
document.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList?.contains("card")) { e.preventDefault(); openQuickLook(Number(e.target.dataset.id)); }
});
