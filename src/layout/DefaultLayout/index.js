import React from "react";

import { UiContextProvider } from "@/context/ui";
import Navigation from "@/components/Navigation";

import { Layout } from "antd";

function DefaultLayout({ children }) {
  return <UiContextProvider>{children}</UiContextProvider>;
}

export default DefaultLayout;
