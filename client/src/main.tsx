import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
<<<<<<< HEAD
import { LanguageProvider } from './contexts/LanguageContext';
=======
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
import './index.css';
import 'leaflet/dist/leaflet.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
<<<<<<< HEAD
        <LanguageProvider>
          <App />
        </LanguageProvider>
=======
        <App />
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
