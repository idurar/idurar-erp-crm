import React from "react";

import { InvoiceContextProvider } from "@/context/invoice";

function InvoiceContextLayout({ children }) {
  return <InvoiceContextProvider>{children}</InvoiceContextProvider>;
}

export default InvoiceContextLayout;
