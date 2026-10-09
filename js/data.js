// data.js — Catalog data, highlights, colorways, comparison specs and the page state.
// Loaded as a classic script (works from file://); see the load order in index.html.

/* =========================================================
   Data
   ========================================================= */
const NAV = [
  { label: "Raquetas", groups: [["Comprar raquetas", ["Tennis", "Pádel", "Squash", "Junior"], true], ["Más", ["Cuerdas", "Grips", "Encordado"]]] },
  { label: "Palas" },
  { label: "Calzado", groups: [["Comprar calzado", ["Tennis", "Pádel", "Hombre", "Mujer", "Junior"], true], ["Por superficie", ["Cancha dura", "Arcilla", "Todo terreno"]]] },
  { label: "Maletas" },
  { label: "Accesorios", groups: [["Accesorios", ["Grips", "Overgrips", "Muñequeras", "Antivibradores"], true]] },
  { label: "Cuerdas" },
  { label: "Pelotas" },
  { label: "Ropa", groups: [["Comprar ropa", ["Hombre", "Mujer", "Niños"], true]] },
  { label: "Marcas", groups: [["Marcas", ["Adidas", "Asics", "Babolat", "Head"], true], ["", ["Lacoste", "Nike", "Wilson", "Yonex"], true]] },
  { label: "Outlet", accent: true },
  { label: "Sucursales" },
];

const CATEGORIES = [
  ["Todos", ["#f2f2f4", "#1d1d1f", "#e8e8ed"]],
  ["Tennis", ["#1d1d1f", "#f2f2f4", "#e8e8ed"]],
  ["Pádel", ["#2457c4", "#f2e030", "#f4f4f6"]],
  ["Arcilla", ["#f4f4f6", "#2fa36b", "#d8774a"]],
  ["Cancha dura", ["#1a1c22", "#c6ff3d", "#f4f4f6"]],
  ["Ofertas", ["#ff9f0a", "#1d1d1f", "#f4f4f6"]],
  ["Mujer", ["#ffd1e6", "#e83c8a", "#f4f4f6"]],
  ["Junior", ["#7fd3ff", "#1d4ed8", "#f4f4f6"]],
];

// [vendor, name, price, compareAt, available, [upper, accent, sole], surface, isNew]
const RAW = [
  ["ASICS", "Game FF", 1960, 0, true, ["#1a1a1a", "#e8432c", "#f2f2f2"], "Todo terreno", true],
  ["ASICS", "Gel Resolution X", 3150, 0, true, ["#1c2340", "#3d8bff", "#e9e9e9"], "Cancha dura", true],
  ["ASICS", "Gel Dedicate 9", 1750, 0, true, ["#151515", "#f2f2f4", "#f4f4f6"], "Todo terreno", false],
  ["ASICS", "Court FF 3 Clay", 3750, 0, true, ["#f4f4f4", "#2fa36b", "#d8774a"], "Arcilla", false],
  ["ADIDAS", "Barricade 14", 3225, 0, true, ["#f6f6f6", "#8d8d8d", "#e2e2e2"], "Cancha dura", true],
  ["YONEX", "Power Cushion Eclipsion 5", 3570, 0, true, ["#151515", "#f2e030", "#f4f4f6"], "Todo terreno", false],
  ["ADIDAS", "Court Spec 2", 1399, 0, true, ["#f6f6f6", "#2453c9", "#f0f0f0"], "Cancha dura", false],
  ["YONEX", "GRPHT THRTTL", 4499, 0, true, ["#e9e2d3", "#3b3b3b", "#d6cdb8"], "Todo terreno", true],
  ["NIKE", "Vapor 12 Clay", 4029, 0, true, ["#a9cdef", "#2f6fd1", "#c96b3c"], "Arcilla", false],
  ["BABOLAT", "Propulse Fury 3", 3140, 0, true, ["#1b1b1b", "#ff6a1a", "#2b2b2b"], "Todo terreno", false],
  ["YONEX", "FusionRev 5 All Court", 2100, 3310, true, ["#bfeee0", "#1d6b5a", "#f4f4f6"], "Todo terreno", false],
  ["ADIDAS", "Defiant Speed 2", 2500, 0, false, ["#151515", "#ff7a1a", "#ff7a1a"], "Cancha dura", false],
  ["ASICS", "Solution Speed FF 3", 3490, 0, true, ["#f6f6f6", "#111111", "#ededed"], "Cancha dura", true],
  ["ASICS", "Gel Challenger 14 Clay", 2690, 0, true, ["#2c4fa3", "#f2f2f4", "#c86a3e"], "Arcilla", false],
  ["BABOLAT", "Jet Mach 3 All Court", 3290, 3890, true, ["#f6f6f6", "#d42a2a", "#f1f1f1"], "Todo terreno", false],
  ["LACOSTE", "AG-LT 23 Ultra", 3990, 0, false, ["#f6f6f6", "#1c7a46", "#ececec"], "Cancha dura", false],
  ["HEAD", "Sprint Pro 3.5", 2890, 0, true, ["#121212", "#2d7fe0", "#e6e6e6"], "Todo terreno", false],
  ["NIKE", "Court Air Zoom GP Turbo", 3799, 0, false, ["#fbfbfb", "#141414", "#f2f2f2"], "Cancha dura", false],
  ["ASICS", "Gel Game 9 Clay", 1890, 2290, true, ["#8b8f96", "#c9f23b", "#c2683b"], "Arcilla", false],
  ["YONEX", "Power Cushion AD-Accel", 2690, 0, true, ["#2457c4", "#f2f2f4", "#f0f0f0"], "Cancha dura", false],
  ["ADIDAS", "Adizero Ubersonic 4.1", 3299, 0, true, ["#121212", "#ff5aa8", "#f1f1f1"], "Cancha dura", true],
  ["BABOLAT", "SFX 3 All Court", 2190, 0, false, ["#9aa0a6", "#1f1f1f", "#e7e7e7"], "Todo terreno", false],
  ["ASICS", "Gel Resolution 9 Clay", 2990, 3590, true, ["#f6f6f6", "#c8a24b", "#c9703f"], "Arcilla", false],
  ["LACOSTE", "Tech Point", 2490, 0, true, ["#f6f6f6", "#1b2a4a", "#ededed"], "Cancha dura", false],
  ["YONEX", "Eclipsion Z Wide", 3399, 0, true, ["#f6f6f6", "#9be22d", "#efefef"], "Todo terreno", false],
  ["ASICS", "Gel Dedicate 8 Padel", 1690, 0, true, ["#2f5cc8", "#f2e030", "#f1f1f1"], "Pádel", false],
  ["BABOLAT", "Movea Padel", 2790, 0, true, ["#1a3a8f", "#ffd22e", "#e9e9e9"], "Pádel", true],
  ["ADIDAS", "Barricade 13 Clay", 2890, 3490, false, ["#161616", "#d4b157", "#c86b3c"], "Arcilla", false],
  ["ASICS", "Court Slide 3", 1590, 0, true, ["#f6f6f6", "#1a1a1a", "#f0f0f0"], "Cancha dura", false],
  ["YONEX", "Power Cushion Sonicage 3", 2390, 0, true, ["#141414", "#e8e8e8", "#2a2a2a"], "Todo terreno", false],
  ["BABOLAT", "Jet Tere 2 Clay", 3590, 0, true, ["#f6f6f6", "#2fa0e0", "#c96b3c"], "Arcilla", true],
  ["ASICS", "Solution Swift FF 2", 2290, 0, true, ["#111111", "#c6ff3d", "#2b2b2b"], "Cancha dura", false],
];
const PRODUCTS = RAW.map(([vendor, title, price, compare, available, colors, surface, isNew], i) => ({
  id: i + 1, vendor, title, price, compare, available, colors, surface, isNew, created: i, sales: (i * 37) % 23,
}));

