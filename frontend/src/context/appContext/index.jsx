import { useMemo, useReducer, createContext, useContext } from 'react';
import { initialState, contextReducer } from './reducer';
import contextActions from './actions';

const AppContext = createContext();

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const context = useContext(AppContext);
  const state = context?.[0];
  const dispatch = context?.[1];
  const appContextAction = useMemo(() => (dispatch ? contextActions(dispatch) : null), [dispatch]);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  // const appContextSelector = contextSelectors(state);
  return { state, appContextAction };
}

export { AppContextProvider, useAppContext };
