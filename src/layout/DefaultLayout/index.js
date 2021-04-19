import React from "react";

import MainDashboard from "../MainDashboard";
import HeaderContent from "../HeaderContent";

import SidePanel from "@/components/SidePanel";
import { Layout } from "antd";

const { Content } = Layout;

export default function DefaultLayout({ children, SidePanelContent }) {
  return (
    <MainDashboard>
      <SidePanel>{SidePanelContent}</SidePanel>
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
    </MainDashboard>
  );
}
