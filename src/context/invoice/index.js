import React, { useMemo, useReducer, createContext, useContext } from "react";
import { initialState, contextReducer } from "./reducer";
import contextActions from "./actions";
import contextSelectors from "./selectors";

const InvoiceContext = createContext();

function InvoiceContextProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

function useInvoiceContext() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error(
      "useInvoiceContext must be used within a InvoiceContextProvider"
    );
  }
  const [state, dispatch] = context;
  const invoiceContextAction = contextActions(dispatch);
  const invoiceContextSelector = contextSelectors(state);
  return { state, invoiceContextAction, invoiceContextSelector };
}

export { InvoiceContextProvider, useInvoiceContext };
