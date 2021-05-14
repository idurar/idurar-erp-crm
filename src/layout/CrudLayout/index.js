import React from "react";

import DefaultLayout from "../DefaultLayout";
import HeaderContent from "../HeaderContent";

import SidePanel from "@/components/SidePanel";
import { Layout } from "antd";

const { Content } = Layout;

export default function CrudLayout({
  children,
  sidePanelTopContent,
  sidePanelBottomContent,
}) {
  return (
    <DefaultLayout>
      <SidePanel
        topContent={sidePanelTopContent}
        bottomContent={sidePanelBottomContent}
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
    </DefaultLayout>
  );
}
