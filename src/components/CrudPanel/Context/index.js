import React, { useMemo, useReducer, createContext, useContext } from "react";
import { initialState, contextReducer } from "./reducer";
import contextAction from "./actions";
import contextSelector from "./contextSelector";

const CrudContext = createContext();

function CrudProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <CrudContext.Provider value={value}>{children}</CrudContext.Provider>;
}

function useCrudContext() {
  const context = useContext(CrudContext);
  if (context === undefined) {
    throw new Error("useCrud must be used within a CrudProvider");
  }
  const [state, dispatch] = context;
  const crudContextAction = contextAction(dispatch);
  const crudContextSelector = contextSelector(state);
  return { state, crudContextAction, crudContextSelector };
}

export { CrudProvider, useCrudContext };
