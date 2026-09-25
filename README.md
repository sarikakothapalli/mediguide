# MediGuide

MediGuide is a demo health-guidance application for symptom severity checks, nearby care discovery, simulated emergency dispatch, seasonal health guidance, and saved user health profiles. It is **not a medical device** and does not provide a diagnosis.

## Features

- **Symptom checker** — Multi-step follow-up questions and a rules-based severity assessment (mild, moderate, severe, critical), with emergency red flags and specialty recommendations.
- **Model-based possibilities** — An included trained symptom model returns its top three statistical possibilities. These are explicitly not diagnoses and never override emergency rules.
- **Hospital recommendations** — Specialty-aware recommendations, sorted by distance when location is available.
- **Find care** — Search hospitals, clinics, and pharmacies; filter by radius and open-now status; switch between list and Leaflet/OpenStreetMap views.
- **SOS ambulance** — Confirmation, location capture, simulated dispatch, ETA/map tracking, and a direct-call link for India’s 108 emergency number. The dispatch is a demo only; it does not contact real services.
- **Seasonal advisories** — Month- and region-aware health guidance for Hyderabad/India.
- **User profile and history** — JWT registration/login, editable health profile (age, blood group, allergies, conditions, pregnancy), and saved symptom assessments.

## Technology

- Frontend: React, TypeScript, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express, TypeScript, REST API
- Data: MongoDB/Mongoose when configured; included JSON facility data and durable local JSON account/history storage otherwise
- Maps: Leaflet + OpenStreetMap
- Authentication: JWT + bcrypt

## Requirements

- Node.js 20.19+ or 22.12+ (Node 22 recommended; required by the bundled Vite version)
- MongoDB is optional. Without it, the app uses the bundled sample facilities and stores demo accounts and symptom history in `server/data/localStore.json`.

## Run locally

From the extracted project directory:

```bash
# Install the two application workspaces
npm ci --prefix server
npm ci --prefix client

# Optional environment setup (MongoDB may remain unavailable)
cp .env.example server/.env
# Edit server/.env and set a strong JWT_SECRET before using real personal data.

# Start both API and web client together
npm run dev
```

Open **http://localhost:5173**. The API listens on **http://localhost:5000**. To run them separately, use two terminals:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

The client development server proxies `/api/*` to port 5000. The API reports whether MongoDB is connected or JSON fallback is active at `GET /api/health`.

### Windows and VS Code

Windows is supported. Install Node.js 22 LTS (22.12 or newer), extract the ZIP, then in VS Code choose **File → Open Folder** and open the extracted `mediguide-debug` folder. Open **Terminal → New Terminal** (PowerShell is fine), and run the same commands from the project root:

```powershell
npm ci --prefix server
npm ci --prefix client
npm run dev
```

Open `http://localhost:5173` in your browser. If you choose to create a server `.env` file, PowerShell can copy the example with `Copy-Item .env.example server/.env`. The root launcher handles Windows command-shell startup for both the API and client. MongoDB remains optional for local demo use.

### Environment variables

Copy `.env.example` to `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mediguide
JWT_SECRET=replace-this-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

To configure a different local fallback file, set `MEDIGUIDE_DATA_FILE`. Do not use the JSON fallback for production or sensitive medical records. Production deployments should use HTTPS, a managed database, a strong secret manager, and appropriate privacy/security controls.

## Build and validate

```bash
npm run check
npm run test
npm run build
```

With the development API running, exercise the REST feature paths with:

```bash
node scripts/smoke-test.mjs
```

For public hosting on Vercel, follow [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md). It covers the separate frontend/API projects, persistent database setup, and required environment variables.

Production build output is created under `client/dist` and `server/dist`; start the API with `NODE_ENV=production npm run start --prefix server` after building.

## Demo flow

1. Open the dashboard; current seasonal advisories and quick actions are shown.
2. Select **Check Symptoms**, choose **Chest Pain**, and answer **Yes** to radiating pain and shortness of breath. The rules engine marks this combination critical and displays emergency guidance.
3. Use **SOS — Call Ambulance**, confirm the simulated dispatch, and view the mock ETA/map. For a real emergency, call **108**.
4. Open **Find Care** and switch among Hospitals, Clinics, and Pharmacies; try list/map view and radius controls.
5. Open **Profile**, register a demo account, edit health details, then complete an assessment while signed in to see it saved in history.
6. View **Seasonal Health Advisories** from the dashboard link.

## REST API

All paths below are prefixed with `/api`.

| Method | Path | Description |
|---|---|---|
| GET | `/health` | API status and database/fallback mode |
| POST | `/auth/register` | Register and return a JWT |
| POST | `/auth/login` | Authenticate and return a JWT |
| GET | `/symptoms/primary` | List primary symptoms |
| GET | `/symptoms/questions/:id` | Get follow-up questions |
| POST | `/symptoms/assess` | Authenticated assessment, saved to history |
| POST | `/symptoms/assess/guest` | Guest assessment |
| GET | `/hospitals` | Facilities (filters: type, specialty, lat, lng, radius, openNow, limit) |
| GET | `/hospitals/recommend` | Top five hospitals for specialty and location |
| POST | `/emergency/dispatch` | Authenticated mock dispatch |
| POST | `/emergency/dispatch/guest` | Guest mock dispatch |
| GET | `/advisories` | Advisories (optional month and region) |
| GET/PUT | `/profile` | Read/update authenticated health profile |
| GET | `/profile/history` | Latest 50 saved symptom checks |

Authenticated endpoints accept `Authorization: Bearer <JWT>`.

## Safety and limitations

- MediGuide provides general information only and is **not** a substitute for qualified medical advice, diagnosis, or treatment. Seek professional care for health concerns.
- Model probabilities are statistical output, may be wrong or incomplete, and must not guide treatment decisions.
- Ambulance location, route, and ETA are simulated. No ambulance or emergency provider is contacted. Call **108** for an actual emergency in India.
- Sample hospitals/pharmacies and their contact details are demo data and should be verified independently before use.
- The local JSON account store is intended for local demos only; it is not a secure production database.

## License

MIT — hackathon/portfolio demo
