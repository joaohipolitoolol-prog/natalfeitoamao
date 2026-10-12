/* Cambia estos dos valores cuando el producto esté listo en Hotmart. */
const USD_PRICE = 12;
const HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/T107528025E?off=4huaes9l&checkoutMode=10";
const META_PIXEL_ID = "1051422547811449";

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

const applyRegion = (nextRegion) => {
  if (nextRegion) region = nextRegion;
  const word = region === "ES" ? "belén" : "pesebre";
  document.querySelectorAll("[data-product-word]").forEach((node) => {
    if (!node.dataset.wordCase) node.dataset.wordCase = node.textContent[0] === node.textContent[0].toUpperCase() ? "upper" : "lower";
    node.textContent = node.dataset.wordCase === "upper" ? word[0].toUpperCase() + word.slice(1) : word;
  });
};
applyRegion(region);
const requestGeo = () => {
fetch("/api/geo", { credentials: "same-origin", signal: AbortSignal.timeout(5000) })
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((data) => { if (data?.country) applyRegion(data.country); })
  .catch(() => {});
};
if (document.readyState === "complete") { if ("requestIdleCallback" in window) requestIdleCallback(requestGeo,{timeout:1000}); else setTimeout(requestGeo,250); }
else window.addEventListener("load",()=>{ if ("requestIdleCallback" in window) requestIdleCallback(requestGeo,{timeout:1000}); else setTimeout(requestGeo,250); },{once:true});
const initTracking = () => {
  if (!META_PIXEL_ID || window.fbq) return;
  !(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version="2.0";n.queue=[];window.nfScheduleMeta(function(){t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)});})(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
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
  if (url) {
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      try { sessionStorage.setItem("nf_es_checkout_return", String(Date.now())); } catch {}
    }
    window.location.href = url; return;
  }
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


/* Recuperación: solo al volver del checkout, nunca al abrir o recargar la LP. */
(() => {
  if (!["/pesebre", "/pesebre12"].includes(window.location.pathname.replace(/\/$/, ""))) return;
  window.addEventListener("pageshow", (event) => {
    const navigation = performance.getEntriesByType?.("navigation")?.[0];
    if (!event.persisted && navigation?.type !== "back_forward") return;
    let started;
    try {
      started = Number(sessionStorage.getItem("nf_es_checkout_return"));
      sessionStorage.removeItem("nf_es_checkout_return");
    } catch { return; }
    const elapsed = Date.now() - started;
    if (!started || elapsed < 0 || elapsed > 86400000) return;
    const next = new URL("/volver-es", window.location.origin);
    next.search = window.location.search;
    if (typeof window.fbq === "function") window.fbq("trackCustom", "CheckoutReturnES");
    window.location.replace(next.toString());
  });
})();

