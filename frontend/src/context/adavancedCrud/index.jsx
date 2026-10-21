import { useMemo, useReducer, createContext, useContext } from 'react';
import { initialState, contextReducer } from './reducer';
import contextActions from './actions';
import contextSelectors from './selectors';

const AdavancedCrudContext = createContext();

function AdavancedCrudContextProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <AdavancedCrudContext.Provider value={value}>{children}</AdavancedCrudContext.Provider>;
}

function useAdavancedCrudContext() {
  const context = useContext(AdavancedCrudContext);
  const state = context?.[0];
  const dispatch = context?.[1];
  const adavancedCrudContextAction = useMemo(
    () => (dispatch ? contextActions(dispatch) : null),
    [dispatch]
  );
  const adavancedCrudContextSelector = useMemo(
    () => (state ? contextSelectors(state) : null),
    [state]
  );
  if (context === undefined) {
    throw new Error('useAdavancedCrudContext must be used within a AdavancedCrudContextProvider');
  }
  return { state, adavancedCrudContextAction, adavancedCrudContextSelector };
}

export { AdavancedCrudContextProvider, useAdavancedCrudContext };
