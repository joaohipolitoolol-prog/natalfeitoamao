/* Preventa del curso en video · ES */
const USD_PRICE = 27;
const USD_LAUNCH = 47;
const USD_DISCOUNT = 21;
const cursoCheckoutUrl = "https://pay.hotmart.com/W107576786J?checkoutMode=10";
const cursoDescuentoUrl = "https://pay.hotmart.com/W107576786J?off=nm7xcamk&checkoutMode=10";
const declineUrl = "/gracias";
const CHECKOUT_FLAG = "nf_curso_es_checkout";
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
let rates = FALLBACK_RATES;

const priceFormatter = (selectedCurrency) => new Intl.NumberFormat(locale, {
  style: "currency",
  currency: selectedCurrency,
  maximumFractionDigits: ["COP", "CLP", "PYG", "ARS", "HUF"].includes(selectedCurrency) ? 0 : 2,
});

const formatUsd = (usd) => {
  const rate = rates[currency] || 1;
  return priceFormatter(currency).format(usd * rate);
};

const paintPrices = () => {
  const now = formatUsd(USD_PRICE);
  const launch = formatUsd(USD_LAUNCH);
  const discount = formatUsd(USD_DISCOUNT);

  document.querySelectorAll("[data-price-now]").forEach((node) => {
    node.textContent = now;
  });
  document.querySelectorAll("[data-price-launch]").forEach((node) => {
    node.textContent = launch;
  });
  document.querySelectorAll("[data-price-discount]").forEach((node) => {
    node.textContent = discount;
  });

  const alert = document.querySelector("[data-price-alert]");
  if (alert) {
    alert.textContent = `Preventa: ${now} ahora · ${launch} después del 10 de octubre`;
  }

  const offerText = document.querySelector("[data-price-offer-text]");
  if (offerText) {
    offerText.textContent = `Hoy aseguras el precio de fundadora. Después del 10 de octubre, el curso sube a ${launch}.`;
  }

  const was = document.querySelector("[data-price-was]");
  if (was) was.textContent = `${launch} después del lanzamiento`;

  const cta = document.querySelector("[data-curso-accept]");
  if (cta) cta.textContent = `Sí, quiero la preventa por ${now}`;

  const discountCta = document.querySelector("[data-curso-descuento]");
  if (discountCta) discountCta.textContent = `Sí, quiero por ${discount}`;

  const note = document.querySelector("[data-currency-note]");
  if (note) {
    note.textContent =
      currency === "USD"
        ? "Pago único · acceso el 10/10"
        : `Aprox. ${now}. Hotmart confirma el valor final. Acceso el 10/10`;
  }

  const lastWas = document.querySelector("[data-price-discount-was]");
  if (lastWas) lastWas.textContent = now;
};

const applyRegion = (nextRegion) => {
  if (nextRegion) region = nextRegion;
  currency = COUNTRY_CURRENCY[region] || "USD";
  paintPrices();
};

applyRegion(region);
fetch("/api/geo", { credentials: "same-origin" })
  .then((response) => (response.ok ? response.json() : Promise.reject()))
  .then((data) => {
    if (data?.country) applyRegion(data.country);
  })
  .catch(() => {});

const withTracking = (url) => {
  try {
    const next = new URL(url);
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (value) next.searchParams.set(key, value);
    });
    return next.toString();
  } catch {
    return url;
  }
};

const lastChance = document.querySelector("#curso-last-chance");

const openLastChance = () => {
  if (!lastChance) {
    window.location.href = declineUrl;
    return;
  }
  lastChance.classList.add("open");
  lastChance.setAttribute("aria-hidden", "false");
  lastChance.querySelector("[data-curso-descuento]")?.focus();
};

const closeLastChance = () => {
  if (!lastChance) return;
  lastChance.classList.remove("open");
  lastChance.setAttribute("aria-hidden", "true");
};

function goCheckout(url, value, name) {
  if (!url) return;
  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      value,
      currency: "USD",
      content_name: name,
    });
  }
  sessionStorage.setItem(CHECKOUT_FLAG, "1");
  window.location.href = withTracking(url);
}

function handleAccept() {
  goCheckout(cursoCheckoutUrl, USD_PRICE, "Preventa Curso Pesebre en Video");
}

function handleDescuento() {
  goCheckout(cursoDescuentoUrl, USD_DISCOUNT, "Preventa Curso Pesebre · última chance $21");
}

function handleDecline(event) {
  if (event) event.preventDefault();
  openLastChance();
}

function handleFinalDecline(event) {
  if (event) event.preventDefault();
  closeLastChance();
  window.location.href = declineUrl;
}

document.querySelectorAll("[data-curso-accept]").forEach((el) => {
  el.addEventListener("click", handleAccept);
});
document.querySelectorAll("[data-curso-decline]").forEach((el) => {
  el.addEventListener("click", handleDecline);
});
document.querySelectorAll("[data-curso-descuento]").forEach((el) => {
  el.addEventListener("click", handleDescuento);
});
document.querySelectorAll("[data-curso-final-decline]").forEach((el) => {
  el.addEventListener("click", handleFinalDecline);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lastChance?.classList.contains("open")) {
    handleFinalDecline(event);
  }
});

(() => {
  const sendToLastChance = () => {
    if (sessionStorage.getItem(CHECKOUT_FLAG) !== "1") return false;
    sessionStorage.removeItem(CHECKOUT_FLAG);
    if (typeof window.fbq === "function") window.fbq("trackCustom", "CursoEsBackRedirect");
    openLastChance();
    return true;
  };

  window.addEventListener("pageshow", (event) => {
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    const cameBack = event.persisted || nav?.type === "back_forward";
    if (cameBack) sendToLastChance();
  });

  if (sessionStorage.getItem(CHECKOUT_FLAG) === "1") {
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    if (nav?.type === "back_forward") sendToLastChance();
  }
})();

if (META_PIXEL_ID && !window.fbq) {
  window.addEventListener(
    "load",
    () => {
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
    },
    { once: true }
  );
}
