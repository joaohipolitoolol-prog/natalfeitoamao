(() => {
  const toggle = document.querySelector("#support-toggle");
  const panel = document.querySelector("#support-panel");
  const answer = document.querySelector("#support-answer");
  if (!toggle || !panel || !answer) return;
  const answers = {
    contenido: "Recibes 15 proyectos en PDF, con moldes A4 y guías ilustradas. Incluye María, José, Niño Jesús, ángel, pastor, Reyes Magos, animales, pesebre, estrella y establo. Los materiales físicos no están incluidos.",
    acceso: "El producto principal es digital. Después de la aprobación del pago, recibes las instrucciones de acceso de Hotmart por email. Revisa también spam y promociones. Puedes guardar e imprimir los PDF.",
    principiante: "Las guías muestran el corte, la unión, el relleno y el acabado con costura a mano. Puedes avanzar personaje por personaje; no necesitas máquina de coser. Si tienes una duda específica, consulta a Lyzandra por WhatsApp.",
    precio: "El precio base es US$12, en un pago único. La conversión de esta página es aproximada y no incluye impuestos. Hotmart muestra el importe final antes de pagar. Los complementos opcionales se cobran por separado.",
    video: "La colección principal es en PDF y no incluye clases en video. Una oferta de curso, si aparece después de comprar, es un producto separado; revisa allí el precio y la fecha de acceso.",
    imprimir: "Imprime en papel A4 al 100%, sin ajustar a la página. Comprueba el cuadrado de 5 × 5 cm del proyecto antes de cortar. Puedes guardar los archivos e imprimirlos en casa o en una copistería.",
    materiales: "Necesitarás fieltro, hilo, aguja, tijeras y relleno. Cada proyecto incluye su lista de materiales y colores. Los materiales físicos no están incluidos en la compra.",
    garantia: "La colección principal tiene una garantía de 7 días. Puedes solicitar el reembolso a través de Hotmart según las condiciones de tu compra. Para problemas de acceso, habla con Lyzandra."
  };
  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) panel.querySelector("button")?.focus();
    else toggle.focus();
  };
  toggle.addEventListener("click", () => setOpen(panel.hidden));
  document.querySelector("#support-close")?.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !panel.hidden) setOpen(false); });
  panel.querySelectorAll("[data-support-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      answer.textContent = answers[button.dataset.supportTopic] || "Habla con Lyzandra por WhatsApp para resolver esta duda.";
      panel.querySelectorAll("[data-support-topic]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    });
  });
})();
