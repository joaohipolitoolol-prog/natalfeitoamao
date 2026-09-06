/* ========= Upsell checkout: preencha quando criar o produto na Cakto ========= */
const upsellCheckoutUrl = ""; // TODO: URL do checkout da Coleção (R$47)
const declineUrl = "./obrigado";

const modal = document.querySelector("#upsell-modal");

const openModal = () => {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  modal.querySelector(".modal-close")?.focus();
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

/** Aceitar upsell: redireciona para o checkout da Coleção. */
function handleAcceptUpsell() {
  // TODO: conectar URL real da Cakto (ou one-click upsell da plataforma)
  if (upsellCheckoutUrl) {
    window.location.href = upsellCheckoutUrl;
    return;
  }
  openModal();
}

/** Recusar upsell: segue para a próxima etapa (obrigado / entrega). */
function handleDeclineUpsell(event) {
  if (event) event.preventDefault();
  // TODO: se a plataforma tiver URL de thank-you pós-compra, troque declineUrl
  window.location.href = declineUrl;
}

document.querySelectorAll("[data-upsell-accept]").forEach((button) => {
  button.addEventListener("click", handleAcceptUpsell);
});

document.querySelectorAll("[data-upsell-decline]").forEach((link) => {
  link.addEventListener("click", handleDeclineUpsell);
});

modal?.querySelector(".modal-close")?.addEventListener("click", closeModal);
modal?.querySelector("#upsell-modal-ok")?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open")) closeModal();
});