const HIGHLIGHTS = [
  { kicker: "Comodidad", title: "Amortiguación que responde.", text: "Espuma de doble densidad que absorbe el impacto y te devuelve la energía en cada paso.", bg: "radial-gradient(90% 80% at 70% 80%, #1e3a8a 0%, #0b1226 60%, #05070d 100%)", shoe: ["#1c2340", "#3d8bff", "#e9e9ec"] },
  { kicker: "Tracción", title: "Agarre que muerde la arcilla.", text: "Suela de espiga diseñada para deslizar con control sin acumular tierra.", bg: "radial-gradient(90% 80% at 70% 80%, #9a4a22 0%, #3b1a0c 60%, #120804 100%)", shoe: ["#f4f4f6", "#2fa36b", "#d8774a"] },
  { kicker: "Peso", title: "Ligera de verdad.", text: "Menos peso en el pie, más piernas en el tercer set.", bg: "radial-gradient(90% 80% at 70% 80%, #3f5e12 0%, #142008 60%, #050803 100%)", big: ["298", "g"] },
  { kicker: "Durabilidad", title: "Hecha para durar.", text: "Puntera reforzada contra el arrastre en saques y voleas bajas.", bg: "radial-gradient(90% 80% at 70% 80%, #3a3a40 0%, #141416 60%, #050505 100%)", shoe: ["#f6f6f8", "#111114", "#e8e8ec"] },
  { kicker: "Pagos", title: "Paga en 3 meses sin intereses.", text: "En toda la tienda con tarjetas participantes.", bg: "radial-gradient(90% 80% at 70% 80%, #5b2a86 0%, #1d0d2e 60%, #07030c 100%)", big: ["3", "MSI"] },
];

const COLORWAYS = [
  { name: "Medianoche Volt", note: "Negro con acentos volt", c: ["#16171b", "#c6ff3d", "#ececf0"] },
  { name: "Azul Glaciar", note: "Marino con azul eléctrico", c: ["#1c2340", "#3d8bff", "#e9e9ec"] },
  { name: "Arcilla", note: "Blanco con suela terracota", c: ["#f4f4f6", "#2fa36b", "#d8774a"] },
  { name: "Blanco Puro", note: "Blanco total con detalles grafito", c: ["#f7f7f9", "#2a2a2e", "#ececf0"] },
  { name: "Coral", note: "Coral con suela blanca", c: ["#ff6b5a", "#1d1d1f", "#f4f4f6"] },
];

const COMPARE = [
  { id: 2, tag: "Nuevo", for: "Estabilidad en cancha dura", weight: "380 g", drop: "10 mm", cushion: 4, support: 5 },
  { id: 13, tag: "Nuevo", for: "Velocidad y juego agresivo", weight: "320 g", drop: "8 mm", cushion: 3, support: 4 },
  { id: 4, tag: "", for: "Deslizamiento en arcilla", weight: "345 g", drop: "9 mm", cushion: 3, support: 4 },
];

const SIZES = ["25", "25.5", "26", "26.5", "27", "27.5", "28", "28.5", "29", "30"];
const FREE_SHIP = 1500;
const PAGE_SIZE = 12;

const state = {
  brands: new Set(), surfaces: new Set(), inStock: false, onSale: false,
  min: null, max: null, sort: "manual", shown: PAGE_SIZE, query: "", category: "Todos",
  bag: [], recent: [],
};
