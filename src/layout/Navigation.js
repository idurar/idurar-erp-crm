import React, { useState, useContext } from "react";

import NavigationContext from "../../context/NavigationContext";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { SubMenu } = Menu;

function Navigation() {
  const { collapsed } = useContext(NavigationContext);
  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        // onCollapse={() => onSetCollapsed(collapsed)}
      >
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/" />
            Home Page
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/customer">
              <CustomerServiceOutlined />
              <span>Customer Page</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="21" icon={<CustomerServiceOutlined />}>
            <Link to="/patient" />
            Patient Page
          </Menu.Item>
          <Menu.Item key="3" icon={<DesktopOutlined />}>
            <Link to="/days" />
            Days Page
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="4">Tom</Menu.Item>
            <Menu.Item key="5">Bill</Menu.Item>
            <Menu.Item key="6">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="7">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    </>
  );
}
export default Navigation;
