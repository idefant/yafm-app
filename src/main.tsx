import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'wouter';

import App from './App';

import 'modern-normalize/modern-normalize.css';
import '@fontsource-variable/open-sans';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
