import React from "react";
import { Layout, Avatar, Menu, Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { Header } = Layout;

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.alipay.com/"
      >
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.taobao.com/"
      >
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

const HeaderContent = () => (
  <Header className="site-layout-background" style={{ padding: 0 }}>
    <Dropdown overlay={menu} placement="bottomRight" arrow>
      <Avatar icon={<UserOutlined />} />
    </Dropdown>
  </Header>
);

export default HeaderContent;
