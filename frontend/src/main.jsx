import React from 'react';

import App from './app';
import './style/app.css';
// import * as serviceWorker from './serviceWorker';

import { Router as RouterHistory } from 'react-router-dom';
import { Provider } from 'react-redux';
import history from '@/utils/history';
import store from '@/redux/store';

import { AppContextProvider } from '@/context/appContext';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <RouterHistory history={history}>
    <Provider store={store}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Provider>
  </RouterHistory>
);
