// bag.js — Shopping bag: lines, quantities, free-shipping meter, recently viewed.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Bag
   ========================================================= */
function addToBag(id, size) {
  const line = state.bag.find(l => l.id === id && l.size === size);
  line ? line.qty++ : state.bag.push({ id, size, qty: 1 });
  renderBag();
  const badge = $("#bag-badge"); badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  toast("Agregado a la bolsa", `${byId(id).title} · Talla ${size}`, "ok", { label: "Ver bolsa", fn: () => openOverlay($("#bag-sheet")) });
}
function renderBag() {
  const qty = state.bag.reduce((s, l) => s + l.qty, 0);
  const subtotal = state.bag.reduce((s, l) => s + l.qty * byId(l.id).price, 0);
  const badge = $("#bag-badge"); badge.textContent = qty; badge.dataset.empty = String(qty === 0);
  $("#open-bag").setAttribute("aria-label", `Bolsa de compra, ${qty} artículo${qty === 1 ? "" : "s"}`);
  if (!state.bag.length) {
    $("#bag-body").innerHTML = `<div class="bag-empty"><svg viewBox="0 0 48 48"><path d="M9 16h30l-2.4 25H11.4z"/><path d="M16.5 16v-3a7.5 7.5 0 0115 0v3"/></svg><strong>Tu bolsa está vacía.</strong>Agrega un par para empezar.</div>`;
    $("#bag-foot").innerHTML = `<button class="btn btn--block press" data-close>Seguir comprando</button>`;
    return;
  }
  $("#bag-body").innerHTML = state.bag.map((l, i) => {
    const p = byId(l.id);
    return `<div class="line"><div class="line__img">${shoeSVG(p.colors)}</div>
      <div><div class="line__title">${esc(cap(p.vendor))} ${esc(p.title)}</div><div class="line__meta">Talla ${l.size} · ${p.surface}</div>
      <div class="qty"><button data-qty="${i}" data-d="-1" aria-label="Quitar uno">−</button><span>${l.qty}</span><button data-qty="${i}" data-d="1" aria-label="Agregar uno">+</button></div></div>
      <div class="line__price">${money(p.price * l.qty)}</div></div>`;
  }).join("");
  const left = Math.max(0, FREE_SHIP - subtotal);
  $("#bag-foot").innerHTML = `
    <div class="ship-meter"><i style="transform:scaleX(${Math.min(1, subtotal / FREE_SHIP)})"></i></div>
    <div class="ship-text">${left ? `Te faltan ${money(left)} para envío gratis.` : "Tu pedido tiene envío gratis."}</div>
    <div class="totals"><div><span class="muted">Subtotal</span><span>${money(subtotal)}</span></div>
      <div><span class="muted">Envío</span><span>${left ? money(149) : "Gratis"}</span></div>
      <div class="grand"><span>Total</span><span>${money(subtotal + (left ? 149 : 0))}</span></div></div>
    <button class="btn btn--block press">Pagar</button>`;
}
$("#bag-body").addEventListener("click", e => {
  const b = e.target.closest("[data-qty]"); if (!b) return;
  const l = state.bag[Number(b.dataset.qty)];
  l.qty += Number(b.dataset.d);
  if (l.qty <= 0) state.bag.splice(Number(b.dataset.qty), 1);
  renderBag();
});

function addRecent(id) {
  state.recent = [id, ...state.recent.filter(x => x !== id)].slice(0, 8);
  $("#recent").hidden = false;
  $("#recent-track").innerHTML = state.recent.map(i => cardHTML(byId(i), { reveal: false })).join("");
}
