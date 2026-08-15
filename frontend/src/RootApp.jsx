import './style/app.css';

import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';
import { Alert } from 'antd';

const IdurarOs = lazy(() => import('./apps/IdurarOs'));

export default function RoutApp() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  // Verify Google OAuth configuration
  useEffect(() => {
    if (!clientId) {
      console.error('Missing Google OAuth Client ID');
    } else if (!clientId.endsWith('.apps.googleusercontent.com')) {
      console.error('Invalid Google OAuth Client ID format');
    } else {
      console.log('Google OAuth configured with Client ID:', clientId.substring(0, 10) + '...');
    }
  }, [clientId]);
  
  if (!clientId || clientId === 'your-client-id-here.apps.googleusercontent.com') {
    // Render an error message with instructions instead of a white page
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div style={{ 
            padding: '40px', 
            maxWidth: '600px', 
            margin: '40px auto' 
          }}>
            <Alert
              message="Configuration Error"
              description={
                <div>
                  <p>Google OAuth client ID is not properly configured.</p>
                  <p>Please follow these steps:</p>
                  <ol>
                    <li>Go to Google Cloud Console</li>
                    <li>Create or select a project</li>
                    <li>Enable OAuth 2.0 configuration</li>
                    <li>Create OAuth credentials</li>
                    <li>Copy your Client ID</li>
                    <li>Open the .env file in your frontend directory</li>
                    <li>Replace 'your-client-id-here' with your actual Client ID</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              }
              type="error"
              showIcon
            />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <IdurarOs />
          </Suspense>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  );
}
