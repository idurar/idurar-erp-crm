import React, { useEffect } from "react";

import DefaultLayout from "../DefaultLayout";
import HeaderContent from "../HeaderContent";

import SidePanel from "@/components/SidePanel";
import { Layout } from "antd";
import { useCrudContext } from "@/context/crud";
import { useAppContext } from "@/context/appContext";

const { Content } = Layout;

const ContentBox = ({ children }) => {
  const { state: stateCrud, crudContextAction } = useCrudContext();
  const { state: stateApp, appContextAction } = useAppContext();
  const { isPanelClose } = stateCrud;
  const { isNavMenuClose } = stateApp;
  const { panel } = crudContextAction;
  useEffect(() => {
    if (!isNavMenuClose) {
      panel.close();
    }
  }, [isNavMenuClose]);
  return (
    <Content
      className="site-layout-background whiteBox shadow"
      style={{
        padding: "50px 40px",
        margin: "50px auto",
        width: isPanelClose ? "100%" : "830px",
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
