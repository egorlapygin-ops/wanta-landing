import { basketProducts, createCartLink } from "../lib/vkusvill-cart.mjs";

function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
}

export default {
  async fetch(request) {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
    if (request.headers.get("sec-fetch-site") === "cross-site") return json({ error: "Forbidden" }, 403);
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
      return json({ error: "Expected JSON" }, 415);
    }
    let products;
    try {
      const body = await request.text();
      if (body.length > 1024) return json({ error: "Basket too large" }, 413);
      products = basketProducts(JSON.parse(body));
    } catch {
      return json({ error: "Проверьте количество товаров в корзине." }, 400);
    }
    try {
      return json({ url: await createCartLink(products) });
    } catch {
      return json({ error: "Не удалось собрать корзину во ВкусВилле. Попробуйте ещё раз." }, 502);
    }
  }
};
