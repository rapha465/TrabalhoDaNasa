const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const publicDir = path.join(root, "public");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function getApiKey() {
  if (process.env.NASA_API_KEY) return process.env.NASA_API_KEY;

  const envFile = path.join(root, ".env");
  if (!fs.existsSync(envFile)) return "";

  const entry = fs
    .readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .find((line) => /^\s*(NASA_API_KEY|api)\s*=/.test(line));

  if (!entry) return "";
  return entry
    .slice(entry.indexOf("=") + 1)
    .trim()
    .replace(/^(['"])(.*)\1$/, "$2");
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, "http://localhost");

  if (request.method !== "GET") {
    response.writeHead(405, { Allow: "GET" });
    response.end("Method not allowed");
    return;
  }

  if (requestUrl.pathname === "/api/apod") {
    const apiKey = getApiKey();
    if (!apiKey) {
      sendJson(response, 500, {
        error: "Chave da API não encontrada. Configure NASA_API_KEY no .env.",
      });
      return;
    }

    const selectedDate = requestUrl.searchParams.get("date");
    if (selectedDate) {
      const parsedDate = new Date(`${selectedDate}T00:00:00.000Z`);
      const today = new Date().toISOString().slice(0, 10);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate) ||
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== selectedDate ||
        selectedDate < "1995-06-16" ||
        selectedDate > today
      ) {
        sendJson(response, 400, {
          error: "Escolha uma data entre 16/06/1995 e hoje.",
        });
        return;
      }
    }

    try {
      const nasaUrl = new URL("https://api.nasa.gov/planetary/apod");
      nasaUrl.searchParams.set("api_key", apiKey);
      if (selectedDate) nasaUrl.searchParams.set("date", selectedDate);
      const nasaResponse = await fetch(nasaUrl);
      const data = await nasaResponse.json();

      if (!nasaResponse.ok) {
        sendJson(response, nasaResponse.status, {
          error: data.error?.message || "A NASA não conseguiu fornecer o APOD.",
        });
        return;
      }

      sendJson(response, 200, data);
    } catch (error) {
      console.error("Falha ao consultar o APOD:", error.message);
      sendJson(response, 502, {
        error: "Não foi possível conectar à API da NASA. Tente novamente.",
      });
    }
    return;
  }

  const files = {
    "/": "index.html",
    "/index.html": "index.html",
    "/styles.css": "styles.css",
    "/app.js": "app.js",
  };
  const fileName = files[requestUrl.pathname];

  if (!fileName) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const filePath = path.join(publicDir, fileName);
  response.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(filePath)],
    "X-Content-Type-Options": "nosniff",
  });
  fs.createReadStream(filePath).pipe(response);
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
  console.log(`NASA APOD disponível em http://localhost:${port}`);
});
