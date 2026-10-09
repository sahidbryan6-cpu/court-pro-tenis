// scroll-engine.js — One rAF loop for every scroll-linked effect, with smoothing; addEffect() registers one.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Scroll engine — one passive listener, one rAF, only visible effects run
   ========================================================= */
// Wheel scrolling arrives in ~100px steps. Copying it 1:1 makes scroll-linked motion step too.
// Instead each effect *follows* its scroll target with frame-rate-independent exponential
// smoothing (time constant `tau` ms): continuous, interruptible, and identical in both directions.
// The loop only runs while something is still settling, then goes idle.
//
// Positions are measured live every frame (getBoundingClientRect), never cached: sections above
// use content-visibility and late font loading, so their real height only settles later and a
// cached offset would make effects fire at the wrong scroll position. All reads happen before
// any writes in a frame, so this costs one layout read per visible effect and no thrashing.
const effects = [];
let rafId = 0, lastT = 0;
// Touch scrolling is already continuous (momentum), so phones need only a light glide:
// a long one would make the animation trail behind the finger.
const TAU_SCALE = matchMedia("(pointer: coarse)").matches ? 0.45 : 1;

function loop(t) {
  rafId = 0;
  const dt = lastT ? Math.min(64, t - lastT) : 16;
  lastT = t;
  const vh = innerHeight;

  // 1) read phase — every visible effect measures its section
  const live = effects.filter(fx => fx.active);
  for (const fx of live) fx.target = fx.progress(fx.el.getBoundingClientRect(), vh);

  // 2) write phase — glide toward the target and draw
  let settling = false;
  for (const fx of live) {
    if (fx.cur === null || reduceMotion.matches) fx.cur = fx.target;
    else {
      fx.cur += (fx.target - fx.cur) * (1 - Math.exp(-dt / (fx.tau * TAU_SCALE)));
      if (Math.abs(fx.target - fx.cur) < 0.0002) fx.cur = fx.target; else settling = true;
    }
    if (fx.cur !== fx.drawn) { fx.render(fx.cur); fx.drawn = fx.cur; }
  }
  if (settling) requestFrame(); else lastT = 0;
}
function requestFrame() { if (!rafId) rafId = requestAnimationFrame(loop); }
addEventListener("scroll", requestFrame, { passive: true });
addEventListener("resize", requestFrame, { passive: true });
addEventListener("load", requestFrame);

// progress(rect, viewportHeight) -> number, render(value) draws it.
function addEffect(el, progress, render, tau = 110) {
  const fx = { el, active: false, progress, render, tau, cur: null, drawn: null, target: 0 };
  effects.push(fx);
  new IntersectionObserver(([en]) => {
    fx.active = en.isIntersecting;
    if (fx.active) { fx.cur = null; requestFrame(); }   // snap on (re)entry, glide while inside
    else {
      // Leaving the viewport (often after a fast scroll): land exactly on the final state
      // instead of freezing halfway through the glide.
      fx.cur = fx.progress(el.getBoundingClientRect(), innerHeight);
      fx.render(fx.cur); fx.drawn = fx.cur;
    }
  }, { rootMargin: "100px 0px" }).observe(el);
  return fx;
}

// Progress through a pinned (sticky) section: 0 when its top reaches the top of the viewport,
// 1 when its bottom reaches the bottom.
const pinnedProgress = (r, vh) => clamp(-r.top / Math.max(1, r.height - vh));
