// gallery.js — Highlights carousel: autoplay, dots, paddles, centering.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Highlights gallery
   ========================================================= */
const AUTO_MS = 5000;
(function gallery() {
  const track = $("#gallery-track"), dots = $("#gallery-dots"), g = $("#gallery");
  track.innerHTML = HIGHLIGHTS.map((h, i) => `
    <article class="hl" style="--hl-bg:${h.bg}" data-i="${i}" aria-roledescription="diapositiva" aria-label="${i + 1} de ${HIGHLIGHTS.length}">
      <span class="hl__index">${String(i + 1).padStart(2, "0")} / ${String(HIGHLIGHTS.length).padStart(2, "0")}</span>
      <div class="hl__copy"><span class="hl__kicker"><i></i>${h.kicker}</span><h3>${h.title}</h3><p>${h.text}</p></div>
      ${h.shoe ? `<div class="hl__art">${shoeSVG(h.shoe)}</div>` : ""}
      ${h.big ? `<div class="hl__big grad-volt">${h.big[0]}<small>${h.big[1]}</small></div>` : ""}
    </article>`).join("");
  dots.innerHTML = HIGHLIGHTS.map((_, i) => `<button role="tab" aria-label="Ir a diapositiva ${i + 1}" aria-current="${i === 0}"><i></i></button>`).join("");
  g.style.setProperty("--auto", AUTO_MS + "ms");

  const slides = $$(".hl", track), dotBtns = $$("button", dots);
  let current = -1, playing = !reduceMotion.matches, visible = false, timer;

  function goTo(i) {
    i = (i + slides.length) % slides.length;
    const s = slides[i];
    track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: reduceMotion.matches ? "auto" : "smooth" });
  }
  function setCurrent(i) {
    if (i === current) return;
    current = i;
    slides.forEach((s, k) => s.classList.toggle("is-current", k === i));
    dotBtns.forEach((d, k) => {
      d.setAttribute("aria-current", String(k === i));
      const fill = d.firstElementChild; fill.style.animation = "none"; void fill.offsetWidth; fill.style.animation = "";
    });
    $("#gallery-prev").disabled = i === 0;
    $("#gallery-next").disabled = i === slides.length - 1;
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (playing && visible) timer = setTimeout(() => goTo(current + 1), AUTO_MS);
  }
  function setPlaying(v) {
    playing = v;
    g.classList.toggle("is-paused", !v);
    $("#gallery-play").setAttribute("aria-label", v ? "Pausar" : "Reproducir");
    $("#gallery-play-icon").innerHTML = v
      ? '<rect x="4" y="3" width="3.5" height="12" rx="1"/><rect x="10.5" y="3" width="3.5" height="12" rx="1"/>'
      : '<path d="M5 3.2v11.6c0 .6.7 1 1.2.6l9-5.8c.5-.3.5-1 0-1.3l-9-5.8C5.7 2.2 5 2.6 5 3.2z"/>';
    dotBtns.forEach(d => d.classList.toggle("is-static", !v));
    schedule();
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) setCurrent(Number(en.target.dataset.i)); });
  }, { root: track, threshold: 0.6 });
  slides.forEach(s => io.observe(s));
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    g.classList.toggle("is-paused", !visible || !playing);
    schedule();
  }, { threshold: 0.3 }).observe(g);

  dots.addEventListener("click", e => { const b = e.target.closest("button"); if (b) goTo(dotBtns.indexOf(b)); });
  $("#gallery-prev").onclick = () => goTo(current - 1);
  $("#gallery-next").onclick = () => goTo(current + 1);
  $("#gallery-play").onclick = () => setPlaying(!playing);
  ["pointerdown", "wheel"].forEach(ev => track.addEventListener(ev, () => { if (playing) setPlaying(false); }, { passive: true }));
  setPlaying(playing);
  setCurrent(0);
})();
