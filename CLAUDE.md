# CLAUDE.md

## Project

Simple Hello World API for KCD New York — used as a target repo for Claude Code agent demos.

## Stack

- Node.js (no external dependencies)
- `node:http` for the server
- `node:test` + `node:assert` for testing

## Conventions

- Source code in `src/`, tests in `test/`
- All routes defined in `src/app.js`, server startup in `src/server.js`
- Every new endpoint MUST have a corresponding test in `test/app.test.js`
- Tests use Node's built-in `node:test` runner — no test frameworks
- Run tests: `npm test`
- Run server: `npm start` (default port 3000)
