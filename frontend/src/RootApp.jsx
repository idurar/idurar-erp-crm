import './style/app.css';

import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';
import { ThemeProvider } from './components/Theme/ThemeContext'
import ThemeToggle from 'components/Theme/ThemeToggle'

const IdurarOs = lazy(() => import('./apps/IdurarOs'));

export default function RoutApp() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<PageLoader />}>
            <IdurarOs />
            <ThemeToggle />
          </Suspense>
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
