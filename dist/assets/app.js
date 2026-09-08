/* ========= Configuração ========= */
const checkoutUrls = {
  feltro: "https://pay.cakto.com.br/3cacksx_1089575",
  feltroBump: "",
};

const metaPixelId = "1051422547811449";
const BACK_REDIRECT_PATH = "voltar";

const BASE_PRICE = 37;
const BUMP_PRICE = 27;

/* ========= Meta Pixel + UTMify (depois do load, não compete com LCP) ========= */
const initPixel = () => {
  if (!metaPixelId || window.fbq) return;
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
  window.fbq("init", metaPixelId);
  window.fbq("track", "PageView");
};

const loadUtmify = () => {
  if (document.getElementById("utmify-pixel")) return;
  window.pixelId = metaPixelId;
  const pixel = document.createElement("script");
  pixel.id = "utmify-pixel";
  pixel.async = true;
  pixel.defer = true;
  pixel.src = "https://cdn.utmify.com.br/scripts/pixel/pixel.js";
  document.head.appendChild(pixel);

  const utms = document.createElement("script");
  utms.id = "utmify-utms";
  utms.async = true;
  utms.defer = true;
  utms.src = "https://cdn.utmify.com.br/scripts/utms/latest.js";
  utms.setAttribute("data-utmify-prevent-xcod-sck", "");
  utms.setAttribute("data-utmify-prevent-subids", "");
  document.head.appendChild(utms);
};

const track = (event, params) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", event, params);
    return;
  }
  window._nfTrackQueue = window._nfTrackQueue || [];
  window._nfTrackQueue.push([event, params]);
};

const flushTrackQueue = () => {
  if (typeof window.fbq !== "function" || !window._nfTrackQueue?.length) return;
  window._nfTrackQueue.splice(0).forEach(([event, params]) => window.fbq("track", event, params));
};

const bootTracking = () => {
  initPixel();
  loadUtmify();
  flushTrackQueue();
  setTimeout(flushTrackQueue, 1200);
};

const scheduleTracking = () => {
  const run = () => bootTracking();
  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 2500 });
  } else {
    setTimeout(run, 1800);
  }
};

if (document.readyState === "complete") scheduleTracking();
else window.addEventListener("load", scheduleTracking, { once: true });

/* ========= UTMs no checkout ========= */
const withUtmParams = (url) => {
  if (!url) return url;
  try {
    const next = new URL(url, window.location.href);
    const pageParams = new URLSearchParams(window.location.search);
    const storedKeys = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term", "fbclid", "xcod", "sck", "src"];
    storedKeys.forEach((key) => {
      const fromQuery = pageParams.get(key);
      const fromStorage = localStorage.getItem(key);
      const value = fromQuery || fromStorage;
      if (value && value !== "null" && value !== "undefined") next.searchParams.set(key, value);
    });
    if (window.utmParams instanceof URLSearchParams) {
      window.utmParams.forEach((value, key) => {
        if (value) next.searchParams.set(key, value);
      });
    }
    return next.toString();
  } catch {
    return url;
  }
};

/* ========= Urgência até o Natal ========= */
const christmas = new Date(new Date().getFullYear(), 11, 25);
const now = new Date();
if (now > christmas) christmas.setFullYear(christmas.getFullYear() + 1);
const daysLeft = Math.max(0, Math.ceil((christmas - now) / 86400000));

const urgencyLine = document.querySelector("#urgency-line");
const urgencyCount = document.querySelector("#urgency-count");
const offerDays = document.querySelector("#offer-days");
const offerHours = document.querySelector("#offer-hours");
const offerMinutes = document.querySelector("#offer-minutes");
const offerSeconds = document.querySelector("#offer-seconds");
const offerDeadline = document.querySelector("#offer-deadline");

if (urgencyCount) {
  if (daysLeft === 0) {
    urgencyLine.innerHTML = "<p>É Natal <span>25/12</span></p>";
  } else {
    const line = urgencyLine.querySelector("p");
    if (line) {
      line.innerHTML = `Faltam <strong id="urgency-count">${daysLeft}</strong> ${
        daysLeft === 1 ? "dia" : "dias"
      } para o Natal <span>25/12</span>`;
    }
  }
}

const updateOfferCountdown = () => {
  if (!offerDays) return;
  const remaining = Math.max(0, christmas.getTime() - Date.now());
  offerDays.textContent = Math.floor(remaining / 86400000);
  offerHours.textContent = String(Math.floor((remaining % 86400000) / 3600000)).padStart(2, "0");
  offerMinutes.textContent = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
  offerSeconds.textContent = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
};

updateOfferCountdown();
if (offerDays) setInterval(updateOfferCountdown, 1000);

if (offerDeadline) {
  if (daysLeft === 0) {
    offerDeadline.textContent = "Receba os arquivos imediatamente e guarde para costurar quando quiser.";
  } else if (daysLeft <= 21) {
    offerDeadline.textContent = "Ainda dá tempo: receba agora, comece pelas figuras centrais e avance no seu ritmo.";
  } else if (daysLeft <= 60) {
    offerDeadline.textContent = "Receba agora e faça uma peça por vez até completar a cena.";
  } else {
    offerDeadline.textContent = "Comece com calma agora e chegue em dezembro com o presépio pronto.";
  }
}

/* ========= Checkout ========= */
const modal = document.querySelector("#checkout-modal");
const sticky = document.querySelector("#sticky-cta");
const offer = document.querySelector("#oferta");
const stickyTrigger = document.querySelector("#pecas");
const bumpCheckbox = document.querySelector("#bump-checkbox");
const checkoutTotal = document.querySelector("#checkout-total");

