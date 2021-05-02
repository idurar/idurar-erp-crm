import React, { useState, useEffect } from "react";
import { useUiContext } from "@/context/ui";
import { Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import CollapseBox from "../CollapseBox";

const { Sider } = Layout;

export default function SidePanel({
  panelTitle,
  searchForm,
  topContent,
  bottomContent,
  fixHeaderPanel,
}) {
  const { state, uiContextAction } = useUiContext();
  const { isPanelCollapsed, isBoxCollapsed } = state;
  const { panel, collapsedBox } = uiContextAction;
  // const [styleSider, setStyleSider] = useState("0px");

  // const [siderCollapse, setSiderCollapse] = useState(isPanelCollapsed);

  // useEffect(() => {
  //   setSiderCollapse(isPanelCollapsed);
  //   // setTimeout(() => {
  //   //   setSiderCollapse(isPanelCollapsed);
  //   // }, 200);
  // }, [isPanelCollapsed]);

  const collapsePanel = () => {
    panel.collapse();
  };

  const collapsePanelBox = () => {
    collapsedBox.collapse();
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
        // left: styleSider,
      }}
    >
      {fixHeaderPanel}
      <CollapseBox
        buttonTitle="Add new Customer"
        isPanelCollapsed={isPanelCollapsed}
        isCollapsed={isBoxCollapsed}
        onCollapse={collapsePanelBox}
        topContent={topContent}
        bottomContent={bottomContent}
      ></CollapseBox>
    </Sider>
  );
}
