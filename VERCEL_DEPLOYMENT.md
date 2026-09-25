# Deploy MediGuide to Vercel

MediGuide can be hosted on Vercel as **two projects from the same Git repository**: an Express API project rooted at `server/` and a Vite SPA project rooted at `client/`. Keep a persistent MongoDB database configured for accounts and assessment history; Vercel Functions do not provide a durable local JSON filesystem.

## Before deploying

1. Create a GitHub repository and push the contents of this project (the folder containing `README.md`, `client/`, and `server/`) to it.
2. Create a MongoDB Atlas deployment and a database user for this app. Copy the Atlas connection URI; keep it private.
3. Use Vercel to import the GitHub repository twice, once for each project below.

Do not put real patient/medical information in this demo. Review the security, privacy, facility accuracy, and legal requirements before any real-world use.

## 1. Deploy the API

In Vercel, choose **Add New → Project**, import the repository, and configure:

- **Project name:** e.g. `mediguide-api`
- **Root Directory:** `server`
- **Framework preset:** Express if detected; otherwise leave Vercel's automatic/Other setting
- **Build command:** leave the Express zero-configuration default (do not override unless Vercel requests it)
- **Output directory:** leave blank/default

Add these environment variables in **Project Settings → Environment Variables**. For values, substitute your real values in the Vercel dashboard; never commit secrets to Git.

| Name | Value |
|---|---|
| `MONGODB_URI` | Your private Atlas URI, e.g. `mongodb+srv://.../mediguide?...` |
| `JWT_SECRET` | A newly generated, long random secret (at least 32 random bytes) |
| `CLIENT_URL` | The exact HTTPS production URL of the frontend, such as `https://mediguide-web.vercel.app` |

Set them for **Production**. You can also configure Preview with the appropriate preview frontend origin if you intend to use preview deployments. Deploy the project and copy its HTTPS domain, e.g. `https://mediguide-api.vercel.app`.

The API entrypoint is `server/src/index.ts`; Vercel's Express runtime can detect the Express server. The API paths include `/api/health`, `/api/auth/...`, `/api/symptoms/...`, and the other `/api/...` routes.

## 2. Deploy the frontend

Import the same GitHub repository as another Vercel project. Configure:

- **Project name:** e.g. `mediguide-web`
- **Root Directory:** `client`
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

Add one environment variable:

| Name | Value |
|---|---|
| `VITE_API_URL` | The API domain plus `/api`, e.g. `https://mediguide-api.vercel.app/api` |

Deploy the project. The included `client/vercel.json` rewrites direct SPA routes such as `/symptoms` and `/profile` to the Vite `index.html`, so refreshing those pages works.

## 3. Connect the two deployments

Copy the final frontend HTTPS production URL (for example `https://mediguide-web.vercel.app`) into the API project's `CLIENT_URL` environment variable. Then redeploy the API. Check these two points:

1. Open the frontend URL. The dashboard should show **API connected**.
2. Open `https://YOUR-API-DOMAIN.vercel.app/api/health`; it should return JSON with `status: "ok"`.

If you change an environment variable, redeploy the affected project so the new value is applied. `VITE_API_URL` is embedded into the frontend bundle at build time, so changing it requires a frontend redeploy too.

## Persistent database and local fallback

Set `MONGODB_URI` before using registration/profile/history in Vercel. `server/data/localStore.json` is only intended for a local demo; serverless instance files are not durable shared storage. The bundled sample facility data is read-only and can still provide the demo care listings.

For MongoDB Atlas network access, use Atlas's documented connectivity setup for your hosting plan. Vercel function egress may not have a single fixed IP unless you configure a feature that provides static egress; do not expose database credentials or grant unnecessary database privileges.

## Simpler single-project alternative

If you deploy only `client/`, the pages can load but API-backed features (auth, assessments, saved history, recommendations, and dispatch) will not work unless the API is hosted somewhere reachable. You could instead deploy the Express server separately on another Node host, then set `VITE_API_URL` and `CLIENT_URL` to its and the Vercel frontend's respective URLs.

## Official references

- [Vercel: Vite](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel: Express](https://vercel.com/docs/frameworks/backend/express)
- [Vercel: environment variables](https://vercel.com/docs/environment-variables)
- [Vercel: Node.js runtime](https://vercel.com/docs/functions/runtimes/node-js)
