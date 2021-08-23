import React from "react";

import { CrudContextProvider } from "@/context/crud";

export default function AuthLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidePanel
        config={config}
        topContent={sidePanelTopContent}
        bottomContent={sidePanelBottomContent}
        fixHeaderPanel={fixHeaderPanel}
      ></SidePanel>
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
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
