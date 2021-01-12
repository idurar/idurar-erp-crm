import React from "react";
import HeaderContent from "./mixins/HeaderContent";
import FooterContent from "./mixins/FooterContent";
import Navigation from "./mixins/Navigation";
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
