// story.js — Story section: step text and shoe rotation tied to scroll.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Story — sticky, scroll-linked
   ========================================================= */
(function story() {
  const sec = $("#story"), steps = $$(".story__step"), shoeBox = $("#story-shoe"), bar = $("#story-bar"), glow = $("#story-glow");
  const GLOWS = ["rgba(198,255,61,.22)", "rgba(61,214,255,.24)", "rgba(255,120,80,.24)"];
  const COLORS = [["#16171b", "#c6ff3d", "#ececf0"], ["#1c2340", "#3dd6ff", "#e9e9ec"], ["#f4f4f6", "#ff6b4a", "#2a2a2e"]];
  shoeBox.innerHTML = shoeSVG(COLORS[0]);
  const svg = $("svg", shoeBox);
  let active = 0;
  function setStep(i) {
    if (i === active) return;
    active = i;
    steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    glow.style.setProperty("--glow", GLOWS[i]);
    const [m, a, s] = COLORS[i];
    svg.style.setProperty("--m", m); svg.style.setProperty("--a", a); svg.style.setProperty("--s", s);
  }
  addEffect(sec, pinnedProgress, p => {
    setStep(Math.min(2, Math.floor(p * 3)));
    bar.style.transform = `scaleY(${p.toFixed(4)})`;
    if (!reduceMotion.matches) {
      const rot = -18 + p * 36, x = (0.5 - p) * Math.min(160, innerWidth * 0.1), s = 0.88 + Math.sin(p * Math.PI) * 0.16;
      shoeBox.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) rotate(${rot.toFixed(3)}deg) scale(${s.toFixed(4)})`;
    }
  }, 120);
})();
