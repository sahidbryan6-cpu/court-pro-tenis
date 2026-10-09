// motion.js — Signature motion: headline word reveals, reading progress, local-nav indicator,
// card tilt, and the fly-to-bag animation. Styles live in css/15-motion.css.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Headlines — split into words that rise out of a mask
   ========================================================= */
(function splitHeadlines() {
  const wrap = (node, i) => {
    const outer = document.createElement("span"), inner = document.createElement("span");
    outer.className = "split-word";
    inner.style.setProperty("--i", i);
    inner.appendChild(node);
    outer.appendChild(inner);
    return outer;
  };
  const heads = $$(".headline");
  heads.forEach(h => {
    let i = 0;
    const parts = [];
    [...h.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          parts.push(/^\s+$/.test(t) ? document.createTextNode(" ") : wrap(document.createTextNode(t), i++));
        });
      } else if (n.nodeName === "BR") parts.push(n);
      else parts.push(wrap(n, i++));   // e.g. the gradient span moves as one unit, keeping its gradient whole
    });
    h.replaceChildren(...parts);
    h.classList.add("split");
  });
  // Headlines already inside a [data-reveal] block play with it; the rest get their own trigger.
  const own = heads.filter(h => !h.closest("[data-reveal]"));
  if (reduceMotion.matches) { own.forEach(h => h.classList.add("is-in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -10% 0px" });
  own.forEach(h => io.observe(h));
})();

/* =========================================================
   Reading progress — thin bar under the local nav
   ========================================================= */
(function readingProgress() {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  $(".localnav").appendChild(bar);
  addEffect($("main"), (r, vh) => clamp(-r.top / Math.max(1, r.height - vh)),
    p => { bar.style.transform = `scaleX(${p.toFixed(4)})`; }, 80);
})();

/* =========================================================
   Local nav — an underline that glides to the section in view
   ========================================================= */
(function navIndicator() {
  const list = $("#local-links");
  const ind = document.createElement("span");
  ind.className = "localnav__indicator";
  ind.setAttribute("aria-hidden", "true");
  list.appendChild(ind);
  const place = () => {
    const a = $("a[aria-current='true']", list);
    if (!a || !a.offsetWidth) { ind.style.opacity = "0"; return; }
    ind.style.opacity = "1";
    ind.style.transform = `translateX(${a.offsetLeft}px) scaleX(${a.offsetWidth})`;
  };
  new MutationObserver(place).observe(list, { subtree: true, attributes: true, attributeFilter: ["aria-current"] });
  addEventListener("resize", place, { passive: true });
})();

/* =========================================================
   Product cards — subtle 3D tilt with a glare that follows the pointer (mouse only)
   ========================================================= */
(function cardTilt() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches || reduceMotion.matches) return;
  let card = null, raf = 0, px = 0, py = 0;
  const draw = () => {
    raf = 0;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (px - r.left) / r.width, y = (py - r.top) / r.height;
    card.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    card.style.transform = `perspective(900px) translate3d(0, -6px, 0) rotateX(${((0.5 - y) * 7).toFixed(2)}deg) rotateY(${((x - 0.5) * 9).toFixed(2)}deg)`;
  };
  const release = () => {
    if (!card) return;
    card.classList.remove("is-tilting");
    card.style.transform = "";            // CSS transition glides it back to rest
    card = null;
  };
  document.addEventListener("pointermove", e => {
    const c = e.target.closest && e.target.closest(".grid .card");
    if (c !== card) { release(); if (c && !c.classList.contains("reveal")) { card = c; card.classList.add("is-tilting"); } }
    if (!card) return;
    px = e.clientX; py = e.clientY;
    if (!raf) raf = requestAnimationFrame(draw);
  }, { passive: true });
  document.addEventListener("pointerleave", release);
  addEventListener("scroll", release, { passive: true });
})();

/* =========================================================
   Fly to bag — the chosen shoe arcs into the bag icon
   ========================================================= */
function flyToBag(src) {
  if (!src || reduceMotion.matches) return;
  const a = src.getBoundingClientRect();
  if (!a.width) return;
  const bagBtn = $("#open-bag").getBoundingClientRect();
  // the global nav scrolls away; if the bag icon is off-screen, aim for the top-right corner
  const target = bagBtn.bottom > 0 ? { x: bagBtn.left + bagBtn.width / 2, y: bagBtn.top + bagBtn.height / 2 } : { x: innerWidth - 36, y: 26 };
  const ghost = src.cloneNode(true);
  ghost.removeAttribute("class");
  ghost.classList.add("fly-shoe");
  Object.assign(ghost.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
  document.body.appendChild(ghost);
  const dx = target.x - (a.left + a.width / 2), dy = target.y - (a.top + a.height / 2);
  const end = Math.max(0.06, 30 / a.width);
  ghost.animate([
    { transform: "translate3d(0,0,0) scale(1) rotate(0deg)", opacity: 1 },
    { transform: `translate3d(${dx * 0.5}px, ${dy * 0.5 - 90}px, 0) scale(.5) rotate(-12deg)`, opacity: 1, offset: 0.55 },
    { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${end}) rotate(-20deg)`, opacity: 0.15 },
  ], { duration: 780, easing: "cubic-bezier(0.32, 0.72, 0, 1)" }).finished.then(() => ghost.remove(), () => ghost.remove());
}
