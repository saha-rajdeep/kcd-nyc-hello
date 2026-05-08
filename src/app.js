const app = {
  routes: {},
  startTime: Date.now(),

  get(path, handler) {
    this.routes[`GET ${path}`] = handler;
  },

  post(path, handler) {
    this.routes[`POST ${path}`] = handler;
  },

  async handle(req, res) {
    const key = `${req.method} ${req.url.split("?")[0]}`;
    const handler = this.routes[key];

    if (!handler) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    try {
      await handler(req, res);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

// --- Routes ---

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello from KCD New York!" }));
});

app.get("/api/health", (req, res) => {
  const uptime = Math.floor((Date.now() - app.startTime) / 1000);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", uptime }));
});

app.post("/api/greet", async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ greeting: `Hello, ${data.name}!` }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
});

module.exports = app;
