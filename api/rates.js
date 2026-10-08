// Daily reference rates only. Checkout conversion and taxes can differ.
export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).end();
  try {
    const upstream = await fetch("https://api.frankfurter.dev/v2/rates?base=USD&quotes=MXN,COP,ARS,CLP,PEN,EUR,BRL,UYU,CRC,GTQ", { signal: AbortSignal.timeout(5000) });
    if (!upstream.ok) throw new Error("Rates unavailable");
    const rows = await upstream.json();
    const rates = { USD: 1 };
    const allowed = new Set(["MXN", "COP", "ARS", "CLP", "PEN", "EUR", "BRL", "UYU", "CRC", "GTQ"]);
    let date = "";
    for (const row of rows) {
      if (row.base === "USD" && allowed.has(row.quote) && Number.isFinite(row.rate) && row.rate > 0 && /^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
        rates[row.quote] = row.rate;
        if (row.date > date) date = row.date;
      }
    }
    if (!date || Object.keys(rates).length < 2 || Date.now() - Date.parse(date) > 7 * 86400000) throw new Error("Invalid or stale rates");
    response.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=3600");
    return response.status(200).json({ base: "USD", date, rates });
  } catch {
    response.setHeader("Cache-Control", "no-store");
    return response.status(503).json({ error: "reference_rates_unavailable" });
  }
}
