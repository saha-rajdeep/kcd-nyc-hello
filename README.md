# KCD NYC Hello

A simple Hello World API used as a target repo for [Claude Code on Kubernetes](https://github.com/csantanapr/kcd-new-york-k8s-claude) demos.

## Quick Start

```bash
npm install   # no dependencies, but initializes node_modules
npm test      # run tests
npm start     # start server on port 3000
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Returns `{ "message": "Hello from KCD New York!" }` |

## For the Demo

This repo is designed to be used with the KCD New York K8s Claude demo:

1. **Developer agent** (concept 05) reads `SPEC.md` and implements features one at a time
2. **Code reviewer** (concept 04) reviews PRs, requests tests, and merges when ready
3. The agents collaborate autonomously — developer implements, reviewer reviews, developer addresses feedback

See [SPEC.md](./SPEC.md) for the feature roadmap.
