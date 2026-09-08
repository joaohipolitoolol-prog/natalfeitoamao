/* Cambia estos dos valores cuando el producto esté listo en Hotmart. */
const USD_PRICE = 9.9;
const HOTMART_CHECKOUT_URL = "";
const META_PIXEL_ID = "1051422547811449";

const FALLBACK_RATES = {
  USD: 1, EUR: 0.86, GBP: 0.74, CAD: 1.38, AUD: 1.51, NZD: 1.66,
  MXN: 18.1, COP: 3900, ARS: 1370, CLP: 965, PEN: 3.5, UYU: 40,
  PYG: 7150, BOB: 6.91, CRC: 505, GTQ: 7.67, HNL: 26.2, NIO: 36.8,
  DOP: 63.1, CHF: 0.8, SEK: 9.3, NOK: 10.1, DKK: 6.43, PLN: 3.67,
  CZK: 20.9, HUF: 337, RON: 4.36, ISK: 121.15, RSD: 100.96, ALL: 79.32,
  BAM: 1.68, MKD: 53.15, MDL: 17.22, UAH: 44.49, BZD: 2, JMD: 158.31,
  TTD: 6.77, GYD: 209.17, SRD: 37.99, BSD: 1
};

const COUNTRY_CURRENCY = {
  US:"USD",EC:"USD",SV:"USD",PA:"USD",PR:"USD",ES:"EUR",PT:"EUR",FR:"EUR",DE:"EUR",IT:"EUR",IE:"EUR",NL:"EUR",BE:"EUR",AT:"EUR",FI:"EUR",GR:"EUR",AD:"EUR",LU:"EUR",CY:"EUR",MT:"EUR",EE:"EUR",LV:"EUR",LT:"EUR",SK:"EUR",SI:"EUR",HR:"EUR",BG:"EUR",
  MX:"MXN",CO:"COP",AR:"ARS",CL:"CLP",PE:"PEN",UY:"UYU",PY:"PYG",BO:"BOB",CR:"CRC",GT:"GTQ",HN:"HNL",NI:"NIO",DO:"DOP",
  GB:"GBP",CA:"CAD",AU:"AUD",NZ:"NZD",CH:"CHF",SE:"SEK",NO:"NOK",DK:"DKK",PL:"PLN",CZ:"CZK",HU:"HUF",RO:"RON",IS:"ISK",RS:"RSD",AL:"ALL",BA:"BAM",MK:"MKD",MD:"MDL",UA:"UAH",BZ:"BZD",JM:"JMD",TT:"TTD",GY:"GYD",SR:"SRD",BS:"BSD"
};

const TIMEZONE_COUNTRY = {
  "America/Mexico_City":"MX","America/Monterrey":"MX","America/Bogota":"CO","America/Lima":"PE","America/Santiago":"CL","America/Argentina/Buenos_Aires":"AR",
  "America/Montevideo":"UY","America/Asuncion":"PY","America/La_Paz":"BO","America/Costa_Rica":"CR","America/Guatemala":"GT","America/Tegucigalpa":"HN",
  "America/Managua":"NI","America/Santo_Domingo":"DO","Europe/Madrid":"ES","Atlantic/Canary":"ES","Europe/Lisbon":"PT","Europe/London":"GB"
};

const locale = navigator.language || "es-US";
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let region = "";
try { region = new Intl.Locale(locale).region || ""; } catch {}
if (!region) region = TIMEZONE_COUNTRY[timezone] || "US";

let currency = COUNTRY_CURRENCY[region] || "USD";

const priceFormatter = (selectedCurrency) => new Intl.NumberFormat(locale, {
  style: "currency", currency: selectedCurrency, maximumFractionDigits: ["COP","CLP","PYG","ARS","HUF"].includes(selectedCurrency) ? 0 : 2
});

