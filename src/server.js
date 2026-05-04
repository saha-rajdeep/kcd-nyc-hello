const http = require("node:http");
const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => app.handle(req, res));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
