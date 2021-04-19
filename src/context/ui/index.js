import React, { useMemo, useReducer, createContext, useContext } from "react";
import { initialState, contextReducer } from "./reducer";
import contextActions from "./actions";
import contextSelectors from "./selectors";

const UiContext = createContext();

function UiContextProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

function useUiContext() {
  const context = useContext(UiContext);
  if (context === undefined) {
    throw new Error("useUiContext must be used within a UiContextProvider");
  }
  const [state, dispatch] = context;
  const uiContextAction = contextActions(dispatch);
  const uiContextSelector = contextSelectors(state);
  return { state, uiContextAction, uiContextSelector };
}

export { UiContextProvider, useUiContext };
