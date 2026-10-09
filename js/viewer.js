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
  let ci = 0, angle = 0, swapT;
  sw.innerHTML = COLORWAYS.map((c, i) => `<button class="swatch press" style="--c:${c.c[0]};--c2:${c.c[1]}" data-name="${c.name}" aria-label="${c.name}" aria-pressed="${i === 0}"><span></span></button>`).join("");
  function render(animated) {
    const c = COLORWAYS[ci];
    $("#viewer-name").innerHTML = `${c.name}<span>${c.note}</span>`;
    $(".viewer").style.setProperty("--tint", c.c[1]);
    const paint = () => { stage.innerHTML = shoeSVG(c.c, angle); };
    if (!animated || reduceMotion.matches) return paint();
    clearTimeout(swapT);
    stage.classList.add("is-swapping");
    swapT = setTimeout(() => { paint(); requestAnimationFrame(() => stage.classList.remove("is-swapping")); }, 220);
  }
  sw.addEventListener("click", e => {
    const b = e.target.closest(".swatch"); if (!b) return;
    const i = $$(".swatch", sw).indexOf(b); if (i === ci) return;
    ci = i; $$(".swatch", sw).forEach((x, k) => x.setAttribute("aria-pressed", String(k === i)));
    render(true);
  });
  seg.addEventListener("click", e => {
    const b = e.target.closest("button[data-angle]"); if (!b) return;
    angle = Number(b.dataset.angle);
    setSegmented(seg, b);
    render(true);
  });
  render(false);
})();
