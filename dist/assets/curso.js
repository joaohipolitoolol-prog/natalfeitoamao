/* Pré-venda do curso em vídeo · BR */
const META_PIXEL_ID = "1051422547811449";
const cursoCheckoutUrl = "https://pay.wiapy.com/6aa7a62d2e178cb3a2cba9cd";
const cursoDescontoUrl = "https://pay.wiapy.com/2LGHYicjMSt";
const declineUrl = "/obrigado";
const CHECKOUT_FLAG = "nf_curso_checkout";

const withTracking = (url) => {
  try {
    const next = new URL(url);
    const params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"].forEach((key) => {
      const value = params.get(key);
      if (value && value !== "null" && value !== "undefined") next.searchParams.set(key, value);
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
  if (!url) return;
  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      value,
      currency: "BRL",
      content_name: name,
    });
  }
  sessionStorage.setItem(CHECKOUT_FLAG, "1");
  window.location.href = withTracking(url);
}

function handleAccept() {
  goCheckout(cursoCheckoutUrl, 97, "Pré-venda Curso Presépio em Vídeo");
}

function handleDesconto() {
  goCheckout(cursoDescontoUrl, 77, "Pré-venda Curso Presépio · última chance R$77");
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
  el.addEventListener("click", handleDesconto);
});

document.querySelectorAll("[data-curso-final-decline]").forEach((el) => {
  el.addEventListener("click", handleFinalDecline);
});

lastChance?.addEventListener("click", (event) => {
  if (event.target === lastChance) {
    /* clique fora não fecha: força escolher desconto ou sair */
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lastChance?.classList.contains("open")) {
    handleFinalDecline(event);
  }
});

/* Voltou do checkout do curso sem comprar → última chance */
(() => {
  const sendToLastChance = () => {
    if (sessionStorage.getItem(CHECKOUT_FLAG) !== "1") return false;
    sessionStorage.removeItem(CHECKOUT_FLAG);
    if (typeof window.fbq === "function") window.fbq("trackCustom", "CursoBackRedirect");
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
