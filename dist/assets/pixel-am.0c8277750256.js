/* Correspondência avançada manual do Pixel Meta (sem e-mail/telefone fictícios). */
(function () {
  const STORAGE_KEY = "nf_fb_am";

  const firstValue = (keys, selector) => {
    const params = new URLSearchParams(window.location.search);
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (_) {}
    for (const key of keys) {
      const raw = params.get(key) || stored[key];
      const value = raw == null ? "" : String(raw).trim();
      if (value && value !== "null" && value !== "undefined") return value;
    }
    const field = selector ? document.querySelector(selector) : null;
    return field?.value?.trim() || "";
  };

  window.nfGetAdvancedMatching = function () {
    const data = {};
    try {
      const em = firstValue(
        ["email", "em", "customer_email", "buyer_email"],
        'input[type="email"]'
      );
      const ph = firstValue(
        ["phone", "ph", "tel", "whatsapp", "customer_phone"],
        'input[type="tel"]'
      );
      const fn = firstValue(["fn", "first_name", "firstname", "nome"]);
      const ln = firstValue(["ln", "last_name", "lastname"]);
      const country = firstValue(["country"]).toLowerCase();
      const externalId = firstValue(["external_id", "customer_id"]);

      if (em.includes("@")) data.em = em.toLowerCase();
      if (ph) data.ph = ph.replace(/\D/g, "");
      if (fn) data.fn = fn.toLowerCase();
      if (ln) data.ln = ln.toLowerCase();
      if (country.length === 2) data.country = country;
      if (externalId) data.external_id = externalId;

      if (Object.keys(data).length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (_) {}
    return data;
  };

  window.nfInitAdvancedMatching = function (pixelId) {
    const am = window.nfGetAdvancedMatching();
    window.fbq("init", pixelId, {
      em: am.em,
      ph: am.ph,
      fn: am.fn,
      ln: am.ln,
      country: am.country,
      external_id: am.external_id,
    });
  };
})();
