(() => {
  const toggle = document.querySelector("#support-toggle");
  const panel = document.querySelector("#support-panel");
  const answer = document.querySelector("#support-answer");
  if (!toggle || !panel || !answer) return;
  const answers = {
  "contenido": "Você recebe 15 projetos em PDF, com 29 moldes em tamanho real, guias visuais, medidas e listas de materiais. Inclui os personagens e elementos da cena do presépio. Não inclui materiais físicos.",
  "acceso": "Após a aprovação do pagamento, os PDFs são entregues pelo WhatsApp. Confira o número informado na compra. Você pode guardar os arquivos e abrir no celular ou computador. Se precisar de ajuda com o acesso, fale com Lyzandra.",
  "principiante": "Os guias mostram corte, união, enchimento e acabamento com costura à mão. Você pode fazer uma peça de cada vez, com pontos simples. Não precisa de máquina de costura.",
  "precio": "A coleção custa R$37, em pagamento único. A compra é feita no checkout da Cakto. Confira o valor total antes de pagar; qualquer complemento opcional é cobrado separadamente.",
  "video": "A coleção principal é em PDF: moldes e guias visuais. Não inclui videoaulas. Um curso oferecido separadamente não faz parte deste pacote.",
  "imprimir": "Imprima em papel A4, na escala 100%, sem ajustar à página. As medidas estão nos guias. Você pode imprimir em casa ou em uma gráfica.",
  "materiales": "Você precisará de feltro, linha, agulha, tesoura e enchimento. Cada projeto tem sua lista de materiais. Os materiais físicos são comprados à parte.",
  "garantia": "Você tem 7 dias após a compra para solicitar reembolso. Para dúvidas sobre acesso ou garantia, fale com Lyzandra pelo WhatsApp."
};
  const question = panel.querySelector("#support-question");
  const human = panel.querySelector("#support-human");
  const updateWhatsApp = () => {
    const message = question?.value.trim();
    if (human) human.href = "https://wa.me/554892156250?text=" + encodeURIComponent(
      message ? "Olá, Lyzandra. Tenho uma dúvida sobre a Coleção Presépio de Feltro:\n\n" + message
        : "Olá, Lyzandra. Tenho uma pergunta sobre a Coleção Presépio de Feltro."
    );
  };
  question?.addEventListener("input", updateWhatsApp);
  human?.addEventListener("click", updateWhatsApp);
  updateWhatsApp();
  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) panel.querySelector("button")?.focus();
    else toggle.focus();
  };
  const hero = document.querySelector("#inicio");
  const syncVisibility = () => {
    const visible = !hero || hero.getBoundingClientRect().bottom <= 0;
    toggle.hidden = !visible;
    if (!visible) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
  };
  window.addEventListener("scroll", syncVisibility, { passive: true });
  window.addEventListener("resize", syncVisibility);
  window.addEventListener("pageshow", syncVisibility);
  syncVisibility();
  toggle.addEventListener("click", () => setOpen(panel.hidden));
  document.querySelector("#support-close")?.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !panel.hidden) setOpen(false); });
  panel.querySelectorAll("[data-support-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      answer.textContent = answers[button.dataset.supportTopic] || "Fale com Lyzandra pelo WhatsApp para tirar essa dúvida.";
      panel.querySelectorAll("[data-support-topic]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    });
  });
})();
