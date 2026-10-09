// hero.js — Hero entrance and scroll parallax.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Hero
   ========================================================= */
// The floor reflection is a second full drawing; touch devices hide it (css/14-mobile.css), so don't build it there.
const HERO_SHOE = ["#16171b", "#c6ff3d", "#ececf0"];
$("#hero-stage").innerHTML = shoeSVG(HERO_SHOE)
  + (matchMedia("(pointer: coarse)").matches ? "" : shoeSVG(HERO_SHOE, 0, "hero__reflect"));
if (!reduceMotion.matches) {
  const hero = $("#hero"), text = $("#hero-text"), stage = $("#hero-stage");
  // 0 with the hero at the top of the page, 1 once it has scrolled fully out
  addEffect(hero, r => clamp(-r.top / r.height), p => {
    text.style.transform = `translate3d(0, ${(p * -220).toFixed(2)}px, 0) scale(${(1 - p * 0.16).toFixed(4)})`;
    text.style.opacity = clamp(1 - p * 1.8).toFixed(3);
    stage.style.transform = `translate3d(0, ${(p * -70).toFixed(2)}px, 0) rotate(${(-6 + p * 16).toFixed(3)}deg) scale(${(1 + p * 0.12).toFixed(4)})`;
    hero.style.setProperty("--hp", p.toFixed(4));   // glow + court drift slower than the content (depth)
  }, 90);
  // eyebrow → title → tag cascade in CSS ([data-enter], css/15-motion.css); the shoe glides in right after
  stage.animate([{ opacity: 0, transform: "translate3d(18%, 30px, 0) rotate(-14deg) scale(.92)" }, { opacity: 1, transform: "translate3d(0,0,0) rotate(-6deg) scale(1)" }],
    { duration: 1500, delay: 320, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "backwards" });
}
