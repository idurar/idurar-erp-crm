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
  if (context === undefined) {
    throw new Error('useErpContext must be used within a ErpContextProvider');
  }
  const [state, dispatch] = context;
  const erpContextAction = contextActions(dispatch);
  const erpContextSelector = contextSelectors(state);
  return { state, erpContextAction, erpContextSelector };
}

export { ErpContextProvider, useErpContext };
