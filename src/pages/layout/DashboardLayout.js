import React from "react";
import HeaderContent from "./HeaderContent";
import FooterContent from "./FooterContent";
import Navigation from "./Navigation";
import { Layout } from "antd";

function DashboardLayout({ contentLayout }) {
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Navigation />
        <Layout className="site-layout">
          <HeaderContent />
          {contentLayout}
          <FooterContent />
        </Layout>
      </Layout>
    </>
  );
}

export default DashboardLayout;
