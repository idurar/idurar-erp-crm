import { configureStore } from '@reduxjs/toolkit';

import lang from '@/locale/translation/en_us';

import rootReducer from './rootReducer';
import storePersist from './storePersist';

// Safely load auth state from localStorage
const getAuthState = () => {
  try {
    const stored = storePersist.get('auth');
    if (!stored) {
      console.log('📦 No auth state in localStorage');
      return null;
    }
    
    // Validate the stored state is valid and not stuck in loading
    if (stored.isLoading === true) {
      console.warn('⚠️ Clearing corrupted auth state with isLoading=true');
      storePersist.remove('auth');
      return null;
    }
    
    // Verify the user has a valid token and current data
    if (!stored.current || !stored.current.token) {
      console.warn('⚠️ Clearing auth state without valid token');
      storePersist.remove('auth');
      return null;
    }
    
    console.log('📦 Loaded auth state from localStorage');
    // Ensure isLoading is always false on initialization
    return {
      ...stored,
      isLoading: false,
    };
  } catch (error) {
    console.error('❌ Error loading auth state:', error);
    return null;
  }
};

const authState = getAuthState();

// Create preloadedState only with auth if it exists
const preloadedState = authState ? { auth: authState } : undefined;

const store = configureStore({
  reducer: rootReducer,
  ...(preloadedState && { preloadedState }),
  devTools: import.meta.env.PROD === false,
});

console.log('✅ Redux store created successfully');
console.log(
  '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
);

export default store;
