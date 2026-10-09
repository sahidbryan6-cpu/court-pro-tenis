// main.js — Entry point: first render of everything.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Init
   ========================================================= */
// Trailing "›" in text links becomes a span that nudges toward its destination on hover
function decorateChevrons(root = document) {
  $$(".link", root).forEach(el => {
    const t = el.lastChild;
    if (t && t.nodeType === 3 && t.textContent.trim().endsWith("›")) {
      t.textContent = t.textContent.replace(/\s*›\s*$/, "");
      el.insertAdjacentHTML("beforeend", '<span class="chev" aria-hidden="true">›</span>');
    }
  });
}
$("#year").textContent = new Date().getFullYear();
renderNav();
renderBag();
update(true);
requestAnimationFrame(() => {
  setSegmented($("#view-seg"), $("#view-seg button[aria-pressed='true']"));
  setSegmented($("#viewer-angles"), $("#viewer-angles button[aria-pressed='true']"));
});
themeLabel();
decorateChevrons();