const updateTotal = () => {
  const withBump = Boolean(bumpCheckbox?.checked);
  const total = withBump ? BASE_PRICE + BUMP_PRICE : BASE_PRICE;
  if (checkoutTotal) {
    checkoutTotal.innerHTML = `Total hoje: <strong>R$${total}</strong>${
      withBump ? " <span class='bump-on'>(com árvore e estrelas)</span>" : ""
    }`;
  }
};

bumpCheckbox?.addEventListener("change", updateTotal);
updateTotal();

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

const resolveCheckoutUrl = () => {
  const withBump = Boolean(bumpCheckbox?.checked);
  const base = withBump ? checkoutUrls.feltroBump || checkoutUrls.feltro : checkoutUrls.feltro;
  return withUtmParams(base);
};

document.querySelectorAll(".checkout-button").forEach((button) =>
  button.addEventListener("click", () => {
    const withBump = Boolean(bumpCheckbox?.checked);
    const url = resolveCheckoutUrl();
    const value = withBump ? BASE_PRICE + BUMP_PRICE : BASE_PRICE;

    track("InitiateCheckout", {
      value,
      currency: "BRL",
      content_name: withBump ? "Presépio + bump árvore" : "Presépio de Feltro",
    });

    if (url) {
      // Marca que foi pro checkout: se voltar, aí sim abre /voltar
      sessionStorage.setItem("nf_to_checkout", "1");
      window.location.href = url;
      return;
    }
    if (modal) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      modal.querySelector(".modal-close")?.focus();
    }
  })
);

modal?.querySelector(".modal-close")?.addEventListener("click", closeModal);
modal?.querySelector(".modal-ok")?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open")) closeModal();
});

/* ========= Scroll suave até a oferta ========= */
let scrollRaf = 0;
let isProgrammaticScroll = false;

const smoothScrollTo = (el, duration = 2000) => {
  if (!el) return;
  if (scrollRaf) cancelAnimationFrame(scrollRaf);

  const startY = window.scrollY || window.pageYOffset;
  const targetY = Math.max(0, el.getBoundingClientRect().top + startY - 12);
  const distance = targetY - startY;
  if (Math.abs(distance) < 4) return;

  isProgrammaticScroll = true;
  const startTime = performance.now();
  // ease-out bem suave (público mais velho)
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const step = (now) => {
    const t = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + distance * easeOut(t));
    if (t < 1) {
      scrollRaf = requestAnimationFrame(step);
    } else {
      scrollRaf = 0;
      // libera sticky um frame depois, sem flash
      requestAnimationFrame(() => {
        isProgrammaticScroll = false;
      });
    }
  };
  scrollRaf = requestAnimationFrame(step);
};

document.querySelectorAll('a[href="#oferta"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const target = document.querySelector("#oferta");
    smoothScrollTo(target, 2000);
    // não mexe no hash durante o scroll (isso causava o "limpão")
  });
});

/* ========= Sticky via IntersectionObserver ========= */
if (sticky && stickyTrigger && offer && "IntersectionObserver" in window) {
  sticky.hidden = false;
  let pastPieces = false;
  let offerInView = false;

  const syncSticky = () => {
    if (isProgrammaticScroll) return;
    sticky.classList.toggle("is-visible", pastPieces && !offerInView);
  };

  new IntersectionObserver(
    ([entry]) => {
      pastPieces = entry.boundingClientRect.top < window.innerHeight * 0.4;
      syncSticky();
    },
    { threshold: 0 }
  ).observe(stickyTrigger);

  new IntersectionObserver(
    ([entry]) => {
      offerInView = entry.isIntersecting;
      syncSticky();
    },
    { threshold: 0.2, rootMargin: "0px 0px -20% 0px" }
  ).observe(offer);
} else if (sticky) {
  sticky.hidden = true;
}

/* ========= Marquee: pausa fora da tela (evita branco/GPU no mobile) ========= */
(() => {
  const track = document.querySelector("#marquee-track");
  const section = document.querySelector("#pecas");
  if (!track || !section || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      track.classList.toggle("is-paused", !entry.isIntersecting);
    },
    { rootMargin: "80px 0px", threshold: 0.05 }
  );
  io.observe(section);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) track.classList.add("is-paused");
    else if (section.getBoundingClientRect().bottom > 0 && section.getBoundingClientRect().top < window.innerHeight) {
      track.classList.remove("is-paused");
    }
  });
})();

/* ========= Back redirect: SÓ se a pessoa voltou do checkout ========= */
(() => {
  const path = window.location.pathname.replace(/\\/g, "/");
  const isBackPage = /\/voltar\/?$/i.test(path) || /voltar\.html?$/i.test(path);
  if (isBackPage) {
    sessionStorage.removeItem("nf_to_checkout");
    return;
  }

  const sendToVoltar = () => {
    if (sessionStorage.getItem("nf_to_checkout") !== "1") return false;
    sessionStorage.removeItem("nf_to_checkout");
    if (typeof window.fbq === "function") window.fbq("trackCustom", "BackRedirect");
    const backUrl = new URL(BACK_REDIRECT_PATH, window.location.href);
    backUrl.search = window.location.search;
    window.location.replace(backUrl.toString());
    return true;
  };

  // Volta do checkout (bfcache ou back/forward)
  window.addEventListener("pageshow", (event) => {
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    const cameBack = event.persisted || nav?.type === "back_forward";
    if (cameBack) sendToVoltar();
  });

  // Fallback: se a LP reabre com a flag (alguns mobile não reportam back_forward)
  if (sessionStorage.getItem("nf_to_checkout") === "1") {
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    if (nav?.type === "back_forward") sendToVoltar();
  }
})();
