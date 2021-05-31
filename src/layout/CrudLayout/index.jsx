import React from "react";

import DefaultLayout from "../DefaultLayout";
import HeaderContent from "../HeaderContent";

import SidePanel from "@/components/SidePanel";
import { Layout } from "antd";

const { Content } = Layout;

export default function CrudLayout({
  children,
  config,
  sidePanelTopContent,
  sidePanelBottomContent,
  fixHeaderPanel,
}) {
  return (
    <DefaultLayout>
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
    </DefaultLayout>
  );
}
