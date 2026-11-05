# MediGuide web client

This is the React/Vite frontend for MediGuide. For installation, environment setup, API details, troubleshooting, and the complete feature checklist, follow the project [README](../README.md).

Run the client separately after starting the API:

```bash
npm ci
npm run dev
```

The local client listens on `http://localhost:5173` and proxies `/api` requests to `http://127.0.0.1:5000`.
