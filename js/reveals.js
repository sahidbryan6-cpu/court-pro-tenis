// reveals.js — Fade-up reveals and animated number counters.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Reveals, counters, exploded view
   ========================================================= */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    revealIO.unobserve(en.target);
  });
}, { rootMargin: "0px 0px -12% 0px" });
function watchReveals(root = document) {
  $$("[data-reveal]:not(.is-in)", root).forEach(el => reduceMotion.matches ? el.classList.add("is-in") : revealIO.observe(el));
}

const countIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    countIO.unobserve(en.target);
    const el = en.target, to = Number(el.dataset.count);
    if (reduceMotion.matches) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1400;
    const step = t => {
      const k = clamp((t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(to * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.6 });
$$("[data-count]").forEach(el => countIO.observe(el));

$("#tile-art").innerHTML = shoeSVG(["#16171b", "#c6ff3d", "#ececf0"]);
