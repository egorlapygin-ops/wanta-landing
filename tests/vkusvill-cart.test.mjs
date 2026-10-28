import test from "node:test";
import assert from "node:assert/strict";
import { basketProducts, cartUrl, createCartLink } from "../lib/vkusvill-cart.mjs";
import handler from "../api/vkusvill-cart.mjs";

const link = "https://vkusvill.ru/mobile?basket&share=123";
const quantities = { pasta: 2, tomatoes: 1, herbs: 0 };
const products = [{ id: 122166, q: 2 }, { id: 108505, q: 1 }];
const success = { structuredContent: { ok: true, data: { link } } };

function mockMcp(toolResult = success, { session = false, sse = false } = {}) {
  const calls = [];
  return {
    calls,
    fetchImpl: async (url, options) => {
      assert.equal(url, "https://mcp.vkusvill.ru/mcp");
      assert.equal(options.redirect, "error");
      const message = options.body ? JSON.parse(options.body) : null;
      calls.push({ message, method: options.method, headers: { ...options.headers } });
      if (options.method === "DELETE") return new Response(null, { status: 204 });
      if (message.method === "notifications/initialized") return new Response(null, { status: 202 });
      const result = message.method === "initialize" ? { protocolVersion: "2025-03-26" } : toolResult;
      const body = { jsonrpc: "2.0", id: message.id, result };
      if (sse && message.method === "tools/call") {
        const encoder = new TextEncoder();
        const chunks = [
          ': keep-alive\r\ndata: {"jsonrpc":"2.0","method":"notifications/progress"}\r\n\r',
          '\nevent: message\r\ndata: ' + JSON.stringify(body).slice(0, 35),
          JSON.stringify(body).slice(35) + '\r\n\r\n'
        ];
        return new Response(new ReadableStream({
          start(controller) { chunks.forEach(chunk => controller.enqueue(encoder.encode(chunk))); }
          // Deliberately leave open: the client must finish on the matching response.
        }), { headers: { "Content-Type": "text/event-stream" } });
      }
      return Response.json(body, { headers: session ? { "Mcp-Session-Id": "test-session" } : {} });
    }
  };
}

test("only catalog IDs are sent, with selected quantities and zero items omitted", () => {
  assert.deepEqual(basketProducts({ quantities }), products);
  assert.deepEqual(basketProducts({ quantities: { pasta: 0, tomatoes: 0, herbs: 40 } }), [{ id: 104870, q: 40 }]);
});

test("invalid, empty and out-of-range baskets are rejected", () => {
  for (const value of [null, [], {}, { pasta: 0, tomatoes: 0, herbs: 0 },
    { ...quantities, pasta: -1 }, { ...quantities, pasta: 41 }, { ...quantities, pasta: 1.5 },
    { ...quantities, pasta: "2" }, { ...quantities, pasta: null }, { ...quantities, extra: 1 },
    { pasta: 1, tomatoes: 1, unknown: 1 }]) {
    assert.throws(() => basketProducts({ quantities: value }));
  }
});

test("redirects are restricted to VkusVill shared baskets", () => {
  assert.equal(cartUrl(link), link);
  for (const value of ["https://example.com/mobile?basket&share=123", "http://vkusvill.ru/mobile?basket&share=123",
    "https://vkusvill.ru.evil.test/mobile?basket&share=123", "https://user@vkusvill.ru/mobile?basket&share=123",
    "https://vkusvill.ru:444/mobile?basket&share=123", "https://vkusvill.ru/cart/", link + "&redirect=https://example.com", link + "#other"]) {
    assert.throws(() => cartUrl(value));
  }
});

test("MCP handshake preserves the session and sends the exact basket, then closes it", async () => {
  const mock = mockMcp(success, { session: true });
  assert.equal(await createCartLink(products, mock), link);
  assert.deepEqual(mock.calls.map(call => call.message?.method || call.method),
    ["initialize", "notifications/initialized", "tools/call", "DELETE"]);
  assert.equal(mock.calls[2].headers["Mcp-Session-Id"], "test-session");
  assert.equal(mock.calls[2].headers["MCP-Protocol-Version"], "2025-03-26");
  assert.deepEqual(mock.calls[2].message.params, { name: "vkusvill_cart_link_create", arguments: { products } });
});

test("text content and chunked SSE responses are supported", async () => {
  const result = { content: [{ type: "text", text: JSON.stringify({ ok: true, data: { url: link } }) }] };
  assert.equal(await createCartLink(products, mockMcp(result, { sse: true })), link);
});

test("upstream tool errors and unsafe links never become a successful redirect", async () => {
  for (const result of [{ isError: true, ...success }, { structuredContent: { ok: false } }, {},
    { structuredContent: { data: { link: "https://example.com/" } } }]) {
    await assert.rejects(createCartLink(products, mockMcp(result)));
  }
});

function request(body = { quantities }, headers = {}) {
  return new Request("https://wanta.example/api/vkusvill-cart", {
    method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body)
  });
}

test("API rejects invalid requests before calling VkusVill", async (t) => {
  const upstream = t.mock.method(globalThis, "fetch", () => { throw new Error("must not call upstream"); });
  for (const [req, status] of [
    [new Request("https://wanta.example/api/vkusvill-cart"), 405],
    [request({}, { "Content-Type": "text/plain" }), 415],
    [request({ quantities }, { "Sec-Fetch-Site": "cross-site" }), 403],
    [request({ quantities: { pasta: 0, tomatoes: 0, herbs: 0 } }), 400],
    [request({ quantities: { ...quantities, pasta: 41 } }), 400],
    [request({ extra: "x".repeat(1100) }), 413],
    [new Request("https://wanta.example/api/vkusvill-cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }), 400]
  ]) assert.equal((await handler.fetch(req)).status, status);
  assert.equal(upstream.mock.callCount(), 0);
});

test("API returns a live-service link without caching a user's selection", async (t) => {
  const mock = mockMcp();
  t.mock.method(globalThis, "fetch", mock.fetchImpl);
  const response = await handler.fetch(request());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { url: link });
  assert.deepEqual(mock.calls[2].message.params.arguments.products, products);
});

test("network failures return a retryable error without exposing provider details", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new Error("private provider detail"); });
  const response = await handler.fetch(request());
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /private provider detail/);
});
