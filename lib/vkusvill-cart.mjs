const ENDPOINT = "https://mcp.vkusvill.ru/mcp";
const PROTOCOL = "2025-03-26";

// Exact matches from the public VkusVill catalog, checked on 2026-10-28.
// Keep these in sync with GROCERIES in assets/recipe-illustration.js.
const PRODUCT_IDS = { pasta: 122166, tomatoes: 108505, herbs: 104870 };

export function basketProducts(body) {
  const quantities = body?.quantities;
  const kinds = Object.keys(PRODUCT_IDS);
  if (!quantities || typeof quantities !== "object" || Array.isArray(quantities)
      || Object.keys(quantities).length !== kinds.length
      || kinds.some(kind => !Number.isInteger(quantities[kind]) || quantities[kind] < 0 || quantities[kind] > 40)) {
    throw new Error("Invalid basket quantities");
  }
  const products = kinds.filter(kind => quantities[kind] > 0)
    .map(kind => ({ id: PRODUCT_IDS[kind], q: quantities[kind] }));
  if (!products.length) throw new Error("Empty basket");
  return products;
}

export function cartUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || !["vkusvill.ru", "www.vkusvill.ru"].includes(url.hostname)
      || url.username || url.password || url.port || url.hash || url.pathname !== "/mobile"
      || !url.searchParams.has("basket") || !/^\d+$/.test(url.searchParams.get("share") || "")
      || [...url.searchParams.keys()].some(key => !["basket", "share"].includes(key))) {
    throw new Error("Invalid VkusVill cart link");
  }
  return url.href;
}

function rpcResult(message, id) {
  if (message?.jsonrpc !== "2.0" || message.id !== id || message.error || !message.result) {
    throw new Error("Invalid MCP response");
  }
  return message.result;
}

// The public endpoint currently returns JSON. Streamable HTTP also permits SSE;
// stop reading as soon as the matching response arrives, even on an open stream.
async function readResult(response, id) {
  if (!response.headers.get("content-type")?.includes("text/event-stream")) {
    return rpcResult(await response.json(), id);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = "", bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) throw new Error("Missing MCP response");
      bytes += value.length;
      if (bytes > 65536) throw new Error("MCP response too large");
      pending += decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = pending.match(/\r?\n\r?\n/))) {
        const event = pending.slice(0, boundary.index);
        pending = pending.slice(boundary.index + boundary[0].length);
        const data = event.split(/\r?\n/).filter(line => line.startsWith("data:"))
          .map(line => line.slice(5).replace(/^ /, "")).join("\n");
        if (!data) continue;
        const message = JSON.parse(data);
        if (message.id === id) return rpcResult(message, id);
      }
    }
  } finally {
    await reader.cancel();
  }
}

export async function createCartLink(products, { fetchImpl = fetch, signal = AbortSignal.timeout(20000) } = {}) {
  let sessionId;
  const headers = { "Content-Type": "application/json", Accept: "application/json, text/event-stream" };
  async function send(message) {
    const response = await fetchImpl(ENDPOINT, {
      method: "POST", headers, body: JSON.stringify({ jsonrpc: "2.0", ...message }),
      signal, redirect: "error"
    });
    if (!response.ok) throw new Error("VkusVill service unavailable");
    sessionId = response.headers.get("mcp-session-id") || sessionId;
    if (sessionId) headers["Mcp-Session-Id"] = sessionId;
    if (message.id === undefined) {
      await response.body?.cancel();
      return;
    }
    return readResult(response, message.id);
  }

  try {
    const init = await send({ id: 1, method: "initialize", params: {
      protocolVersion: PROTOCOL, capabilities: {}, clientInfo: { name: "wanta-landing", version: "1.0.0" }
    } });
    if (init.protocolVersion !== PROTOCOL) throw new Error("Unsupported MCP protocol");
    headers["MCP-Protocol-Version"] = init.protocolVersion;
    await send({ method: "notifications/initialized" });
    const result = await send({ id: 2, method: "tools/call", params: {
      name: "vkusvill_cart_link_create", arguments: { products }
    } });
    if (result.isError) throw new Error("VkusVill could not create the basket");
    const payload = result.structuredContent
      || JSON.parse(result.content?.find(item => item.type === "text")?.text || "null");
    if (!payload || payload.ok === false) throw new Error("Missing VkusVill basket");
    const data = payload.data || payload;
    return cartUrl(data.link || data.url);
  } finally {
    if (sessionId) {
      // The current public service is stateless, but close sessions if it starts issuing them.
      await fetchImpl(ENDPOINT, { method: "DELETE", headers, redirect: "error", signal: AbortSignal.timeout(2000) })
        .then(response => response.body?.cancel()).catch(() => {});
    }
  }
}
