# MediGuide Project TODO

## Phase 1: Database & Configuration
- [x] Define database schema (users, symptom_checks, profiles, health_flags)
- [x] Create symptom_rules.json configuration file
- [x] Create seasonalAdvisories.json configuration file
- [x] Create hospitals seed data with lat/lng and specialties
- [x] Run database migrations

## Phase 2: Design Tokens & Frontend Setup
- [x] Configure Tailwind CSS with design tokens (teal #0D5C63, off-white #FAFAF8, charcoal #1A1A1A)
- [x] Add Inter or IBM Plex Sans font to index.html
- [x] Set up global styles in index.css
- [x] Create severity color utility classes (mild, moderate, severe, critical)
- [x] Set up main navigation and layout structure

## Phase 3: Symptom Checker
- [x] Build symptom_rules.json with comprehensive symptom mappings
- [x] Create backend rules engine service (severity_classifier)
- [x] Create POST /symptoms/assess endpoint
- [x] Build multi-step form component (steps: symptom, onset, duration, associated symptoms, pain scale)
- [x] Create symptom checker results page with severity badge and recommendations
- [x] Add medical disclaimer footer on symptom checker page
- [x] Handle critical severity → surface SOS button prominently
- [x] Write vitest tests for rules engine

## Phase 4: Hospital Recommendations
- [x] Seed 15-20 real Hyderabad hospitals with lat/lng and specialties
- [x] Create backend endpoint to fetch hospitals filtered by specialty
- [x] Implement browser geolocation to get user location
- [x] Calculate distance from user to each hospital
- [x] Create hospital list component with click-to-call and Google Maps directions
- [x] Integrate Leaflet/OpenStreetMap for map display
- [x] Add hospital filtering by specialty
- [x] Write vitest tests for hospital filtering and distance calculation

## Phase 5: Emergency SOS
- [x] Create always-visible fixed SOS button (red, thumb-reachable on mobile)
- [x] Build SOS confirmation modal
- [x] Implement geolocation capture for emergency location
- [x] Create simulated ambulance ETA display with moving map marker
- [x] Add tel:108 fallback link
- [x] Pre-fill emergency summary card (name, blood group, allergies) if user logged in
- [x] Make SOS fully accessible without login
- [ ] Write vitest tests for SOS flow

## Phase 6: Seasonal Advisories
- [ ] Build seasonalAdvisories.json with monsoon/summer/winter health tips
- [ ] Create backend endpoint to fetch seasonal advisories
- [ ] Build seasonal advisories dashboard card feed
- [ ] Implement filtering by user profile health flags (if logged in)
- [ ] Make advisories fully public
- [ ] Write vitest tests for advisory filtering

## Phase 7: User Authentication & Profile
- [ ] Implement Manus OAuth login/logout
- [ ] Create user profile page (name, age, blood group, allergies, conditions)
- [ ] Build profile edit form with validation
- [ ] Create symptom check history page showing past checks with date, severity, outcome
- [ ] Protect profile and history routes (require login)
- [ ] Add user menu/header with login/logout
- [ ] Write vitest tests for auth flow and profile operations

## Phase 8: Mobile Responsiveness & Polish
- [ ] Test all features on mobile viewport (375px width)
- [ ] Ensure SOS button is thumb-reachable and prominent
- [ ] Verify form inputs are touch-friendly (min 44px tap targets)
- [ ] Test geolocation on mobile devices
- [ ] Verify map displays correctly on mobile
- [ ] Check all text meets 16px minimum and 1.5+ line-height
- [ ] Test on iOS and Android browsers
- [ ] Verify no gradients on functional UI elements
- [ ] Test dark mode if applicable

## Phase 9: Integration & Final Testing
- [ ] Test complete symptom checker flow end-to-end
- [ ] Test hospital recommendations with real geolocation
- [ ] Test emergency SOS with simulated ambulance tracking
- [ ] Test seasonal advisories display
- [ ] Test user authentication and profile management
- [ ] Test all public routes work without login
- [ ] Verify medical disclaimer displays on symptom checker
- [ ] Test all click-to-call and directions links
- [ ] Performance testing and optimization
- [ ] Accessibility audit (keyboard navigation, screen readers)

## Phase 10: Deployment
- [ ] Create final checkpoint
- [ ] Publish to production
- [ ] Verify all features work on live domain
- [ ] Monitor for errors and performance issues


## Verification status (2026-09-20)

The active Vite/tRPC implementation has been repaired and verified locally. `pnpm check`, `pnpm test` (22 tests), `pnpm build`, the production server, the symptom tRPC endpoint, and the seasonal advisory tRPC endpoint all pass. The missing symptom router, public advisories page, advisory regression tests, and production `@shared` alias build fix are included.

The remaining unchecked items in the original plan require either browser/device testing, external Manus OAuth/deployment credentials, a production database, or publishing/monitoring access. They are intentionally not marked complete because they cannot be truthfully executed from a standalone local archive. The older `server/src` Express/Mongoose tree is retained as reference code but is not the active production entrypoint.
