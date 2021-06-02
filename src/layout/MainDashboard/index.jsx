import React from "react";
import { CrudContextProvider } from "@/context/crud";

import Navigation from "@/layout/Navigation";

import { Layout } from "antd";

function MainDashboard({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navigation />
      <CrudContextProvider>{children}</CrudContextProvider>
    </Layout>
  );
}

export default MainDashboard;
