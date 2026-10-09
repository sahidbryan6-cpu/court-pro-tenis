// anatomy.js — Anatomy section: separates the layers while scrolling down, reassembles going up.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Anatomy — sticky, scroll-linked exploded view.
   Scrolling down separates the layers and introduces each one; scrolling up reassembles it.
   Timeline (p = progress through the pinned section):
     0.00–0.30  layers separate and the shoe levels out
     0.30–0.48  1 · Capellada   (leader line draws, label slides in, other layers dim)
     0.48–0.66  2 · Mediasuela
     0.66–0.84  3 · Suela
     0.84–1.00  all three lit together
   ========================================================= */
(function anatomy() {
  const sec = $("#anatomia");
  const up = $("#anat-up"), mid = $("#anat-mid"), out = $("#anat-out"), rot = $("#anat-rot");
  const layers = [up, mid, out];
  const leads = [0, 1, 2].map(i => $("#anat-lead-" + i));
  const dots = [0, 1, 2].map(i => $("#anat-dot-" + i));
  const rings = dots.map(d => {
    const r = d.cloneNode(); r.removeAttribute("id"); r.setAttribute("class", "ring");
    r.setAttribute("fill", "none"); r.setAttribute("stroke", d.getAttribute("fill")); r.setAttribute("stroke-width", "1.5");
    d.parentNode.insertBefore(r, d); return r;
  });
  const labels = $$(".anat__label", sec);
  const steps = $$(".anat__step", sec);
  const bars = steps.map(b => $("b", b));
  const head = $("#anat-head"), hint = $("#anat-hint"), glow = $("#anat-glow"), caption = $("#anat-caption");
  const GLOW = ["rgba(198,255,61,.18)", "rgba(94,255,193,.18)", "rgba(61,214,255,.18)"];
  const INFO = [
    ["Capellada", "Malla de ingeniería transpirable con puntera reforzada."],
    ["Mediasuela", "Doble densidad con cápsula de gel en el talón."],
    ["Suela", "Caucho de espiga que agarra en dura y desliza en arcilla."],
  ];
  const START = [0.30, 0.48, 0.66], SPAN = 0.12;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let active = null;

  function setActive(a) {
    if (a === active) return;
    active = a;
    // a: -1 assembled intro, 0..2 one layer in focus, 3 all together
    layers.forEach((g, i) => {
      g.style.opacity = a >= 0 && a <= 2 && i !== a ? ".22" : "1";
      g.classList.toggle("is-focus", i === a);       // lifts slightly (css: scale, transitioned)
    });
    steps.forEach((b, i) => b.setAttribute("aria-current", String(i === a)));
    glow.style.setProperty("--glow", a >= 0 && a <= 2 ? GLOW[a] : "rgba(198,255,61,.14)");
    caption.innerHTML = a >= 0 && a <= 2
      ? `<h3>${a + 1} · ${INFO[a][0]}</h3><p>${INFO[a][1]}</p>`
      : a === 3 ? `<h3>Tres capas. Una pisada.</h3><p>Cada una hace su trabajo; juntas se sienten como una sola pieza.</p>`
      : `<h3>Sigue bajando</h3><p>Separa las capas del Court Pro una por una.</p>`;
  }

  // 90 viewBox units of a 440-unit-tall layer = 20.4545% of the layer's own height
  const GAP = 90 / 440 * 100;
  function apply(p) {
    const e = ease(clamp(p / 0.3));
    up.style.transform = `translate3d(0, ${(-GAP * e).toFixed(3)}%, 0)`;
    out.style.transform = `translate3d(0, ${(GAP * e).toFixed(3)}%, 0)`;
    // assembled: a little lower (clear of the floating title) and tilted; it rises and levels as it opens
    rot.style.transform = `translate3d(0, ${(10 * (1 - e)).toFixed(3)}%, 0) rotate(${(-7 * (1 - e)).toFixed(3)}deg)`;
    hint.style.opacity = String(1 - clamp(p / 0.12));
    // the title steps aside while the layers open, so the exploded shoe gets the full height
    head.style.opacity = (1 - e).toFixed(3);
    head.style.transform = `translate3d(0, ${(-24 * e).toFixed(1)}px, 0)`;
    for (let i = 0; i < 3; i++) {
      const l = clamp((p - START[i]) / SPAN);
      leads[i].style.strokeDashoffset = String(1 - l);
      labels[i].classList.toggle("is-shown", l > 0.55);          // label contents cascade in (css)
      const ring = rings[i];                                    // one ripple when the line lands
      if (l >= 1 && !ring.classList.contains("go")) ring.classList.add("go");
      else if (l < 0.9) ring.classList.remove("go");
      dots[i].style.opacity = l > 0.02 ? "1" : "0";
      const lab = labels[i], dx = (1 - ease(l)) * (i === 1 ? -16 : 16);
      lab.style.opacity = String(l);
      lab.style.transform = `translate3d(${dx.toFixed(2)}px, -50%, 0)`;
      bars[i].style.transform = `scaleX(${l})`;
    }
    setActive(p < START[0] ? -1 : p < START[1] ? 0 : p < START[2] ? 1 : p < 0.84 ? 2 : 3);
  }

  if (reduceMotion.matches) { apply(1); return; }
  apply(0);
  addEffect(sec, pinnedProgress, apply, 120);

  // Steps jump to the moment each layer is fully introduced (measured live, never cached)
  steps.forEach((b, i) => b.addEventListener("click", () => {
    const r = sec.getBoundingClientRect();
    const target = START[i] + SPAN + 0.02;
    scrollTo({ top: scrollY + r.top + target * Math.max(1, r.height - innerHeight), behavior: "smooth" });
  }));
})();
