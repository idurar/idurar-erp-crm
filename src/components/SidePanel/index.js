import React from "react";
import { useUiContext } from "@/context/ui";
import { Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Accordion from "../Accordion";

const { Sider } = Layout;

export default function SidePanel({ children }) {
  const { state, uiContextAction } = useUiContext();
  const { isPanelCollapsed } = state;
  const { panel } = uiContextAction;

  const collapsePanel = () => {
    panel.collapse();
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
      <Accordion>{children}</Accordion>
    </Sider>
  );
}
