import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { configureChartJS } from '#configs/chartjs';
import { configureDayjs } from '#configs/dayjs';
import { configureZod } from '#configs/zod';
import { store } from '#store';
import { DialogModalContainer } from '#ui/Modal';
import { ScrollLockWatcher } from '#ui/ScrollLock';
import { initTauriStore } from '#utils/tauriStore';

import App from './App';

import 'modern-normalize/modern-normalize.css';
import '@fontsource-variable/open-sans';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/index.scss';
import './styles/global.scss';
import './styles/themes/dark.scss';

configureZod();
configureChartJS();
configureDayjs();

(async () => {
  await initTauriStore();

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <MemoryRouter>
          <App />
          <DialogModalContainer />
          <ScrollLockWatcher />
        </MemoryRouter>
      </Provider>
    </React.StrictMode>,
  );
})();
