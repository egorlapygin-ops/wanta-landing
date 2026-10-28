import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import cart from "../api/vkusvill-cart.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.argv[2] || 8765);
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf"
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname === "/api/vkusvill-cart") {
      const request = new Request(url, {
        method: req.method, headers: req.headers,
        ...(!["GET", "HEAD"].includes(req.method) ? { body: Readable.toWeb(req), duplex: "half" } : {})
      });
      const response = await cart.fetch(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { Allow: "GET, HEAD" }); res.end(); return;
    }
    const pathname = decodeURIComponent(url.pathname);
    if (/^\/lab(?:\/|$)/.test(pathname)) {
      res.writeHead(302, { Location: "/" }); res.end(); return;
    }
    if (pathname.split("/").some(part => part.startsWith("."))
        || /^\/(api|lib|scripts|tests|node_modules)(\/|$)/.test(pathname)) {
      res.writeHead(404); res.end(); return;
    }
    let path = resolve(root, "." + pathname);
    if (!path.startsWith(root) && path !== root.slice(0, -1)) throw new Error("Invalid path");
    if (pathname.endsWith("/")) path += sep + "index.html";
    else if (!extname(path)) path += ".html";
    if (!(await stat(path)).isFile()) throw new Error("Not a file");
    const content = await readFile(path);
    res.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(req.method === "HEAD" ? undefined : content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }); res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Wanta: http://127.0.0.1:${port}/`));
