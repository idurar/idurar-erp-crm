import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import RootApp from './RootApp';

const root = createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <RootApp />
  </GoogleOAuthProvider>
);
