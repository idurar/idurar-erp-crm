import React from "react";

import DefaultLayout from "../DefaultLayout";
import HeaderContent from "../HeaderContent";

import SidePanel from "@/components/SidePanel";
import { Layout } from "antd";
import { useCrudContext } from "@/context/crud";

const { Content } = Layout;

const ContentBox = ({ children }) => {
  const { state } = useCrudContext();
  const { isPanelCollapsed } = state;
  return (
    <Content
      className="site-layout-background whiteBox shadow"
      style={{
        padding: "50px 40px",
        margin: "50px auto",
        width: isPanelCollapsed ? "100%" : "830px",
        maxWidth: "1000px",
      }}
    >
      {children}
    </Content>
  );
};

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
          <ContentBox> {children}</ContentBox>
        </Layout>
      </Layout>
    </DefaultLayout>
  );
}
