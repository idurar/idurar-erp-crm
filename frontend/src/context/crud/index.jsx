import { useMemo, useReducer, createContext, useContext } from 'react';
import { initialState, contextReducer } from './reducer';
import contextActions from './actions';
import contextSelectors from './selectors';

const CrudContext = createContext();

function CrudContextProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <CrudContext.Provider value={value}>{children}</CrudContext.Provider>;
}

function useCrudContext() {
  const context = useContext(CrudContext);
  const state = context?.[0];
  const dispatch = context?.[1];
  const crudContextAction = useMemo(() => (dispatch ? contextActions(dispatch) : null), [dispatch]);
  const crudContextSelector = useMemo(() => (state ? contextSelectors(state) : null), [state]);
  if (context === undefined) {
    throw new Error('useCrudContext must be used within a CrudContextProvider');
  }
  return { state, crudContextAction, crudContextSelector };
}

export { CrudContextProvider, useCrudContext };
