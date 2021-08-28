import React, { useState, useEffect } from "react";
import { useCrudContext } from "@/context/crud";
import { useAppContext } from "@/context/appContext";
import { Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import CollapseBox from "../CollapseBox";

const { Sider } = Layout;

export default function SidePanel({
  config,
  topContent,
  bottomContent,
  fixHeaderPanel,
}) {
  const { state, crudContextAction } = useCrudContext();
  const { isPanelClose, isBoxCollapsed } = state;
  const { panel, collapsedBox } = crudContextAction;
  const [styleSider, setStyleSider] = useState("-1px");
  const [opacitySider, setOpacitySider] = useState("1");

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;

  useEffect(() => {
    if (isPanelClose) {
      setStyleSider("-400px");
      setOpacitySider(0);
    } else {
      if (!isNavMenuClose) {
        navMenu.close();
      }
      setStyleSider("-1px");
      setOpacitySider(1);
    }
    setStyleSider("-1px");
    setOpacitySider(1);
  }, [isPanelClose]);

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
      collapsed={isPanelClose}
      collapsedWidth={"0px"}
      onCollapse={collapsePanel}
      className="sidePanel"
      zeroWidthTriggerStyle={{
        right: "-50px",
        top: "15px",
      }}
      style={{
        background: "#FFF",
        left: styleSider,
        opacity: opacitySider,
      }}
    >
      {fixHeaderPanel}
      <CollapseBox
        buttonTitle="Add new Customer"
        isPanelClose={isPanelClose}
        isCollapsed={isBoxCollapsed}
        onCollapse={collapsePanelBox}
        topContent={topContent}
        bottomContent={bottomContent}
      ></CollapseBox>
    </Sider>
  );
}
