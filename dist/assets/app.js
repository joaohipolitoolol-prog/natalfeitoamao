/* ========= Configuração — preencha antes de anunciar ========= */
const checkoutUrls = {
  feltro: "", // checkout só do presépio (R$37)
  feltroBump: "", // checkout com order bump (R$37 + R$27)
};

/** Meta Pixel ID (ex.: "1234567890"). Vazio = pixel desligado. */
const metaPixelId = "";

const BASE_PRICE = 37;
const BUMP_PRICE = 27;

/* ========= Meta Pixel ========= */
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

const track = (event, params) => {
  if (typeof window.fbq === "function") window.fbq("track", event, params);
};

initPixel();

/* ========= Urgência até o Natal ========= */
const christmas = new Date(new Date().getFullYear(), 11, 25);
const now = new Date();
if (now > christmas) christmas.setFullYear(christmas.getFullYear() + 1);
const daysLeft = Math.max(0, Math.ceil((christmas - now) / 86400000));
const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));

const urgencyLine = document.querySelector("#urgency-line");
const offerDeadline = document.querySelector("#offer-deadline");

if (daysLeft === 0) {
  if (urgencyLine) urgencyLine.textContent = "É Natal — monte a cena para o próximo ano com calma.";
  if (offerDeadline) offerDeadline.textContent = "Arquivos com acesso imediato para você guardar e costurar quando quiser.";
} else if (daysLeft <= 21) {
  if (urgencyLine) {
    urgencyLine.textContent = `Faltam ${daysLeft} dias para o Natal — priorize as peças principais esta semana.`;
  }
  if (offerDeadline) {
    offerDeadline.textContent = `Restam ${daysLeft} dias. Comece pelas figuras centrais e finalize o restante no seu ritmo.`;
  }
} else {
  if (urgencyLine) {
    urgencyLine.textContent = `Faltam cerca de ${weeksLeft} semanas para o Natal — ainda dá tempo de costurar com calma.`;
  }
  if (offerDeadline) {
    offerDeadline.textContent = `${weeksLeft} semanas até 25/12. Comece agora para montar sem pressa.`;
  }
}

/* ========= Order bump + checkout ========= */
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
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

const resolveCheckoutUrl = () => {
  const withBump = Boolean(bumpCheckbox?.checked);
  if (withBump) return checkoutUrls.feltroBump || checkoutUrls.feltro;
  return checkoutUrls.feltro;
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
      window.location.href = url;
      return;
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    modal.querySelector(".modal-close").focus();
  })
);

modal.querySelector(".modal-close").addEventListener("click", closeModal);
modal.querySelector(".modal-ok").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

/* Sticky só depois da galeria — some quando a oferta já está na tela */
const updateSticky = () => {
  if (!sticky || !stickyTrigger || !offer) return;
  const triggerTop = stickyTrigger.getBoundingClientRect().top;
  const offerTop = offer.getBoundingClientRect().top;
  const deepEnough = triggerTop < window.innerHeight * 0.45;
  const offerVisible = offerTop < window.innerHeight * 0.7;
  const show = deepEnough && !offerVisible;
  sticky.hidden = !show;
  sticky.classList.toggle("is-visible", show);
};

updateSticky();
window.addEventListener("scroll", updateSticky, { passive: true });
window.addEventListener("resize", updateSticky);
