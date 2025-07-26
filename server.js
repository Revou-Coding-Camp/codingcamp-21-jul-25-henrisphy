import { serve } from "bun";
import path from "path";
import fs from "fs";

const server = serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const filePath = path.join(
      import.meta.dir,
      "public",
      url.pathname === "/" ? "index.html" : url.pathname
    );

    try {
      const file = await Bun.file(filePath).text();
      return new Response(file, {
        headers: { "Content-Type": getContentType(filePath) },
      });
    } catch (error) {
      return new Response("Not Found", { status: 404 });
    }
  },
});

function getContentType(filePath) {
  const ext = path.extname(filePath);
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    default:
      return "text/plain";
  }
}

console.log(`Server running at http://localhost:${server.port}`);
