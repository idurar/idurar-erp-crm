import { useMemo, useReducer, createContext, useContext } from 'react';
import { initialState, contextReducer } from './reducer';
import contextActions from './actions';
import contextSelectors from './selectors';

const ErpContext = createContext();

function ErpContextProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <ErpContext.Provider value={value}>{children}</ErpContext.Provider>;
}

function useErpContext() {
  const context = useContext(ErpContext);
  const state = context?.[0];
  const dispatch = context?.[1];
  const erpContextAction = useMemo(() => (dispatch ? contextActions(dispatch) : null), [dispatch]);
  const erpContextSelector = useMemo(() => (state ? contextSelectors(state) : null), [state]);
  if (context === undefined) {
    throw new Error('useErpContext must be used within a ErpContextProvider');
  }
  return { state, erpContextAction, erpContextSelector };
}

export { ErpContextProvider, useErpContext };
