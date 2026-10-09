// compare.js — Comparison columns and local-nav highlighting of the section in view.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Compare
   ========================================================= */
$("#compare").innerHTML = COMPARE.map((c, i) => {
  const p = byId(c.id);
  const meter = n => `<span class="meter-dots">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= n ? "on" : ""}" style="--k:${k}"></i>`).join("")}</span>`;
  return `<article class="cmp" data-reveal style="--d:${i * 100}ms">
    <div class="cmp__img">${shoeSVG(p.colors)}</div>
    <div class="cmp__tag">${c.tag}</div>
    <h3>${esc(p.title)}</h3>
    <div class="cmp__for">${c.for}</div>
    <div class="cmp__dots" aria-hidden="true">${p.colors.map(x => `<i style="background:${x}"></i>`).join("")}</div>
    <div class="cmp__price">Desde ${money(p.price)}</div>
    <div class="cmp__cta"><button class="btn press" data-ql="${p.id}">Comprar</button><button class="link" data-ql="${p.id}">Más información ›</button></div>
    <ul class="cmp__specs">
      <li><strong>${c.weight}</strong>Peso aprox. talla 27</li>
      <li><strong>${c.drop}</strong>Drop talón-punta</li>
      <li>${meter(c.cushion)}Amortiguación</li>
      <li>${meter(c.support)}Soporte lateral</li>
      <li><strong style="font-size:19px">${p.surface}</strong>Superficie ideal</li>
    </ul>
  </article>`;
}).join("");
watchReveals();
document.addEventListener("click", e => { const b = e.target.closest("[data-ql]"); if (b) openQuickLook(Number(b.dataset.ql)); });

/* Local nav: highlight the section in view */
(function localNav() {
  const links = $$("#local-links a");
  const map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.removeAttribute("aria-current"));
      map.get(en.target.id)?.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  map.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
})();
