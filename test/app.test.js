const { describe, it } = require("node:test");
const assert = require("node:assert");
const app = require("../src/app");

// Helper to create mock req/res
function mockReq(method, url) {
  return { method, url };
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

describe("Unknown route", () => {
  it("returns 404", async () => {
    const req = mockReq("GET", "/nope");
    const res = mockRes();
    await app.handle(req, res);
    assert.strictEqual(res.statusCode, 404);
  });
});
