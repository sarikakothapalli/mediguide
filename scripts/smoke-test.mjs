const baseUrl = process.env.MEDIGUIDE_API_URL || 'http://127.0.0.1:5000/api';
const email = `smoke-${Date.now()}@example.test`;

async function request(path, { method = 'GET', body, token, expectedStatus = 200 } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json();
  if (response.status !== expectedStatus) {
    throw new Error(`${method} ${path}: expected ${expectedStatus}, got ${response.status}: ${JSON.stringify(payload)}`);
  }
  return payload;
}

const health = await request('/health');
if (health.status !== 'ok') throw new Error('Health check did not report ok');
const primarySymptoms = await request('/symptoms/primary');
if (!primarySymptoms.some((item) => item.id === 'chest_pain')) throw new Error('Chest pain symptom is missing');
const questions = await request('/symptoms/questions/chest_pain');
if (questions.length < 3) throw new Error('Expected follow-up questions for chest pain');
const guestAssessment = await request('/symptoms/assess/guest', {
  method: 'POST',
  body: { primarySymptom: 'chest_pain', answers: { radiatingPain: true, shortnessOfBreath: true } },
});
if (guestAssessment.severity !== 'critical' || !guestAssessment.diseasePrediction?.predictions?.length) {
  throw new Error('Critical symptom assessment or model predictions failed');
}
const facilities = await request('/hospitals?type=pharmacy&limit=20');
if (!facilities.length || facilities.some((facility) => facility.type !== 'pharmacy')) throw new Error('Pharmacy filter failed');
const advisories = await request('/advisories?region=hyderabad');
if (!Array.isArray(advisories)) throw new Error('Advisories response is not a list');
const guestDispatch = await request('/emergency/dispatch/guest', {
  method: 'POST', body: { lat: 17.385, lng: 78.4867, symptomSeverity: 'critical' },
});
if (guestDispatch.status !== 'dispatched' || !guestDispatch.ambulanceStart) throw new Error('Mock dispatch failed');

const registration = await request('/auth/register', {
  method: 'POST', expectedStatus: 201,
  body: { email, password: 'local-smoke-password', name: 'Smoke Test User' },
});
const token = registration.token;
if (!token) throw new Error('Registration did not return a token');
await request('/profile', {
  method: 'PUT', token,
  body: { age: 32, bloodGroup: 'O+', allergies: ['peanuts'], preExistingConditions: ['asthma'], isPregnant: false },
});
const profile = await request('/profile', { token });
if (profile.bloodGroup !== 'O+' || profile.allergies?.[0] !== 'peanuts') throw new Error('Profile read/write failed');
await request('/symptoms/assess', {
  method: 'POST', token,
  body: { primarySymptom: 'chest_pain', answers: { radiatingPain: true, shortnessOfBreath: true } },
});
const history = await request('/profile/history', { token });
if (history.length !== 1 || history[0].severity !== 'critical') throw new Error('Symptom history persistence failed');
const authDispatch = await request('/emergency/dispatch', {
  method: 'POST', token,
  body: { lat: 17.385, lng: 78.4867, symptomSeverity: 'critical' },
});
if (authDispatch.emergencySummary.bloodGroup !== 'O+') throw new Error('Authenticated dispatch did not include profile data');
const login = await request('/auth/login', {
  method: 'POST', body: { email, password: 'local-smoke-password' },
});
if (!login.token) throw new Error('Login failed after registration');

console.log('MediGuide REST smoke test passed: health, symptom questions/assessment/model, facility filter, advisories, guest/auth dispatch, registration/login, profile, and history.');
