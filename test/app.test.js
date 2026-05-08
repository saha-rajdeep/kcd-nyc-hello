const { describe, it } = require("node:test");
const assert = require("node:assert");
const app = require("../src/app");

// Helper to create mock req/res
function mockReq(method, url, body = null) {
  const listeners = {};
  let dataHandled = false;
  const req = {
    method,
    url,
    on(event, handler) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      // For POST with body, emit data and end events immediately after end handler is registered
      if (body !== null && event === "end" && !dataHandled) {
        dataHandled = true;
        // Execute on next tick to allow synchronous code to complete
        Promise.resolve().then(() => {
          if (listeners["data"]) {
            listeners["data"].forEach(h => h(body));
          }
          if (listeners["end"]) {
            listeners["end"].forEach(h => h());
          }
        });
      }
    }
  };

  return req;
}

function mockRes() {
  const res = {
    statusCode: null,
    headers: {},
    body: "",
    writeHead(code, headers) {
      res.statusCode = code;
      res.headers = headers;
    },
    end(data) {
      res.body = data;
    },
  };
  return res;
}

describe("GET /", () => {
  it("returns hello message", async () => {
    const req = mockReq("GET", "/");
    const res = mockRes();
    await app.handle(req, res);
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.message, "Hello from KCD New York!");
  });
});

describe("GET /api/health", () => {
  it("returns 200 with health status", async () => {
    const req = mockReq("GET", "/api/health");
    const res = mockRes();
    await app.handle(req, res);
    assert.strictEqual(res.statusCode, 200);
  });

  it("returns JSON with status and uptime", async () => {
    const req = mockReq("GET", "/api/health");
    const res = mockRes();
    await app.handle(req, res);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.status, "ok");
    assert.strictEqual(typeof body.uptime, "number");
  });

  it("returns correct Content-Type header", async () => {
    const req = mockReq("GET", "/api/health");
    const res = mockRes();
    await app.handle(req, res);
    assert.strictEqual(res.headers["Content-Type"], "application/json");
  });
});

describe("POST /api/greet", () => {
  it("returns greeting for valid name", async () => {
    const req = mockReq("POST", "/api/greet", '{"name":"Alice"}');
    const res = mockRes();
    await app.handle(req, res);
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.greeting, "Hello, Alice!");
  });

  it("returns correct Content-Type header", async () => {
    const req = mockReq("POST", "/api/greet", '{"name":"Bob"}');
    const res = mockRes();
    await app.handle(req, res);
    assert.strictEqual(res.headers["Content-Type"], "application/json");
  });

  it("handles missing name field gracefully", async () => {
    const req = mockReq("POST", "/api/greet", '{}');
    const res = mockRes();
    await app.handle(req, res);
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.greeting, "Hello, undefined!");
  });

  it("handles invalid JSON payload", async () => {
    const req = mockReq("POST", "/api/greet", 'not json');
    const res = mockRes();
    await app.handle(req, res);
    assert.strictEqual(res.statusCode, 500);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.error, "Internal server error");
  });
});

describe("Unknown route", () => {
  it("returns 404", async () => {
    const req = mockReq("GET", "/nope");
    const res = mockRes();
    await app.handle(req, res);
    assert.strictEqual(res.statusCode, 404);
  });
});
