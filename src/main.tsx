import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Router } from 'wouter';

import { store } from '#store';

import App from './App';

import 'modern-normalize/modern-normalize.css';
import '@fontsource-variable/open-sans';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
);
