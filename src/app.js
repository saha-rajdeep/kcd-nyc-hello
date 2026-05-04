const app = {
  routes: {},

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

module.exports = app;
