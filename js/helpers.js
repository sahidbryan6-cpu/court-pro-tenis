// helpers.js — DOM shortcuts, formatting, and shoeSVG() which draws a shoe from the sprite.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Helpers
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const cap = v => v[0] + v.slice(1).toLowerCase();
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const PRODUCT_MAP = new Map(PRODUCTS.map(p => [p.id, p]));
const byId = id => PRODUCT_MAP.get(id);

// Each instance is a tiny <use> into the sprite, tinted through CSS variables.
// angle: 0 lateral, 1 dynamic (tilted), 2 medial (mirrored)
function shoeSVG([upper, accent, sole], angle = 0, cls = "") {
  const t = angle === 1 ? ' transform="rotate(-10 200 120) translate(0 10)"' : angle === 2 ? ' transform="scale(-1 1) translate(-400 0)"' : "";
  return `<svg class="${cls}" viewBox="0 0 400 220" aria-hidden="true" style="--m:${upper};--a:${accent};--s:${sole}"><use href="#shoe"${t}/></svg>`;
}
