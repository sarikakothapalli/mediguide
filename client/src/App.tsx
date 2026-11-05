import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SymptomCheck from './pages/SymptomCheck';
import Clinics from './pages/Clinics';
import Profile from './pages/Profile';
import Emergency from './pages/Emergency';
import EmergencySOS from './pages/EmergencySOS';
import Advisories from './pages/Advisories';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/symptoms" element={<Layout><SymptomCheck /></Layout>} />
        <Route path="/symptom-checker" element={<Layout><SymptomCheck /></Layout>} />
        <Route path="/clinics" element={<Layout><Clinics /></Layout>} />
        <Route path="/hospitals" element={<Layout><Clinics /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/emergency" element={<Layout><Emergency /></Layout>} />
        <Route path="/emergency-sos" element={<Layout><EmergencySOS /></Layout>} />
        <Route path="/advisories" element={<Layout><Advisories /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
