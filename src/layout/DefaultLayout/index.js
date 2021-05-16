import React from "react";

import { UiContextProvider } from "@/context/ui";

function DefaultLayout({ children }) {
  return <UiContextProvider>{children}</UiContextProvider>;
}

export default DefaultLayout;
