import React, { useState } from "react";
import { useUiContext } from "@/context/ui";
import { Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import CollapseBox from "../CollapseBox";

const { Sider } = Layout;

export default function SidePanel({ children }) {
  const { state, uiContextAction } = useUiContext();
  const { isPanelCollapsed, isAccordionCollapsed } = state;
  const { panel, accordion } = uiContextAction;

  const collapsePanel = () => {
    panel.collapse();
  };

  const collapseAccordion = () => {
    accordion.collapse();
  };

  return (
    <Sider
      trigger={<MenuOutlined className="trigger" />}
      width={400}
      collapsible
      collapsed={isPanelCollapsed}
      collapsedWidth={0}
      onCollapse={collapsePanel}
      zeroWidthTriggerStyle={{
        right: "-50px",
      }}
      style={{
        background: "#FFF",
      }}
    >
      <CollapseBox
        isCollapsed={isAccordionCollapsed}
        onCollapse={collapseAccordion}
      >
        {children}
      </CollapseBox>
    </Sider>
  );
}
