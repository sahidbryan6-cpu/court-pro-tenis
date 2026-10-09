// viewer.js — Segmented control helper and the colorway/angle viewer.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Segmented control helper
   ========================================================= */
function setSegmented(seg, activeBtn) {
  $$("button", seg).forEach(b => b.setAttribute("aria-pressed", String(b === activeBtn)));
  const thumb = $(".segmented__thumb", seg);
  thumb.style.width = activeBtn.offsetWidth + "px";
  thumb.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
}

/* =========================================================
   Closer look (colorways + angles)
   ========================================================= */
(function viewer() {
  const stage = $("#viewer-stage"), sw = $("#viewer-swatches"), seg = $("#viewer-angles");
  let ci = 0, angle = 0, token = 0;
  sw.innerHTML = COLORWAYS.map((c, i) => `<button class="swatch press" style="--c:${c.c[0]};--c2:${c.c[1]}" data-name="${c.name}" aria-label="${c.name}" aria-pressed="${i === 0}"><span></span></button>`).join("");
  // Directional swap: the current shoe leaves toward one side and the new one arrives from the other,
  // so moving right through the swatches feels like moving along a shelf. Rapid clicks cancel cleanly.
  function render(animated, dir = 1) {
    const c = COLORWAYS[ci];
    $("#viewer-name").innerHTML = `${c.name}<span>${c.note}</span>`;
    $(".viewer").style.setProperty("--tint", c.c[1]);
    const paint = () => { stage.innerHTML = shoeSVG(c.c, angle); return $("svg", stage); };
    if (!animated || reduceMotion.matches) return paint();
    const my = ++token, old = $("svg", stage);
    const enter = () => {
      if (my !== token) return;
      paint().animate([
        { transform: `translate3d(${70 * dir}px, 0, 0) rotate(${5 * dir}deg) scale(.96)`, opacity: 0 },
        { transform: "none", opacity: 1 },
      ], { duration: 560, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    };
    if (!old) return enter();
    old.getAnimations().forEach(a => a.cancel());
    old.animate([
      { transform: "none", opacity: 1 },
      { transform: `translate3d(${-60 * dir}px, 0, 0) rotate(${-4 * dir}deg) scale(.96)`, opacity: 0 },
    ], { duration: 200, easing: "cubic-bezier(0.55, 0, 1, 0.45)", fill: "forwards" }).finished.then(enter, enter);
  }
  sw.addEventListener("click", e => {
    const b = e.target.closest(".swatch"); if (!b) return;
    const i = $$(".swatch", sw).indexOf(b); if (i === ci) return;
    const dir = i > ci ? 1 : -1;
    ci = i; $$(".swatch", sw).forEach((x, k) => x.setAttribute("aria-pressed", String(k === i)));
    render(true, dir);
  });
  seg.addEventListener("click", e => {
    const b = e.target.closest("button[data-angle]"); if (!b) return;
    const next = Number(b.dataset.angle); if (next === angle) return;
    const dir = next > angle ? 1 : -1;
    angle = next;
    setSegmented(seg, b);
    render(true, dir);
  });
  render(false);
})();
