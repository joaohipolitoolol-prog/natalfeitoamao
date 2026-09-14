/* Preventa del corso in video · IT */
/* TODO: colar URLs Hotmart depois de criar o produto + oferta com desconto */
const EUR_PRICE = 27;
const EUR_DISCOUNT = 21;
const corsoCheckoutUrl = ""; // ex: https://pay.hotmart.com/XXXX?checkoutMode=10
const corsoScontoUrl = ""; // ex: https://pay.hotmart.com/XXXX?off=YYYY&checkoutMode=10
const declineUrl = "/grazie";
const CHECKOUT_FLAG = "nf_corso_it_checkout";
const META_PIXEL_ID = "1051422547811449";

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
  lastChance.querySelector("[data-curso-desconto]")?.focus();
};

const closeLastChance = () => {
  if (!lastChance) return;
  lastChance.classList.remove("open");
  lastChance.setAttribute("aria-hidden", "true");
};

function goCheckout(url, value, name) {
  if (!url) {
    openLastChance();
    return;
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      value,
      currency: "EUR",
      content_name: name,
    });
  }
  sessionStorage.setItem(CHECKOUT_FLAG, "1");
  window.location.href = withTracking(url);
}

function handleAccept() {
  goCheckout(corsoCheckoutUrl, EUR_PRICE, "Preventa Corso Presepe in Video");
}

function handleSconto() {
  goCheckout(corsoScontoUrl, EUR_DISCOUNT, "Preventa Corso Presepe · ultima chance €21");
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
document.querySelectorAll("[data-curso-desconto]").forEach((el) => {
  el.addEventListener("click", handleSconto);
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
    if (typeof window.fbq === "function") window.fbq("trackCustom", "CorsoItBackRedirect");
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
      window.fbq("init", META_PIXEL_ID);
      window.fbq("track", "PageView");
    },
    { once: true }
  );
}
