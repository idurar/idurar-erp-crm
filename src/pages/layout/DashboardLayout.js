import React, { useState, useEffect } from "react";
import navigationContext from "../../context/NavigationContext";
import HeaderContent from "./HeaderContent";
import FooterContent from "./FooterContent";
import Navigation from "./Navigation";
import { Layout, Space } from "antd";
const { Header, Content, Footer } = Layout;

function DashboardLayout({ contentLayout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <navigationContext.Provider value={{ collapsed, setCollapsed }}>
          <Navigation />
          <Layout className="site-layout">
            <HeaderContent />
            <Content
              className="site-layout-background"
              style={{
                padding: "50px 40px",
                margin: "50px auto",
                width: "100%",
                maxWidth: "1000px",
              }}
            >
              {contentLayout}
            </Content>

            <FooterContent />
          </Layout>
        </navigationContext.Provider>
      </Layout>
    </>
  );
}

export default DashboardLayout;
