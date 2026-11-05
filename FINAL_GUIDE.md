# MediGuide — Verified local run guide

The supported application is the standalone React/Vite client plus Express REST server described in the project README. The conflicting root tRPC development path and client package script were the main causes of the original localhost/startup confusion. The root `npm run dev` command now starts both supported workspaces.

## Start

```bash
npm ci --prefix server
npm ci --prefix client
npm run dev
```

Open `http://localhost:5173`; the REST API listens at `http://localhost:5000`. MongoDB is optional for local demos. Without MongoDB, facilities come from bundled JSON and account/profile/history data is stored in `server/data/localStore.json`.

## Checks performed in this repair

- Server TypeScript build: passed.
- Client TypeScript + Vite production build: passed.
- Server test suite: **5 tests passed** for symptom rules and model inference.
- HTTP smoke test: health, symptom questions and guest/auth assessments, model output, pharmacy filtering, advisories, guest/auth dispatch, registration/login, profile update/read, and saved history.
- Public browser: landing page and symptom/facility routes rendered through the sandbox hostname after adding the necessary Vite allowed-host rule.

Run these again after changes:

```bash
npm run check
npm run test
npm run build
npm run dev
node scripts/smoke-test.mjs
```

## Limitations

The classifier/model are demo decision-support examples, not medical diagnosis. Facility records are sample data. Emergency dispatch, ambulance location, route and ETA are simulated and never contact real services; call 108 for a real emergency in India. The local JSON account store is not suitable for production or sensitive medical records. Production requires a securely configured MongoDB deployment, HTTPS, secret management, privacy/security review and independent verification of facility data.
