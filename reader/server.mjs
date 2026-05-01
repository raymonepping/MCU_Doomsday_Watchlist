import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function resolvePath(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(
    /^(\.\.[/\\])+/,
    "",
  );
  const path = join(root, cleanPath === "/" ? "index.html" : cleanPath);
  if (!path.startsWith(root)) {
    return null;
  }
  if (existsSync(path) && statSync(path).isFile()) {
    return path;
  }
  return join(root, "index.html");
}

createServer((request, response) => {
  const path = resolvePath(request.url || "/");
  if (!path) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  response.writeHead(200, {
    "Content-Type": types[extname(path)] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  createReadStream(path).pipe(response);
}).listen(port, host, () => {
  console.log(`MCU reader running at http://${host}:${port}`);
});
