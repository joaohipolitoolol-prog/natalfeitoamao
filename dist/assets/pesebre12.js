/* Cambia estos dos valores cuando el producto esté listo en Hotmart. */
const USD_PRICE = 12;
const HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/T107528025E?off=4huaes9l&checkoutMode=10";
const META_PIXEL_ID = "1051422547811449";

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

const supportedCurrencies = new Set(["USD","MXN","COP","ARS","CLP","PEN","EUR","BRL","UYU","CRC","GTQ"]);
const pickers = document.querySelectorAll("[data-currency-select]");
let manualCurrency = "";
try {
  const saved = sessionStorage.getItem("nf_es_currency");
  if (supportedCurrencies.has(saved)) manualCurrency = saved;
} catch {}
let currency = manualCurrency || COUNTRY_CURRENCY[region] || "USD";
if (!supportedCurrencies.has(currency)) currency = "USD";
let referenceRates = { USD: 1 };
let ratesDate = "";
let ratesFailed = false;

const paintPrice = () => {
  const rate = referenceRates[currency];
  const converted = currency !== "USD" && Number.isFinite(rate) && rate > 0;
  const formatted = converted
    ? "≈ " + new Intl.NumberFormat("es", { style: "currency", currency, currencyDisplay: "code", maximumFractionDigits: ["COP","CLP","ARS"].includes(currency) ? 0 : 2 }).format(USD_PRICE * rate)
    : "US$ 12";
  document.querySelectorAll("[data-price-text]").forEach((node) => node.textContent = formatted);
  pickers.forEach((picker) => { picker.value = currency; });
  document.querySelectorAll("[data-currency-note]").forEach((note) => {
    note.textContent = converted
      ? `Precio base: US$12. Conversión aproximada (${ratesDate}); no incluye impuestos. El importe final se confirma en Hotmart.`
      : currency !== "USD"
        ? ratesFailed ? "La conversión no está disponible. Precio base: US$12. Consulta el importe final y los impuestos en Hotmart." : "Consultando conversión… Precio base: US$12. Hotmart confirma el importe final."
        : "Precio base: US$12. Hotmart confirma la moneda, los impuestos y el importe final antes de pagar.";
  });
};

const applyRegion = (nextRegion) => {
  if (nextRegion) region = nextRegion;
  if (!manualCurrency) {
    currency = COUNTRY_CURRENCY[region] || "USD";
    if (!supportedCurrencies.has(currency)) currency = "USD";
  }
  const word = region === "ES" ? "belén" : "pesebre";
  document.querySelectorAll("[data-product-word]").forEach((node) => {
    if (!node.dataset.wordCase) node.dataset.wordCase = node.textContent[0] === node.textContent[0].toUpperCase() ? "upper" : "lower";
    node.textContent = node.dataset.wordCase === "upper" ? word[0].toUpperCase() + word.slice(1) : word;
  });
  paintPrice();
};
pickers.forEach((picker) => picker.addEventListener("change", () => {
  if (!supportedCurrencies.has(picker.value)) return;
  manualCurrency = picker.value;
  currency = manualCurrency;
  try { sessionStorage.setItem("nf_es_currency", manualCurrency); } catch {}
  paintPrice();
}));
applyRegion(region);
fetch("/api/geo", { credentials: "same-origin", signal: AbortSignal.timeout(5000) })
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((data) => { if (data?.country) applyRegion(data.country); })
  .catch(() => {});
fetch("/api/rates", { signal: AbortSignal.timeout(6500) })
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((data) => {
    if (data.base !== "USD" || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Date.now() - Date.parse(data.date) > 7 * 86400000) throw new Error("Invalid rates");
    for (const [code, value] of Object.entries(data.rates || {})) {
      if (supportedCurrencies.has(code) && Number.isFinite(value) && value > 0) referenceRates[code] = value;
    }
    ratesDate = data.date;
    ratesFailed = true; // A missing selected currency still gets an honest fallback.
    paintPrice();
  })
  .catch(() => { ratesFailed = true; paintPrice(); });

const initTracking = () => {
  if (!META_PIXEL_ID || window.fbq) return;
  !(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
  const am = typeof window.nfGetAdvancedMatching === "function" ? window.nfGetAdvancedMatching() : {};
  window.fbq("init", META_PIXEL_ID, {
    em: am.em,
    ph: am.ph,
    fn: am.fn,
    ln: am.ln,
    country: am.country,
    external_id: am.external_id,
  });
  window.fbq("track", "PageView");
};
// The deferred script runs after parsing. Register PageView before waiting for every image.
initTracking();

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

document.querySelectorAll("a.checkout-button").forEach((link) => {
  link.href = withTracking(HOTMART_CHECKOUT_URL);
});

const modal = document.querySelector("#checkout-modal");
const closeModal = () => { modal?.classList.remove("open"); modal?.setAttribute("aria-hidden","true"); };
document.querySelectorAll(".checkout-button").forEach((button) => button.addEventListener("click", (event) => {
  event.preventDefault();
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
