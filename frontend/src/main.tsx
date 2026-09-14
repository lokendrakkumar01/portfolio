import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Immediate backend warm-up ping so Render wakes up right away
const API_URL = import.meta.env.VITE_API_URL || 'https://portfolio-backend-gbzu.onrender.com/api/v1';
const HEALTH_URL = API_URL.replace('/api/v1', '/health');
fetch(HEALTH_URL, { mode: 'no-cors' }).catch(() => {});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);