const paintPrice = (rates = FALLBACK_RATES) => {
  const rate = rates[currency] || 1;
  const value = USD_PRICE * rate;
  const formatted = priceFormatter(currency).format(value);
  document.querySelectorAll("[data-price-text]").forEach((node) => node.textContent = formatted);
  const note = document.querySelector("#currency-note");
  if (note) note.textContent = currency === "USD"
    ? "Precio mostrado en dólares estadounidenses."
    : `Aproximadamente ${formatted}. Hotmart confirma el valor final antes del pago.`;
};

const applyRegion = (nextRegion) => {
  if (nextRegion) region = nextRegion;
  currency = COUNTRY_CURRENCY[region] || "USD";
  const word = region === "ES" ? "belén" : "pesebre";
  document.querySelectorAll("[data-product-word]").forEach((node) => {
    if (!node.dataset.wordCase) node.dataset.wordCase = node.textContent[0] === node.textContent[0].toUpperCase() ? "upper" : "lower";
    node.textContent = node.dataset.wordCase === "upper" ? word[0].toUpperCase() + word.slice(1) : word;
  });
  paintPrice();
};

applyRegion(region);
fetch("/api/geo", { credentials: "same-origin" })
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((data) => { if (data?.country) applyRegion(data.country); })
  .catch(() => {});

const initTracking = () => {
  if (!META_PIXEL_ID || window.fbq) return;
  !(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
};
window.addEventListener("load", initTracking, { once:true });

const christmas = new Date(new Date().getFullYear(), 11, 25);
if (new Date() > christmas) christmas.setFullYear(christmas.getFullYear() + 1);

const updateCountdown = () => {
  const remaining = Math.max(0, christmas.getTime() - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const topDays = document.querySelector("#urgency-count");
  if (topDays) topDays.textContent = Math.ceil(remaining / 86400000);
  [["#offer-days",days],["#offer-hours",hours],["#offer-minutes",minutes],["#offer-seconds",seconds]].forEach(([selector,value]) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = String(value).padStart(2, "0");
  });
};
updateCountdown();
setInterval(updateCountdown, 1000);

const withTracking = (url) => {
  if (!url) return "";
  const next = new URL(url);
  new URLSearchParams(window.location.search).forEach((value, key) => next.searchParams.set(key, value));
  return next.toString();
};

const modal = document.querySelector("#checkout-modal");
const closeModal = () => { modal?.classList.remove("open"); modal?.setAttribute("aria-hidden","true"); };
document.querySelectorAll(".checkout-button").forEach((button) => button.addEventListener("click", () => {
  const url = withTracking(HOTMART_CHECKOUT_URL);
  if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout", { value:USD_PRICE, currency:"USD", content_name:"Pesebre de Fieltro" });
  if (url) { window.location.href = url; return; }
  modal?.classList.add("open"); modal?.setAttribute("aria-hidden","false");
}));
modal?.querySelector(".modal-close")?.addEventListener("click", closeModal);
modal?.querySelector(".modal-ok")?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });

document.querySelectorAll('a[href="#oferta"]').forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault(); document.querySelector("#oferta")?.scrollIntoView({behavior:"smooth"});
}));

const sticky = document.querySelector("#sticky-cta");
const pieces = document.querySelector("#piezas");
const offer = document.querySelector("#oferta");
if (sticky && pieces && offer && "IntersectionObserver" in window) {
  sticky.hidden = false;
  let pastPieces = false, offerVisible = false;
  const sync = () => sticky.classList.toggle("is-visible", pastPieces && !offerVisible);
  new IntersectionObserver(([entry]) => { pastPieces = entry.boundingClientRect.top < innerHeight * .4; sync(); }).observe(pieces);
  new IntersectionObserver(([entry]) => { offerVisible = entry.isIntersecting; sync(); }, {threshold:.2}).observe(offer);
}

const marquee = document.querySelector("#marquee-track");
if (marquee && pieces && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => marquee.classList.toggle("is-paused", !entry.isIntersecting), {rootMargin:"80px",threshold:.05}).observe(pieces);
}
