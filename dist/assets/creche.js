/* Prix en euros. Ajoutez l'URL Hotmart dès que le produit FR est créé. */
const EUR_PRICE = 15;
const HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/C107694204N?checkoutMode=10";
const META_PIXEL_ID = "1051422547811449";

const FALLBACK_RATES = {
  EUR: 1, USD: 1.16, GBP: 0.86, CHF: 0.93, CAD: 1.6, AUD: 1.75, NZD: 1.93,
  SEK: 10.8, NOK: 11.7, DKK: 7.46, PLN: 4.27, CZK: 24.3, HUF: 392, RON: 5.07
};

const COUNTRY_CURRENCY = {
  IT:"EUR",ES:"EUR",PT:"EUR",FR:"EUR",DE:"EUR",IE:"EUR",NL:"EUR",BE:"EUR",AT:"EUR",FI:"EUR",GR:"EUR",AD:"EUR",LU:"EUR",CY:"EUR",MT:"EUR",EE:"EUR",LV:"EUR",LT:"EUR",SK:"EUR",SI:"EUR",HR:"EUR",BG:"EUR",
  US:"USD",GB:"GBP",CH:"CHF",CA:"CAD",AU:"AUD",NZ:"NZD",SE:"SEK",NO:"NOK",DK:"DKK",PL:"PLN",CZ:"CZK",HU:"HUF",RO:"RON"
};

const TIMEZONE_COUNTRY = {
  "Europe/Rome":"IT","Europe/Vatican":"IT","Europe/Madrid":"ES","Atlantic/Canary":"ES","Europe/Lisbon":"PT","Europe/London":"GB","Europe/Paris":"FR","Europe/Berlin":"DE","Europe/Zurich":"CH"
};

const locale = navigator.language || "fr-FR";
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let region = "";
try { region = new Intl.Locale(locale).region || ""; } catch {}
if (!region) region = TIMEZONE_COUNTRY[timezone] || "FR";

let currency = COUNTRY_CURRENCY[region] || "EUR";

const priceFormatter = (selectedCurrency) => new Intl.NumberFormat(locale.startsWith("fr") ? "fr-FR" : locale, {
  style: "currency",
  currency: selectedCurrency,
  maximumFractionDigits: 2
});

const paintPrice = (rates = FALLBACK_RATES) => {
  const rate = rates[currency] || rates.EUR || 1;
  const value = currency === "EUR" ? EUR_PRICE : EUR_PRICE * rate;
  const formatted = priceFormatter(currency).format(value);
  document.querySelectorAll("[data-price-text]").forEach((node) => {
    node.textContent = formatted;
  });
  const note = document.querySelector("#currency-note");
  if (note) {
    note.textContent = currency === "EUR"
      ? "Prix en euros. Paiement unique."
      : `Environ ${formatted}. Hotmart confirme le montant final avant le paiement.`;
  }
};

const applyRegion = (nextRegion) => {
  if (nextRegion) region = nextRegion;
  currency = COUNTRY_CURRENCY[region] || "EUR";
  paintPrice();
};

applyRegion(region);
fetch("/api/geo", { credentials: "same-origin" })
  .then((response) => (response.ok ? response.json() : Promise.reject()))
  .then((data) => { if (data?.country) applyRegion(data.country); })
  .catch(() => {});

const initTracking = () => {
  if (!META_PIXEL_ID || window.fbq) return;
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
};
window.addEventListener("load", initTracking, { once: true });

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
  [
    ["#offer-days", days],
    ["#offer-hours", hours],
    ["#offer-minutes", minutes],
    ["#offer-seconds", seconds]
  ].forEach(([selector, value]) => {
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
const closeModal = () => {
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
};

document.querySelectorAll(".checkout-button").forEach((button) =>
  button.addEventListener("click", () => {
    const url = withTracking(HOTMART_CHECKOUT_URL);
    if (typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", {
        value: EUR_PRICE,
        currency: "EUR",
        content_name: "Crèche en Feutrine"
      });
    }
    if (url) {
      window.location.href = url;
      return;
    }
    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden", "false");
  })
);
modal?.querySelector(".modal-close")?.addEventListener("click", closeModal);
modal?.querySelector(".modal-ok")?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.querySelectorAll('a[href="#offre"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#offre")?.scrollIntoView({ behavior: "smooth" });
  })
);

const sticky = document.querySelector("#sticky-cta");
const pieces = document.querySelector("#pieces");
const offer = document.querySelector("#offre");
if (sticky && pieces && offer && "IntersectionObserver" in window) {
  sticky.hidden = false;
  let pastPieces = false;
  let offerVisible = false;
  const sync = () => sticky.classList.toggle("is-visible", pastPieces && !offerVisible);
  new IntersectionObserver(([entry]) => {
    pastPieces = entry.boundingClientRect.top < innerHeight * 0.4;
    sync();
  }).observe(pieces);
  new IntersectionObserver(
    ([entry]) => {
      offerVisible = entry.isIntersecting;
      sync();
    },
    { threshold: 0.2 }
  ).observe(offer);
}

const marquee = document.querySelector("#marquee-track");
if (marquee && pieces && "IntersectionObserver" in window) {
  new IntersectionObserver(
    ([entry]) => marquee.classList.toggle("is-paused", !entry.isIntersecting),
    { rootMargin: "80px", threshold: 0.05 }
  ).observe(pieces);
}
